-- =====================================================
-- IoTLinker Enterprise - Database Schema Migration
-- Version: 1.0
-- Description: Initial schema with multi-tenancy, RBAC, and IoT device management
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ORGANIZATIONS & TENANTS
-- =====================================================

-- Organizations table (top-level entity)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    billing_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenants table (multi-tenant isolation)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    configuration JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    max_devices INTEGER DEFAULT 100,
    max_users INTEGER DEFAULT 10,
    tier VARCHAR(50) DEFAULT 'starter' CHECK (tier IN ('starter', 'professional', 'enterprise')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_org_subdomain UNIQUE (organization_id, subdomain)
);

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- Users table (integrates with Clerk)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    clerk_user_id VARCHAR(255) UNIQUE, -- Clerk external ID
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    phone_number VARCHAR(50),
    profile JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_tenant_email UNIQUE (tenant_id, email)
);

-- User sessions (track active sessions)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(500) NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROLE-BASED ACCESS CONTROL (RBAC)
-- =====================================================

-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false, -- System roles cannot be deleted
    permissions JSONB DEFAULT '[]', -- Array of permission strings
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_tenant_role_name UNIQUE (tenant_id, name)
);

-- User-Role assignments (many-to-many)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_role UNIQUE (user_id, role_id)
);

-- Permissions table (granular permissions)
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL, -- e.g., 'devices', 'workflows', 'analytics'
    action VARCHAR(50) NOT NULL, -- e.g., 'read', 'write', 'delete', 'execute'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_resource_action UNIQUE (resource, action)
);

-- =====================================================
-- DEVICE MANAGEMENT
-- =====================================================

-- Device types (templates for device configurations)
CREATE TABLE device_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    default_configuration JSONB DEFAULT '{}',
    sensor_schema JSONB DEFAULT '{}', -- JSON schema for sensor data
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Devices table
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    device_type_id UUID REFERENCES device_types(id),
    name VARCHAR(255) NOT NULL,
    device_key VARCHAR(500) UNIQUE NOT NULL, -- For MQTT authentication
    device_secret VARCHAR(500) NOT NULL, -- Encrypted secret
    description TEXT,
    location JSONB, -- { "latitude": 0, "longitude": 0, "address": "" }
    metadata JSONB DEFAULT '{}',
    configuration JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'warning', 'error', 'maintenance')),
    firmware_version VARCHAR(50),
    last_seen TIMESTAMPTZ,
    last_ip_address INET,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_tenant_device_name UNIQUE (tenant_id, name)
);

-- Device data (time-series sensor data) - Will be converted to TimescaleDB hypertable
CREATE TABLE device_data (
    time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    value DOUBLE PRECISION,
    unit VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    quality_score INTEGER DEFAULT 100 CHECK (quality_score >= 0 AND quality_score <= 100),
    PRIMARY KEY (device_id, time, metric_name)
);

-- Device connections log
CREATE TABLE device_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    disconnected_at TIMESTAMPTZ,
    ip_address INET,
    protocol VARCHAR(50), -- 'mqtt', 'http', 'websocket'
    metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- ALERTS & NOTIFICATIONS
-- =====================================================

-- Alert rules
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    condition JSONB NOT NULL, -- { "metric": "temperature", "operator": ">", "threshold": 75 }
    severity VARCHAR(50) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
    is_active BOOLEAN DEFAULT true,
    notification_channels JSONB DEFAULT '[]', -- ['email', 'sms', 'webhook']
    cooldown_minutes INTEGER DEFAULT 5,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert instances (triggered alerts)
CREATE TABLE alert_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    severity VARCHAR(50) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}', -- Snapshot of sensor data that triggered alert
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMPTZ
);

-- Notification channels
CREATE TABLE notification_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'sms', 'webhook', 'slack', 'teams')),
    configuration JSONB NOT NULL, -- { "url": "...", "recipients": [...] }
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_tenant_channel_name UNIQUE (tenant_id, name)
);

-- =====================================================
-- WORKFLOWS & AUTOMATION
-- =====================================================

-- Workflows
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_config JSONB NOT NULL, -- Trigger definition
    steps JSONB NOT NULL, -- Workflow steps as JSON array
    is_active BOOLEAN DEFAULT true,
    schedule JSONB, -- Cron schedule if applicable
    last_executed_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_tenant_workflow_name UNIQUE (tenant_id, name)
);

-- Workflow executions
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    error_message TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER
);

-- =====================================================
-- ANALYTICS & PREDICTIONS
-- =====================================================

-- Anomalies detected by AI
CREATE TABLE anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metric_name VARCHAR(100) NOT NULL,
    expected_value DOUBLE PRECISION,
    actual_value DOUBLE PRECISION,
    deviation_percentage DOUBLE PRECISION,
    confidence_score DOUBLE PRECISION CHECK (confidence_score >= 0 AND confidence_score <= 1),
    severity VARCHAR(50) CHECK (severity IN ('low', 'medium', 'high')),
    metadata JSONB DEFAULT '{}'
);

