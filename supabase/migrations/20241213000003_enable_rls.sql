-- =====================================================
-- IoTLinker Enterprise - Row-Level Security (RLS)
-- Version: 1.0
-- Description: Multi-tenant isolation and security policies
-- =====================================================

-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================

-- Function to get current user's tenant_id from JWT or session
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
DECLARE
    tenant_uuid UUID;
BEGIN
    -- Try to get tenant_id from JWT claims (Supabase auth)
    tenant_uuid := current_setting('request.jwt.claims', true)::json->>'tenant_id';

    -- If not in JWT, try from app settings
    IF tenant_uuid IS NULL THEN
        tenant_uuid := current_setting('app.current_tenant_id', true)::UUID;
    END IF;

    RETURN tenant_uuid;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user has permission
CREATE OR REPLACE FUNCTION has_permission(
    p_resource VARCHAR,
    p_action VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    user_uuid UUID;
    has_perm BOOLEAN;
BEGIN
    -- Get current user ID from JWT
    user_uuid := current_setting('request.jwt.claims', true)::json->>'sub';

    IF user_uuid IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Check if user has the permission through their roles
    SELECT EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = user_uuid
            AND r.permissions @> jsonb_build_array(
                jsonb_build_object(
                    'resource', p_resource,
                    'action', p_action
                )
            )
    ) INTO has_perm;

    RETURN COALESCE(has_perm, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    user_uuid UUID;
    is_user_admin BOOLEAN;
BEGIN
    user_uuid := current_setting('request.jwt.claims', true)::json->>'sub';

    IF user_uuid IS NULL THEN
        RETURN FALSE;
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = user_uuid
            AND r.name IN ('Super Admin', 'Tenant Admin')
    ) INTO is_user_admin;

    RETURN COALESCE(is_user_admin, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - TENANTS
-- =====================================================

-- Users can only see their own tenant
CREATE POLICY tenant_isolation_select ON tenants
    FOR SELECT
    USING (id = get_current_tenant_id() OR is_admin());

CREATE POLICY tenant_isolation_insert ON tenants
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY tenant_isolation_update ON tenants
    FOR UPDATE
    USING (id = get_current_tenant_id() AND is_admin());

CREATE POLICY tenant_isolation_delete ON tenants
    FOR DELETE
    USING (is_admin());

-- =====================================================
-- RLS POLICIES - ORGANIZATIONS
-- =====================================================

CREATE POLICY organization_select ON organizations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM tenants t
            WHERE t.organization_id = organizations.id
                AND t.id = get_current_tenant_id()
        ) OR is_admin()
    );

CREATE POLICY organization_admin_all ON organizations
    FOR ALL
    USING (is_admin());

-- =====================================================
-- RLS POLICIES - USERS
-- =====================================================

CREATE POLICY users_tenant_isolation ON users
    FOR SELECT
    USING (tenant_id = get_current_tenant_id());

CREATE POLICY users_insert ON users
    FOR INSERT
    WITH CHECK (tenant_id = get_current_tenant_id() AND has_permission('users', 'write'));

CREATE POLICY users_update ON users
    FOR UPDATE
    USING (
        tenant_id = get_current_tenant_id() AND (
            id = (current_setting('request.jwt.claims', true)::json->>'sub')::UUID OR
            has_permission('users', 'write')
        )
    );

CREATE POLICY users_delete ON users
    FOR DELETE
    USING (tenant_id = get_current_tenant_id() AND has_permission('users', 'delete'));

-- =====================================================
-- RLS POLICIES - DEVICES
-- =====================================================

CREATE POLICY devices_tenant_isolation ON devices
    FOR SELECT
    USING (tenant_id = get_current_tenant_id());

CREATE POLICY devices_insert ON devices
    FOR INSERT
    WITH CHECK (tenant_id = get_current_tenant_id() AND has_permission('devices', 'write'));

CREATE POLICY devices_update ON devices
    FOR UPDATE
    USING (tenant_id = get_current_tenant_id() AND has_permission('devices', 'write'));

CREATE POLICY devices_delete ON devices
    FOR DELETE
    USING (tenant_id = get_current_tenant_id() AND has_permission('devices', 'delete'));

-- =====================================================
-- RLS POLICIES - DEVICE DATA (Critical for multi-tenancy)
-- =====================================================

CREATE POLICY device_data_tenant_isolation ON device_data
    FOR SELECT
    USING (tenant_id = get_current_tenant_id());

