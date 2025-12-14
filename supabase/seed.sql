-- =====================================================
-- IoTLinker Enterprise - Seed Data
-- Version: 1.0
-- Description: Demo data for development and testing
-- =====================================================

-- =====================================================
-- DEMO ORGANIZATION & TENANT
-- =====================================================

-- Create demo organization
INSERT INTO organizations (id, name, slug, billing_email, status)
VALUES (
    '00000000-0000-0000-0000-000000000001'::UUID,
    'Demo Corporation',
    'demo-corp',
    'billing@demo-corp.com',
    'active'
) ON CONFLICT (slug) DO NOTHING;

-- Create demo tenant
INSERT INTO tenants (id, organization_id, name, subdomain, active, max_devices, max_users, tier)
VALUES (
    '10000000-0000-0000-0000-000000000001'::UUID,
    '00000000-0000-0000-0000-000000000001'::UUID,
    'Demo Tenant',
    'demo',
    true,
    1000,
    50,
    'professional'
) ON CONFLICT (subdomain) DO NOTHING;

-- =====================================================
-- DEMO USERS (To be synced with Clerk)
-- =====================================================

-- Note: In production, users will be created via Clerk webhooks
-- These are placeholder entries for development

INSERT INTO users (id, tenant_id, email, full_name, status, email_verified)
VALUES
    (
        '20000000-0000-0000-0000-000000000001'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        'admin@demo-corp.com',
        'Admin User',
        'active',
        true
    ),
    (
        '20000000-0000-0000-0000-000000000002'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        'manager@demo-corp.com',
        'Manager User',
        'active',
        true
    ),
    (
        '20000000-0000-0000-0000-000000000003'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        'user@demo-corp.com',
        'End User',
        'active',
        true
    )
ON CONFLICT (tenant_id, email) DO NOTHING;

-- =====================================================
-- ASSIGN ROLES TO DEMO USERS
-- =====================================================

-- Assign Tenant Admin role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT
    '20000000-0000-0000-0000-000000000001'::UUID,
    id
FROM roles
WHERE name = 'Tenant Admin' AND tenant_id IS NULL
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Assign Department Manager role to manager user
INSERT INTO user_roles (user_id, role_id)
SELECT
    '20000000-0000-0000-0000-000000000002'::UUID,
    id
FROM roles
WHERE name = 'Department Manager' AND tenant_id IS NULL
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Assign End User role to regular user
INSERT INTO user_roles (user_id, role_id)
SELECT
    '20000000-0000-0000-0000-000000000003'::UUID,
    id
FROM roles
WHERE name = 'End User' AND tenant_id IS NULL
ON CONFLICT (user_id, role_id) DO NOTHING;

-- =====================================================
-- DEMO CHANNELS
-- =====================================================

INSERT INTO channels (id, tenant_id, name, description, icon, color, created_by)
VALUES
    -- Default "Uncategorized" channel for devices without a specific assignment
    (
        '00000000-0000-0000-0000-000000000000'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        'Uncategorized',
        'Devices without a specific channel assignment',
        '📦',
        'gray',
        '20000000-0000-0000-0000-000000000001'::UUID
    ),
    (
        '70000000-0000-0000-0000-000000000001'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        'Smart Farm',
        'Agricultural IoT devices for crop monitoring and irrigation',
        '🌾',
        'green',
        '20000000-0000-0000-0000-000000000001'::UUID
    ),
    (
        '70000000-0000-0000-0000-000000000002'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        'Server Room',
        'Data center monitoring - temperature, humidity, and power',
        '💻',
        'blue',
        '20000000-0000-0000-0000-000000000001'::UUID
    ),
    (
        '70000000-0000-0000-0000-000000000003'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        'Smart Building',
        'Building automation - HVAC, lighting, and security',
        '🏢',
        'purple',
        '20000000-0000-0000-0000-000000000001'::UUID
    ),
    (
        '70000000-0000-0000-0000-000000000004'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        'Manufacturing Floor',
        'Industrial sensors for production line monitoring',
        '🏭',
        'orange',
        '20000000-0000-0000-0000-000000000001'::UUID
    )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DEMO DEVICES
-- =====================================================

INSERT INTO devices (id, tenant_id, device_type_id, channel_id, name, description, status, metadata, location)
SELECT
    '30000000-0000-0000-0000-000000000001'::UUID,
    '10000000-0000-0000-0000-000000000001'::UUID,
    dt.id,
    '70000000-0000-0000-0000-000000000001'::UUID, -- Smart Farm channel
    'Warehouse Temperature Sensor #1',
    'Temperature monitoring in warehouse zone A',
    'online',
    jsonb_build_object(
        'zone', 'A',
        'floor', 1,
        'installation_date', '2024-01-15'
    ),
    jsonb_build_object(
        'latitude', 40.7128,
        'longitude', -74.0060,
        'address', '123 Warehouse St, New York, NY'
    )
FROM device_types dt
WHERE dt.name = 'Temperature Sensor'
ON CONFLICT (id) DO NOTHING;

