-- =====================================================
-- IoTLinker Enterprise - RBAC Seed Data
-- Version: 1.0
-- Description: Initial roles, permissions, and device types
-- =====================================================

-- =====================================================
-- PERMISSIONS (Granular permissions)
-- =====================================================

INSERT INTO permissions (resource, action, description) VALUES
    -- Device permissions
    ('devices', 'read', 'View devices and their data'),
    ('devices', 'write', 'Create and update devices'),
    ('devices', 'delete', 'Delete devices'),
    ('devices', 'execute', 'Execute device commands'),

    -- User permissions
    ('users', 'read', 'View users'),
    ('users', 'write', 'Create and update users'),
    ('users', 'delete', 'Delete users'),

    -- Workflow permissions
    ('workflows', 'read', 'View workflows'),
    ('workflows', 'write', 'Create and update workflows'),
    ('workflows', 'delete', 'Delete workflows'),
    ('workflows', 'execute', 'Execute workflows'),

    -- Alert permissions
    ('alerts', 'read', 'View alerts'),
    ('alerts', 'write', 'Create and update alerts'),
    ('alerts', 'delete', 'Delete alerts'),
    ('alerts', 'acknowledge', 'Acknowledge alerts'),

    -- Analytics permissions
    ('analytics', 'read', 'View analytics and insights'),
    ('analytics', 'export', 'Export analytics data'),

    -- API permissions
    ('api_tokens', 'read', 'View API tokens'),
    ('api_tokens', 'write', 'Create and update API tokens'),
    ('api_tokens', 'delete', 'Revoke API tokens'),

    -- Notification permissions
    ('notifications', 'read', 'View notification channels'),
    ('notifications', 'write', 'Create and update notification channels'),
    ('notifications', 'delete', 'Delete notification channels'),

    -- Tenant permissions
    ('tenants', 'read', 'View tenant information'),
    ('tenants', 'write', 'Update tenant settings'),
    ('tenants', 'admin', 'Full tenant administration'),

    -- Audit permissions
    ('audit_logs', 'read', 'View audit logs'),

    -- System permissions
    ('system', 'admin', 'Full system administration')
ON CONFLICT (resource, action) DO NOTHING;

-- =====================================================
-- SYSTEM ROLES (Global roles, tenant_id is NULL)
-- =====================================================

-- Super Admin role (full system access)
INSERT INTO roles (name, description, is_system_role, permissions, tenant_id)
VALUES (
    'Super Admin',
    'Full system access across all tenants',
    true,
    jsonb_build_array(
        jsonb_build_object('resource', 'system', 'action', 'admin')
    ),
    NULL
) ON CONFLICT (tenant_id, name) DO NOTHING;

-- Tenant Admin role (full access within a tenant)
INSERT INTO roles (name, description, is_system_role, permissions, tenant_id)
VALUES (
    'Tenant Admin',
    'Full administrative access within tenant',
    true,
    jsonb_build_array(
        jsonb_build_object('resource', 'tenants', 'action', 'admin'),
        jsonb_build_object('resource', 'users', 'action', 'read'),
        jsonb_build_object('resource', 'users', 'action', 'write'),
        jsonb_build_object('resource', 'users', 'action', 'delete'),
        jsonb_build_object('resource', 'devices', 'action', 'read'),
        jsonb_build_object('resource', 'devices', 'action', 'write'),
        jsonb_build_object('resource', 'devices', 'action', 'delete'),
        jsonb_build_object('resource', 'devices', 'action', 'execute'),
        jsonb_build_object('resource', 'workflows', 'action', 'read'),
        jsonb_build_object('resource', 'workflows', 'action', 'write'),
        jsonb_build_object('resource', 'workflows', 'action', 'delete'),
        jsonb_build_object('resource', 'workflows', 'action', 'execute'),
        jsonb_build_object('resource', 'alerts', 'action', 'read'),
        jsonb_build_object('resource', 'alerts', 'action', 'write'),
        jsonb_build_object('resource', 'alerts', 'action', 'delete'),
        jsonb_build_object('resource', 'analytics', 'action', 'read'),
        jsonb_build_object('resource', 'analytics', 'action', 'export'),
        jsonb_build_object('resource', 'api_tokens', 'action', 'read'),
        jsonb_build_object('resource', 'api_tokens', 'action', 'write'),
        jsonb_build_object('resource', 'api_tokens', 'action', 'delete'),
        jsonb_build_object('resource', 'notifications', 'action', 'read'),
        jsonb_build_object('resource', 'notifications', 'action', 'write'),
        jsonb_build_object('resource', 'notifications', 'action', 'delete'),
        jsonb_build_object('resource', 'audit_logs', 'action', 'read')
    ),
    NULL
) ON CONFLICT (tenant_id, name) DO NOTHING;