-- Predictions (predictive maintenance)
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    prediction_type VARCHAR(100) NOT NULL, -- 'failure', 'maintenance_required', 'performance_degradation'
    predicted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    prediction_time TIMESTAMPTZ NOT NULL, -- When the event is predicted to occur
    probability DOUBLE PRECISION CHECK (probability >= 0 AND probability <= 1),
    confidence DOUBLE PRECISION CHECK (confidence >= 0 AND confidence <= 1),
    model_version VARCHAR(50),
    features_used JSONB,
    recommended_actions JSONB DEFAULT '[]'
);

-- =====================================================
-- API ACCESS & TOKENS
-- =====================================================

-- API tokens for programmatic access
CREATE TABLE api_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    token_hash VARCHAR(500) NOT NULL UNIQUE,
    scopes JSONB DEFAULT '[]', -- Array of allowed scopes
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUDIT LOGGING
-- =====================================================

-- Audit log for tracking all important actions
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', 'execute'
    resource_type VARCHAR(100) NOT NULL, -- 'device', 'user', 'workflow', etc.
    resource_id UUID,
    changes JSONB, -- Before/after snapshot
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(50) DEFAULT 'success' CHECK (status IN ('success', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Organizations & Tenants
CREATE INDEX idx_tenants_organization_id ON tenants(organization_id);
CREATE INDEX idx_tenants_active ON tenants(active) WHERE active = true;

-- Users
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_clerk_user_id ON users(clerk_user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- RBAC
CREATE INDEX idx_roles_tenant_id ON roles(tenant_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- Devices
CREATE INDEX idx_devices_tenant_id ON devices(tenant_id);
CREATE INDEX idx_devices_device_type_id ON devices(device_type_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_last_seen ON devices(last_seen DESC);
CREATE INDEX idx_devices_device_key ON devices(device_key);
CREATE INDEX idx_device_metadata_gin ON devices USING GIN (metadata);

-- Device Data (time-series optimization)
CREATE INDEX idx_device_data_device_time ON device_data(device_id, time DESC);
CREATE INDEX idx_device_data_tenant_time ON device_data(tenant_id, time DESC);
CREATE INDEX idx_device_data_metric_time ON device_data(metric_name, time DESC);

-- Device Connections
CREATE INDEX idx_device_connections_device_id ON device_connections(device_id);
CREATE INDEX idx_device_connections_connected_at ON device_connections(connected_at DESC);

-- Alerts
CREATE INDEX idx_alerts_tenant_id ON alerts(tenant_id);
CREATE INDEX idx_alerts_device_id ON alerts(device_id);
CREATE INDEX idx_alerts_is_active ON alerts(is_active) WHERE is_active = true;
CREATE INDEX idx_alert_instances_alert_id ON alert_instances(alert_id);
CREATE INDEX idx_alert_instances_device_id ON alert_instances(device_id);
CREATE INDEX idx_alert_instances_triggered_at ON alert_instances(triggered_at DESC);
CREATE INDEX idx_alert_instances_acknowledged ON alert_instances(acknowledged) WHERE acknowledged = false;

-- Workflows
CREATE INDEX idx_workflows_tenant_id ON workflows(tenant_id);
CREATE INDEX idx_workflows_is_active ON workflows(is_active) WHERE is_active = true;
CREATE INDEX idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX idx_workflow_executions_started_at ON workflow_executions(started_at DESC);

-- Analytics
CREATE INDEX idx_anomalies_device_id ON anomalies(device_id);
CREATE INDEX idx_anomalies_tenant_id ON anomalies(tenant_id);
CREATE INDEX idx_anomalies_detected_at ON anomalies(detected_at DESC);
CREATE INDEX idx_predictions_device_id ON predictions(device_id);
CREATE INDEX idx_predictions_tenant_id ON predictions(tenant_id);
CREATE INDEX idx_predictions_prediction_time ON predictions(prediction_time);

-- API Tokens
CREATE INDEX idx_api_tokens_tenant_id ON api_tokens(tenant_id);
CREATE INDEX idx_api_tokens_user_id ON api_tokens(user_id);
CREATE INDEX idx_api_tokens_token_hash ON api_tokens(token_hash);
CREATE INDEX idx_api_tokens_is_active ON api_tokens(is_active) WHERE is_active = true;

-- Audit Logs
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource_type_id ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_types_updated_at BEFORE UPDATE ON device_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_channels_updated_at BEFORE UPDATE ON notification_channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate device key
CREATE OR REPLACE FUNCTION generate_device_key()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.device_key IS NULL THEN
        NEW.device_key := 'dev_' || encode(gen_random_bytes(16), 'hex');
    END IF;
    IF NEW.device_secret IS NULL THEN
        NEW.device_secret := encode(gen_random_bytes(32), 'hex');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_device_credentials BEFORE INSERT ON devices
    FOR EACH ROW EXECUTE FUNCTION generate_device_key();

-- Function to auto-resolve alerts
CREATE OR REPLACE FUNCTION auto_resolve_alert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.resolved_at IS NOT NULL AND OLD.resolved_at IS NULL THEN
        NEW.acknowledged := true;
        NEW.acknowledged_at := NEW.resolved_at;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_resolve_alert_instance BEFORE UPDATE ON alert_instances
    FOR EACH ROW EXECUTE FUNCTION auto_resolve_alert();