CREATE POLICY device_data_insert ON device_data
    FOR INSERT
    WITH CHECK (
        tenant_id = get_current_tenant_id() AND
        EXISTS (
            SELECT 1 FROM devices d
            WHERE d.id = device_data.device_id
                AND d.tenant_id = device_data.tenant_id
        )
    );

-- Device data should not be updated or deleted by users (insert-only for data integrity)
CREATE POLICY device_data_admin_update ON device_data
    FOR UPDATE
    USING (is_admin());

CREATE POLICY device_data_admin_delete ON device_data
    FOR DELETE
    USING (is_admin());

-- =====================================================
-- RLS POLICIES - DEVICE CONNECTIONS
-- =====================================================

CREATE POLICY device_connections_tenant_isolation ON device_connections
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM devices d
            WHERE d.id = device_connections.device_id
                AND d.tenant_id = get_current_tenant_id()
        )
    );

CREATE POLICY device_connections_insert ON device_connections
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM devices d
            WHERE d.id = device_connections.device_id
                AND d.tenant_id = get_current_tenant_id()
        )
    );

-- =====================================================
-- RLS POLICIES - ALERTS
-- =====================================================

CREATE POLICY alerts_tenant_isolation ON alerts
    FOR SELECT
    USING (tenant_id = get_current_tenant_id());

CREATE POLICY alerts_insert ON alerts
    FOR INSERT
    WITH CHECK (tenant_id = get_current_tenant_id() AND has_permission('alerts', 'write'));

CREATE POLICY alerts_update ON alerts
    FOR UPDATE
    USING (tenant_id = get_current_tenant_id() AND has_permission('alerts', 'write'));

CREATE POLICY alerts_delete ON alerts
    FOR DELETE
    USING (tenant_id = get_current_tenant_id() AND has_permission('alerts', 'delete'));

-- =====================================================
-- RLS POLICIES - ALERT INSTANCES
-- =====================================================

CREATE POLICY alert_instances_tenant_isolation ON alert_instances
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM alerts a
            WHERE a.id = alert_instances.alert_id
                AND a.tenant_id = get_current_tenant_id()
        )
    );

CREATE POLICY alert_instances_insert ON alert_instances
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM alerts a
            WHERE a.id = alert_instances.alert_id
                AND a.tenant_id = get_current_tenant_id()
        )
    );

CREATE POLICY alert_instances_update ON alert_instances
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM alerts a
            WHERE a.id = alert_instances.alert_id
                AND a.tenant_id = get_current_tenant_id()
        )
    );

-- =====================================================
-- RLS POLICIES - WORKFLOWS
-- =====================================================

CREATE POLICY workflows_tenant_isolation ON workflows
    FOR SELECT
    USING (tenant_id = get_current_tenant_id());

CREATE POLICY workflows_insert ON workflows
    FOR INSERT
    WITH CHECK (tenant_id = get_current_tenant_id() AND has_permission('workflows', 'write'));

CREATE POLICY workflows_update ON workflows
    FOR UPDATE
    USING (tenant_id = get_current_tenant_id() AND has_permission('workflows', 'write'));

CREATE POLICY workflows_delete ON workflows
    FOR DELETE
    USING (tenant_id = get_current_tenant_id() AND has_permission('workflows', 'delete'));

-- =====================================================
-- RLS POLICIES - WORKFLOW EXECUTIONS
-- =====================================================

CREATE POLICY workflow_executions_tenant_isolation ON workflow_executions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workflows w
            WHERE w.id = workflow_executions.workflow_id
                AND w.tenant_id = get_current_tenant_id()
        )
    );

CREATE POLICY workflow_executions_insert ON workflow_executions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workflows w
            WHERE w.id = workflow_executions.workflow_id
                AND w.tenant_id = get_current_tenant_id()
        )
    );

-- =====================================================
-- RLS POLICIES - ANALYTICS (Anomalies & Predictions)
-- =====================================================

CREATE POLICY anomalies_tenant_isolation ON anomalies
    FOR SELECT
    USING (tenant_id = get_current_tenant_id());

CREATE POLICY anomalies_insert ON anomalies
    FOR INSERT
    WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY predictions_tenant_isolation ON predictions
    FOR SELECT
    USING (tenant_id = get_current_tenant_id());

CREATE POLICY predictions_insert ON predictions
    FOR INSERT
    WITH CHECK (tenant_id = get_current_tenant_id());