INSERT INTO devices (id, tenant_id, device_type_id, channel_id, name, description, status, metadata)
SELECT
    '30000000-0000-0000-0000-000000000002'::UUID,
    '10000000-0000-0000-0000-000000000001'::UUID,
    dt.id,
    '70000000-0000-0000-0000-000000000004'::UUID, -- Manufacturing Floor channel
    'Production Line Gateway #1',
    'Main production line data aggregator',
    'online',
    jsonb_build_object(
        'line_number', 1,
        'production_area', 'Assembly'
    )
FROM device_types dt
WHERE dt.name = 'Industrial Gateway'
ON CONFLICT (id) DO NOTHING;

INSERT INTO devices (id, tenant_id, device_type_id, channel_id, name, description, status, metadata)
SELECT
    '30000000-0000-0000-0000-000000000003'::UUID,
    '10000000-0000-0000-0000-000000000001'::UUID,
    dt.id,
    '70000000-0000-0000-0000-000000000002'::UUID, -- Server Room channel
    'Building Energy Meter',
    'Main building energy consumption monitor',
    'online',
    jsonb_build_object(
        'building', 'HQ',
        'circuit', 'main'
    )
FROM device_types dt
WHERE dt.name = 'Smart Energy Meter'
ON CONFLICT (id) DO NOTHING;

INSERT INTO devices (id, tenant_id, device_type_id, channel_id, name, description, status, metadata)
SELECT
    '30000000-0000-0000-0000-000000000004'::UUID,
    '10000000-0000-0000-0000-000000000001'::UUID,
    dt.id,
    '70000000-0000-0000-0000-000000000004'::UUID, -- Manufacturing Floor channel
    'Motor Vibration Sensor #1',
    'Main motor predictive maintenance sensor',
    'online',
    jsonb_build_object(
        'motor_id', 'M-001',
        'critical_asset', true
    )
FROM device_types dt
WHERE dt.name = 'Vibration Sensor'
ON CONFLICT (id) DO NOTHING;

INSERT INTO devices (id, tenant_id, device_type_id, channel_id, name, description, status, metadata)
SELECT
    '30000000-0000-0000-0000-000000000005'::UUID,
    '10000000-0000-0000-0000-000000000001'::UUID,
    dt.id,
    '70000000-0000-0000-0000-000000000001'::UUID, -- Smart Farm channel
    'Office Air Quality Monitor',
    'Office environment monitoring',
    'online',
    jsonb_build_object(
        'room', 'Open Office Area',
        'capacity', 50
    )
FROM device_types dt
WHERE dt.name = 'Air Quality Monitor'
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DEMO SENSOR DATA (Recent 24 hours)
-- =====================================================

-- Temperature sensor data (last 24 hours, every 5 minutes)
INSERT INTO device_data (time, device_id, tenant_id, metric_name, value, unit, quality_score)
SELECT
    NOW() - (interval '5 minutes' * generate_series(0, 287)),
    '30000000-0000-0000-0000-000000000001'::UUID,
    '10000000-0000-0000-0000-000000000001'::UUID,
    'temperature',
    20 + (random() * 5)::DOUBLE PRECISION,
    'celsius',
    95 + (random() * 5)::INTEGER
FROM generate_series(0, 287)
ON CONFLICT (device_id, time, metric_name) DO NOTHING;

INSERT INTO device_data (time, device_id, tenant_id, metric_name, value, unit, quality_score)
SELECT
    NOW() - (interval '5 minutes' * generate_series(0, 287)),
    '30000000-0000-0000-0000-000000000001'::UUID,
    '10000000-0000-0000-0000-000000000001'::UUID,
    'humidity',
    45 + (random() * 20)::DOUBLE PRECISION,
    'percent',
    95 + (random() * 5)::INTEGER
FROM generate_series(0, 287)
ON CONFLICT (device_id, time, metric_name) DO NOTHING;

-- Energy meter data (last 24 hours, every 15 minutes)
INSERT INTO device_data (time, device_id, tenant_id, metric_name, value, unit, quality_score)
SELECT
    NOW() - (interval '15 minutes' * generate_series(0, 95)),
    '30000000-0000-0000-0000-000000000003'::UUID,
    '10000000-0000-0000-0000-000000000001'::UUID,
    'power',
    5000 + (random() * 2000)::DOUBLE PRECISION,
    'watts',
    100
FROM generate_series(0, 95)
ON CONFLICT (device_id, time, metric_name) DO NOTHING;

-- Vibration sensor data (last 24 hours, every 10 minutes)
INSERT INTO device_data (time, device_id, tenant_id, metric_name, value, unit, quality_score)
SELECT
    NOW() - (interval '10 minutes' * generate_series(0, 143)),
    '30000000-0000-0000-0000-000000000004'::UUID,
    '10000000-0000-0000-0000-000000000001'::UUID,
    'vibration_x',
    0.5 + (random() * 1.5)::DOUBLE PRECISION,
    'g',
    98
FROM generate_series(0, 143)
ON CONFLICT (device_id, time, metric_name) DO NOTHING;

