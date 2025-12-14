-- =====================================================
-- IoTLinker Enterprise - TimescaleDB Configuration
-- Version: 1.1 (Apache License Compatible)
-- Description: Enable TimescaleDB with features compatible with free license
-- =====================================================

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Convert device_data table to hypertable
-- Partition by time (required) with 1-day chunks
SELECT create_hypertable(
    'device_data',
    'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE
);

-- Note: Multi-dimensional partitioning (by tenant_id) is available in TimescaleDB 2.0+
-- but requires additional configuration. Skipping for initial setup.

-- =====================================================
-- MATERIALIZED VIEWS (Standard PostgreSQL)
-- Note: Using standard PostgreSQL views instead of continuous aggregates
-- which require TimescaleDB Enterprise license
-- =====================================================

-- Create refresh function for materialized views
CREATE OR REPLACE FUNCTION refresh_device_data_aggregates()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY device_data_hourly;
    REFRESH MATERIALIZED VIEW CONCURRENTLY device_data_daily;
END;
$$ LANGUAGE plpgsql;

-- 1-hour aggregated metrics (Standard Materialized View)
CREATE MATERIALIZED VIEW device_data_hourly AS
SELECT
    time_bucket('1 hour', time) AS bucket,
    device_id,
    tenant_id,
    metric_name,
    AVG(value) AS avg_value,
    MIN(value) AS min_value,
    MAX(value) AS max_value,
    COUNT(*) AS sample_count,
    AVG(quality_score) AS avg_quality_score
FROM device_data
GROUP BY bucket, device_id, tenant_id, metric_name;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_device_data_hourly_unique
ON device_data_hourly(bucket, device_id, tenant_id, metric_name);

-- 1-day aggregated metrics (Standard Materialized View)
CREATE MATERIALIZED VIEW device_data_daily AS
SELECT
    time_bucket('1 day', time) AS bucket,
    device_id,
    tenant_id,
    metric_name,
    AVG(value) AS avg_value,
    MIN(value) AS min_value,
    MAX(value) AS max_value,
    COUNT(*) AS sample_count,
    AVG(quality_score) AS avg_quality_score
FROM device_data
GROUP BY bucket, device_id, tenant_id, metric_name;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_device_data_daily_unique
ON device_data_daily(bucket, device_id, tenant_id, metric_name);

-- =====================================================
-- MANUAL REFRESH POLICY (Using pg_cron or application-level)
-- =====================================================

-- Note: Automatic refresh policies require TimescaleDB Enterprise
-- Instead, you can:
-- 1. Set up a cron job to run: SELECT refresh_device_data_aggregates();
-- 2. Call from your application periodically
-- 3. Use pg_cron extension (if available)

-- Example: If pg_cron is available, uncomment below:
-- SELECT cron.schedule('refresh-hourly-aggregates', '0 * * * *', 'SELECT refresh_device_data_aggregates()');

-- =====================================================
-- DATA RETENTION (Manual cleanup function)
-- =====================================================

-- Note: Automatic retention policies require TimescaleDB Enterprise
-- Instead, use this manual cleanup function

CREATE OR REPLACE FUNCTION cleanup_old_device_data(
    retention_days INTEGER DEFAULT 90
)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM device_data
    WHERE time < NOW() - (retention_days || ' days')::INTERVAL;

    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    -- Also clean up materialized views
    PERFORM refresh_device_data_aggregates();

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMPRESSION (Not available in Apache/Community license)
-- =====================================================

-- Note: Compression requires TimescaleDB Enterprise/Community+ license
-- For the free Apache license, we skip compression
-- Data will still be stored efficiently in chunks

-- Placeholder function for consistency
CREATE OR REPLACE FUNCTION compress_old_chunks(
    older_than_days INTEGER DEFAULT 7
)
RETURNS INTEGER AS $$
BEGIN
    -- Compression not available in Apache license
    -- Return 0 to indicate no chunks were compressed
    RAISE NOTICE 'Compression requires TimescaleDB Enterprise license. Skipping.';
    RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes on materialized views
CREATE INDEX idx_device_data_hourly_bucket ON device_data_hourly(bucket DESC);
CREATE INDEX idx_device_data_hourly_device ON device_data_hourly(device_id, bucket DESC);
CREATE INDEX idx_device_data_hourly_tenant ON device_data_hourly(tenant_id, bucket DESC);

CREATE INDEX idx_device_data_daily_bucket ON device_data_daily(bucket DESC);
CREATE INDEX idx_device_data_daily_device ON device_data_daily(device_id, bucket DESC);
CREATE INDEX idx_device_data_daily_tenant ON device_data_daily(tenant_id, bucket DESC);

-- =====================================================
-- HELPER FUNCTIONS FOR TIME-SERIES QUERIES
-- =====================================================

