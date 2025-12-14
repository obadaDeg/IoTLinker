-- =====================================================
-- IoTLinker - Add Channels Feature
-- Description: Add channels for organizing devices (like ThingSpeak)
-- =====================================================

-- Channels table (groups for organizing devices)
CREATE TABLE IF NOT EXISTS channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- emoji or icon identifier
    color VARCHAR(50), -- color theme for the channel
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_tenant_device_channel_name UNIQUE (tenant_id, name)
);

-- Add channel_id to devices table (only if column doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'devices' AND column_name = 'channel_id'
    ) THEN
        ALTER TABLE devices
        ADD COLUMN channel_id UUID REFERENCES channels(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_devices_channel_id ON devices(channel_id);
CREATE INDEX IF NOT EXISTS idx_channels_tenant_id ON channels(tenant_id);

-- Enable RLS on channels table
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see channels in their tenant
CREATE POLICY channels_tenant_isolation ON channels
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id', TRUE)::uuid);

-- Comments
COMMENT ON TABLE channels IS 'Channels for organizing devices (similar to ThingSpeak channels)';
COMMENT ON COLUMN channels.icon IS 'Emoji or icon identifier for visual representation';
COMMENT ON COLUMN channels.color IS 'Color theme for the channel UI (hex color or preset name)';
COMMENT ON COLUMN devices.channel_id IS 'Optional channel assignment for device organization';