-- Department Manager role
INSERT INTO roles (name, description, is_system_role, permissions, tenant_id)
VALUES (
    'Department Manager',
    'Manage devices, workflows, and alerts within department',
    true,
    jsonb_build_array(
        jsonb_build_object('resource', 'devices', 'action', 'read'),
        jsonb_build_object('resource', 'devices', 'action', 'write'),
        jsonb_build_object('resource', 'devices', 'action', 'execute'),
        jsonb_build_object('resource', 'workflows', 'action', 'read'),
        jsonb_build_object('resource', 'workflows', 'action', 'write'),
        jsonb_build_object('resource', 'workflows', 'action', 'execute'),
        jsonb_build_object('resource', 'alerts', 'action', 'read'),
        jsonb_build_object('resource', 'alerts', 'action', 'write'),
        jsonb_build_object('resource', 'alerts', 'action', 'acknowledge'),
        jsonb_build_object('resource', 'analytics', 'action', 'read'),
        jsonb_build_object('resource', 'analytics', 'action', 'export'),
        jsonb_build_object('resource', 'notifications', 'action', 'read')
    ),
    NULL
) ON CONFLICT (tenant_id, name) DO NOTHING;

-- Team Lead role
INSERT INTO roles (name, description, is_system_role, permissions, tenant_id)
VALUES (
    'Team Lead',
    'Monitor devices and manage alerts',
    true,
    jsonb_build_array(
        jsonb_build_object('resource', 'devices', 'action', 'read'),
        jsonb_build_object('resource', 'devices', 'action', 'write'),
        jsonb_build_object('resource', 'workflows', 'action', 'read'),
        jsonb_build_object('resource', 'workflows', 'action', 'execute'),
        jsonb_build_object('resource', 'alerts', 'action', 'read'),
        jsonb_build_object('resource', 'alerts', 'action', 'acknowledge'),
        jsonb_build_object('resource', 'analytics', 'action', 'read')
    ),
    NULL
) ON CONFLICT (tenant_id, name) DO NOTHING;

-- End User role (read-only access)
INSERT INTO roles (name, description, is_system_role, permissions, tenant_id)
VALUES (
    'End User',
    'View devices, data, and analytics (read-only)',
    true,
    jsonb_build_array(
        jsonb_build_object('resource', 'devices', 'action', 'read'),
        jsonb_build_object('resource', 'alerts', 'action', 'read'),
        jsonb_build_object('resource', 'analytics', 'action', 'read'),
        jsonb_build_object('resource', 'workflows', 'action', 'read')
    ),
    NULL
) ON CONFLICT (tenant_id, name) DO NOTHING;

-- API Service role (for machine-to-machine communication)
INSERT INTO roles (name, description, is_system_role, permissions, tenant_id)
VALUES (
    'API Service',
    'Programmatic access for services and integrations',
    true,
    jsonb_build_array(
        jsonb_build_object('resource', 'devices', 'action', 'read'),
        jsonb_build_object('resource', 'devices', 'action', 'write'),
        jsonb_build_object('resource', 'analytics', 'action', 'read')
    ),
    NULL
) ON CONFLICT (tenant_id, name) DO NOTHING;

-- =====================================================
-- DEVICE TYPES (Pre-configured device templates)
-- =====================================================