-- Function to get latest device metrics
CREATE OR REPLACE FUNCTION get_latest_device_metrics(p_device_id UUID)
RETURNS TABLE(
    metric_name VARCHAR,
    value DOUBLE PRECISION,
    unit VARCHAR,
    reading_time TIMESTAMPTZ,
    quality_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (dd.metric_name)
        dd.metric_name,
        dd.value,
        dd.unit,
        dd.time,
        dd.quality_score
    FROM device_data dd
    WHERE dd.device_id = p_device_id
    ORDER BY dd.metric_name, dd.time DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get device metrics over time range
CREATE OR REPLACE FUNCTION get_device_metrics_range(
    p_device_id UUID,
    p_metric_name VARCHAR,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_interval VARCHAR DEFAULT '1 hour'
)
RETURNS TABLE(
    bucket TIMESTAMPTZ,
    avg_value DOUBLE PRECISION,
    min_value DOUBLE PRECISION,
    max_value DOUBLE PRECISION,
    sample_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        time_bucket(p_interval::INTERVAL, time) AS bucket,
        AVG(value) AS avg_value,
        MIN(value) AS min_value,
        MAX(value) AS max_value,
        COUNT(*) AS sample_count
    FROM device_data
    WHERE device_id = p_device_id
        AND metric_name = p_metric_name
        AND time >= p_start_time
        AND time <= p_end_time
    GROUP BY bucket
    ORDER BY bucket DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to detect anomalies using statistical methods (simple z-score)
CREATE OR REPLACE FUNCTION detect_anomalies(
    p_device_id UUID,
    p_metric_name VARCHAR,
    p_lookback_hours INTEGER DEFAULT 24,
    p_threshold DOUBLE PRECISION DEFAULT 3.0
)
RETURNS TABLE(
    reading_time TIMESTAMPTZ,
    value DOUBLE PRECISION,
    mean_value DOUBLE PRECISION,
    std_dev DOUBLE PRECISION,
    z_score DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT
            AVG(value) AS mean_val,
            STDDEV(value) AS std_val
        FROM device_data
        WHERE device_id = p_device_id
            AND metric_name = p_metric_name
            AND time >= NOW() - (p_lookback_hours || ' hours')::INTERVAL
    ),
    data_with_z AS (
        SELECT
            dd.time,
            dd.value,
            s.mean_val,
            s.std_val,
            CASE
                WHEN s.std_val = 0 THEN 0
                ELSE ABS((dd.value - s.mean_val) / s.std_val)
            END AS z_score
        FROM device_data dd
        CROSS JOIN stats s
        WHERE dd.device_id = p_device_id
            AND dd.metric_name = p_metric_name
            AND dd.time >= NOW() - (p_lookback_hours || ' hours')::INTERVAL
    )
    SELECT
        dz.time,
        dz.value,
        dz.mean_val,
        dz.std_val,
        dz.z_score
    FROM data_with_z dz
    WHERE dz.z_score > p_threshold
    ORDER BY dz.time DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MAINTENANCE HELPER FUNCTIONS
-- =====================================================

-- Function to get hypertable statistics
CREATE OR REPLACE FUNCTION get_device_data_stats()
RETURNS TABLE(
    total_chunks INTEGER,
    compressed_chunks INTEGER,
    uncompressed_chunks INTEGER,
    total_size TEXT,
    compressed_size TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::INTEGER AS total_chunks,
        COUNT(*) FILTER (WHERE is_compressed)::INTEGER AS compressed_chunks,
        COUNT(*) FILTER (WHERE NOT is_compressed)::INTEGER AS uncompressed_chunks,
        pg_size_pretty(SUM(total_bytes)) AS total_size,
        pg_size_pretty(SUM(total_bytes) FILTER (WHERE is_compressed)) AS compressed_size
    FROM timescaledb_information.chunks
    WHERE hypertable_name = 'device_data';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SCHEDULED MAINTENANCE (Manual)
-- =====================================================

-- Create a maintenance function to be called periodically
CREATE OR REPLACE FUNCTION run_device_data_maintenance()
RETURNS TABLE(
    task VARCHAR,
    result TEXT
) AS $$
DECLARE
    deleted_rows INTEGER;
    compressed_chunks INTEGER;
BEGIN
    -- Cleanup old data
    SELECT cleanup_old_device_data(90) INTO deleted_rows;
    RETURN QUERY SELECT 'cleanup'::VARCHAR, format('Deleted %s old rows', deleted_rows);

    -- Compress old chunks
    SELECT compress_old_chunks(7) INTO compressed_chunks;
    RETURN QUERY SELECT 'compression'::VARCHAR, format('Compressed %s chunks', compressed_chunks);

    -- Refresh materialized views
    PERFORM refresh_device_data_aggregates();
    RETURN QUERY SELECT 'refresh_views'::VARCHAR, 'Materialized views refreshed';

    -- Vacuum analyze
    EXECUTE 'VACUUM ANALYZE device_data';
    RETURN QUERY SELECT 'vacuum'::VARCHAR, 'Table vacuumed and analyzed';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE device_data IS 'Time-series sensor data from IoT devices (TimescaleDB hypertable)';
COMMENT ON MATERIALIZED VIEW device_data_hourly IS 'Hourly aggregated device metrics (requires manual refresh)';
COMMENT ON MATERIALIZED VIEW device_data_daily IS 'Daily aggregated device metrics (requires manual refresh)';
COMMENT ON FUNCTION get_latest_device_metrics IS 'Get the most recent value for each metric of a device';
COMMENT ON FUNCTION get_device_metrics_range IS 'Get aggregated device metrics over a time range';
COMMENT ON FUNCTION detect_anomalies IS 'Detect anomalies using z-score statistical method';
COMMENT ON FUNCTION refresh_device_data_aggregates IS 'Refresh hourly and daily materialized views';
COMMENT ON FUNCTION cleanup_old_device_data IS 'Delete device data older than specified days (default 90)';
COMMENT ON FUNCTION compress_old_chunks IS 'Compress chunks older than specified days (default 7)';
COMMENT ON FUNCTION run_device_data_maintenance IS 'Run all maintenance tasks (cleanup, compression, refresh)';

-- =====================================================
-- USAGE NOTES
-- =====================================================

-- To maintain the system, run periodically (e.g., daily via cron):
-- SELECT run_device_data_maintenance();

-- To manually refresh aggregated views:
-- SELECT refresh_device_data_aggregates();

-- To check hypertable statistics:
-- SELECT * FROM get_device_data_stats();