-- =====================================================
-- RLS POLICIES - API TOKENS
-- =====================================================

CREATE POLICY api_tokens_tenant_isolation ON api_tokens
    FOR SELECT
    USING (tenant_id = get_current_tenant_id());

CREATE POLICY api_tokens_insert ON api_tokens
    FOR INSERT
    WITH CHECK (tenant_id = get_current_tenant_id() AND has_permission('api_tokens', 'write'));

CREATE POLICY api_tokens_update ON api_tokens
    FOR UPDATE
    USING (tenant_id = get_current_tenant_id() AND has_permission('api_tokens', 'write'));

CREATE POLICY api_tokens_delete ON api_tokens
    FOR DELETE
    USING (tenant_id = get_current_tenant_id() AND has_permission('api_tokens', 'delete'));

-- =====================================================
-- RLS POLICIES - AUDIT LOGS
-- =====================================================

CREATE POLICY audit_logs_tenant_isolation ON audit_logs
    FOR SELECT
    USING (tenant_id = get_current_tenant_id() OR is_admin());

CREATE POLICY audit_logs_insert ON audit_logs
    FOR INSERT
    WITH CHECK (tenant_id = get_current_tenant_id() OR is_admin());

-- Audit logs cannot be updated or deleted (data integrity)
CREATE POLICY audit_logs_no_update ON audit_logs
    FOR UPDATE
    USING (FALSE);

CREATE POLICY audit_logs_no_delete ON audit_logs
    FOR DELETE
    USING (FALSE);

-- =====================================================
-- RLS POLICIES - ROLES & PERMISSIONS
-- =====================================================

CREATE POLICY roles_tenant_isolation ON roles
    FOR SELECT
    USING (tenant_id = get_current_tenant_id() OR tenant_id IS NULL);

CREATE POLICY roles_admin_only ON roles
    FOR ALL
    USING (is_admin());

CREATE POLICY user_roles_tenant_isolation ON user_roles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = user_roles.user_id
                AND u.tenant_id = get_current_tenant_id()
        )
    );

CREATE POLICY user_roles_admin_manage ON user_roles
    FOR ALL
    USING (is_admin() OR has_permission('users', 'write'));

-- Permissions are global and read-only for all authenticated users
CREATE POLICY permissions_read_all ON permissions
    FOR SELECT
    USING (TRUE);

-- =====================================================
-- RLS POLICIES - DEVICE TYPES
-- =====================================================

-- Device types are global and read-only for all users
CREATE POLICY device_types_read_all ON device_types
    FOR SELECT
    USING (TRUE);

CREATE POLICY device_types_admin_only ON device_types
    FOR ALL
    USING (is_admin());

-- =====================================================
-- RLS POLICIES - NOTIFICATION CHANNELS
-- =====================================================

CREATE POLICY notification_channels_tenant_isolation ON notification_channels
    FOR SELECT
    USING (tenant_id = get_current_tenant_id());

CREATE POLICY notification_channels_insert ON notification_channels
    FOR INSERT
    WITH CHECK (tenant_id = get_current_tenant_id() AND has_permission('notifications', 'write'));

CREATE POLICY notification_channels_update ON notification_channels
    FOR UPDATE
    USING (tenant_id = get_current_tenant_id() AND has_permission('notifications', 'write'));

CREATE POLICY notification_channels_delete ON notification_channels
    FOR DELETE
    USING (tenant_id = get_current_tenant_id() AND has_permission('notifications', 'delete'));

-- =====================================================
-- RLS POLICIES - USER SESSIONS
-- =====================================================

CREATE POLICY user_sessions_own_sessions ON user_sessions
    FOR SELECT
    USING (
        user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::UUID
    );

CREATE POLICY user_sessions_insert_own ON user_sessions
    FOR INSERT
    WITH CHECK (
        user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::UUID
    );

CREATE POLICY user_sessions_delete_own ON user_sessions
    FOR DELETE
    USING (
        user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::UUID
    );

-- =====================================================
-- GRANT PERMISSIONS TO AUTHENTICATED USERS
-- =====================================================

-- Grant necessary permissions to authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION get_current_tenant_id IS 'Get current user tenant ID from JWT claims';
COMMENT ON FUNCTION has_permission IS 'Check if current user has specific permission';
COMMENT ON FUNCTION is_admin IS 'Check if current user has admin role';