INSERT INTO device_types (name, description, icon, default_configuration, sensor_schema) VALUES
    (
        'Temperature Sensor',
        'Environmental temperature monitoring device',
        'thermometer',
        jsonb_build_object(
            'sampling_interval_seconds', 60,
            'unit', 'celsius',
            'min_value', -40,
            'max_value', 125
        ),
        jsonb_build_object(
            'type', 'object',
            'properties', jsonb_build_object(
                'temperature', jsonb_build_object(
                    'type', 'number',
                    'unit', 'celsius',
                    'min', -40,
                    'max', 125
                ),
                'humidity', jsonb_build_object(
                    'type', 'number',
                    'unit', 'percent',
                    'min', 0,
                    'max', 100
                )
            )
        )
    ),
    (
        'Industrial Gateway',
        'Multi-protocol industrial IoT gateway',
        'server',
        jsonb_build_object(
            'protocols', jsonb_build_array('modbus', 'mqtt', 'opcua'),
            'max_connections', 100
        ),
        jsonb_build_object(
            'type', 'object',
            'properties', jsonb_build_object(
                'cpu_usage', jsonb_build_object('type', 'number', 'unit', 'percent'),
                'memory_usage', jsonb_build_object('type', 'number', 'unit', 'percent'),
                'connection_count', jsonb_build_object('type', 'integer')
            )
        )
    ),
    (
        'Smart Energy Meter',
        'Energy consumption monitoring device',
        'zap',
        jsonb_build_object(
            'sampling_interval_seconds', 300,
            'tariff_enabled', true
        ),
        jsonb_build_object(
            'type', 'object',
            'properties', jsonb_build_object(
                'voltage', jsonb_build_object('type', 'number', 'unit', 'volts'),
                'current', jsonb_build_object('type', 'number', 'unit', 'amperes'),
                'power', jsonb_build_object('type', 'number', 'unit', 'watts'),
                'energy', jsonb_build_object('type', 'number', 'unit', 'kwh')
            )
        )
    ),
    (
        'Vibration Sensor',
        'Machine vibration monitoring for predictive maintenance',
        'activity',
        jsonb_build_object(
            'sampling_rate_hz', 1000,
            'alert_threshold_g', 2.5
        ),
        jsonb_build_object(
            'type', 'object',
            'properties', jsonb_build_object(
                'vibration_x', jsonb_build_object('type', 'number', 'unit', 'g'),
                'vibration_y', jsonb_build_object('type', 'number', 'unit', 'g'),
                'vibration_z', jsonb_build_object('type', 'number', 'unit', 'g'),
                'frequency', jsonb_build_object('type', 'number', 'unit', 'hz')
            )
        )
    ),
    (
        'Water Quality Sensor',
        'Water quality monitoring for industrial and environmental applications',
        'droplet',
        jsonb_build_object(
            'sampling_interval_seconds', 120,
            'calibration_required', true
        ),
        jsonb_build_object(
            'type', 'object',
            'properties', jsonb_build_object(
                'ph', jsonb_build_object('type', 'number', 'min', 0, 'max', 14),
                'turbidity', jsonb_build_object('type', 'number', 'unit', 'ntu'),
                'dissolved_oxygen', jsonb_build_object('type', 'number', 'unit', 'mg/L'),
                'conductivity', jsonb_build_object('type', 'number', 'unit', 'μS/cm')
            )
        )
    ),
    (
        'GPS Tracker',
        'Asset tracking and fleet management device',
        'map-pin',
        jsonb_build_object(
            'update_interval_seconds', 30,
            'geofence_enabled', true
        ),
        jsonb_build_object(
            'type', 'object',
            'properties', jsonb_build_object(
                'latitude', jsonb_build_object('type', 'number'),
                'longitude', jsonb_build_object('type', 'number'),
                'altitude', jsonb_build_object('type', 'number', 'unit', 'meters'),
                'speed', jsonb_build_object('type', 'number', 'unit', 'km/h'),
                'battery', jsonb_build_object('type', 'number', 'unit', 'percent')
            )
        )
    ),
    (
        'Air Quality Monitor',
        'Indoor and outdoor air quality measurement',
        'wind',
        jsonb_build_object(
            'sampling_interval_seconds', 60,
            'alerts_enabled', true
        ),
        jsonb_build_object(
            'type', 'object',
            'properties', jsonb_build_object(
                'pm25', jsonb_build_object('type', 'number', 'unit', 'μg/m³'),
                'pm10', jsonb_build_object('type', 'number', 'unit', 'μg/m³'),
                'co2', jsonb_build_object('type', 'number', 'unit', 'ppm'),
                'voc', jsonb_build_object('type', 'number', 'unit', 'ppb'),
                'temperature', jsonb_build_object('type', 'number', 'unit', 'celsius'),
                'humidity', jsonb_build_object('type', 'number', 'unit', 'percent')
            )
        )
    ),
    (
        'Generic IoT Device',
        'Customizable IoT device with flexible schema',
        'cpu',
        jsonb_build_object(
            'sampling_interval_seconds', 60
        ),
        jsonb_build_object(
            'type', 'object',
            'properties', jsonb_build_object()
        )
    )
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE permissions IS 'Granular permissions for RBAC system';
COMMENT ON TABLE roles IS 'System and tenant-specific roles';
COMMENT ON TABLE device_types IS 'Pre-configured device type templates';
