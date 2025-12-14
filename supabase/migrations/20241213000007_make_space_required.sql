-- =====================================================
-- Make channel_id required for devices
-- Description: Every device must belong to a channel
-- Note: The default "Uncategorized" channel is created in seed.sql
-- =====================================================

-- Make channel_id NOT NULL (requires existing devices to have channel_id set)
-- The seed.sql file will handle creating channels and assigning devices
ALTER TABLE devices
ALTER COLUMN channel_id SET NOT NULL;

-- Add a comment
COMMENT ON COLUMN devices.channel_id IS 'Required channel assignment - every device must belong to a channel';