-- Air quality data (last 24 hours, every 5 minutes)
INSERT INTO device_data (time, device_id, tenant_id, metric_name, value, unit, quality_score)
SELECT
    NOW() - (interval '5 minutes' * generate_series(0, 287)),
    '30000000-0000-0000-0000-000000000005'::UUID,
    '10000000-0000-0000-0000-000000000001'::UUID,
    'pm25',
    5 + (random() * 20)::DOUBLE PRECISION,
    'μg/m³',
    95 + (random() * 5)::INTEGER
FROM generate_series(0, 287)
ON CONFLICT (device_id, time, metric_name) DO NOTHING;

INSERT INTO device_data (time, device_id, tenant_id, metric_name, value, unit, quality_score)
SELECT
    NOW() - (interval '5 minutes' * generate_series(0, 287)),
    '30000000-0000-0000-0000-000000000005'::UUID,
    '10000000-0000-0000-0000-000000000001'::UUID,
    'co2',
    400 + (random() * 400)::DOUBLE PRECISION,
    'ppm',
    95 + (random() * 5)::INTEGER
FROM generate_series(0, 287)
ON CONFLICT (device_id, time, metric_name) DO NOTHING;

-- =====================================================
-- DEMO ALERTS
-- =====================================================

INSERT INTO alerts (id, tenant_id, device_id, name, description, condition, severity, is_active, notification_channels)
VALUES
    (
        '40000000-0000-0000-0000-000000000001'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        '30000000-0000-0000-0000-000000000001'::UUID,
        'High Temperature Alert',
        'Alert when warehouse temperature exceeds 28°C',
        jsonb_build_object(
            'metric', 'temperature',
            'operator', '>',
            'threshold', 28,
            'duration_minutes', 5
        ),
        'warning',
        true,
        jsonb_build_array('email', 'webhook')
    ),
    (
        '40000000-0000-0000-0000-000000000002'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        '30000000-0000-0000-0000-000000000004'::UUID,
        'High Vibration Alert',
        'Alert when motor vibration exceeds safe threshold',
        jsonb_build_object(
            'metric', 'vibration_x',
            'operator', '>',
            'threshold', 2.0,
            'duration_minutes', 1
        ),
        'critical',
        true,
        jsonb_build_array('email', 'sms')
    ),
    (
        '40000000-0000-0000-0000-000000000003'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        '30000000-0000-0000-0000-000000000005'::UUID,
        'Poor Air Quality Alert',
        'Alert when PM2.5 exceeds healthy levels',
        jsonb_build_object(
            'metric', 'pm25',
            'operator', '>',
            'threshold', 35,
            'duration_minutes', 10
        ),
        'warning',
        true,
        jsonb_build_array('email')
    )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DEMO NOTIFICATION CHANNELS
-- =====================================================

INSERT INTO notification_channels (id, tenant_id, name, type, configuration, is_active)
VALUES
    (
        '50000000-0000-0000-0000-000000000001'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        'Operations Email',
        'email',
        jsonb_build_object(
            'recipients', jsonb_build_array(
                'ops@demo-corp.com',
                'alerts@demo-corp.com'
            ),
            'subject_template', '[IoTLinker] Alert: {{alert_name}}'
        ),
        true
    ),
    (
        '50000000-0000-0000-0000-000000000002'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        'Webhook Integration',
        'webhook',
        jsonb_build_object(
            'url', 'https://example.com/webhooks/iotlinker',
            'method', 'POST',
            'headers', jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer demo-token-123'
            )
        ),
        true
    )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DEMO WORKFLOWS
-- =====================================================

INSERT INTO workflows (id, tenant_id, name, description, trigger_config, steps, is_active)
VALUES
    (
        '60000000-0000-0000-0000-000000000001'::UUID,
        '10000000-0000-0000-0000-000000000001'::UUID,
        'High Temperature Response',
        'Automated response to high temperature alerts',
        jsonb_build_object(
            'type', 'alert',
            'alert_id', '40000000-0000-0000-0000-000000000001'
        ),
        jsonb_build_array(
            jsonb_build_object(
                'type', 'notification',
                'channel', 'email',
                'message', 'Temperature alert triggered for {{device_name}}'
            ),
            jsonb_build_object(
                'type', 'log',
                'message', 'Temperature alert logged'
            )
        ),
        true
    )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PRINT SUMMARY
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'IoTLinker Database Seeded Successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Demo Organization: Demo Corporation';
    RAISE NOTICE 'Demo Tenant: Demo Tenant (subdomain: demo)';
    RAISE NOTICE 'Demo Users: 3 (admin, manager, user)';
    RAISE NOTICE 'Demo Channels: 4 (Farm, Server Room, Building, Manufacturing)';
    RAISE NOTICE 'Demo Devices: 5 (assigned to channels)';
    RAISE NOTICE 'Demo Sensor Data: Last 24 hours';
    RAISE NOTICE 'Demo Alerts: 3';
    RAISE NOTICE '========================================';
END $$;
