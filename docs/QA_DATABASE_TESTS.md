# IoTLinker - Database Integrity & QA Tests

## Overview
This document contains database-level tests to verify data integrity, constraints, relationships, and schema correctness.

---

## Table of Contents
1. [Schema Validation Tests](#1-schema-validation-tests)
2. [Constraint Tests](#2-constraint-tests)
3. [Relationship Tests](#3-relationship-tests)
4. [Data Integrity Tests](#4-data-integrity-tests)
5. [Row-Level Security Tests](#5-row-level-security-tests)
6. [Performance Tests](#6-performance-tests)

---

## Database Connection

Access the database via Supabase Studio or psql:

```bash
# Via Supabase Studio
http://127.0.0.1:54323

# Via psql
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

---

## 1. Schema Validation Tests

### TC-DB-001: Verify All Tables Exist
**Priority**: P0
**Category**: Schema

**Test Steps**:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Result**:
Tables should include:
- tenants
- users
- devices
- device_types
- device_data
- channels
- alerts
- alert_rules
- notifications

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-002: Verify Tenants Table Schema
**Priority**: P0
**Category**: Schema

**Test Steps**:
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tenants'
ORDER BY ordinal_position;
```

**Expected Result**:
```
id              | uuid      | NO  | gen_random_uuid()
name            | varchar   | NO  | NULL
slug            | varchar   | NO  | NULL
subscription_tier | varchar | YES | 'free'::varchar
max_devices     | integer   | YES | 10
is_active       | boolean   | YES | true
metadata        | jsonb     | YES | '{}'::jsonb
created_at      | timestamp | YES | now()
updated_at      | timestamp | YES | now()
```

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-003: Verify Devices Table Schema
**Priority**: P0
**Category**: Schema

**Test Steps**:
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'devices'
ORDER BY ordinal_position;
```

**Expected Result**:
All required columns present with correct data types:
- id (uuid, PK)
- tenant_id (uuid, FK)
- device_type_id (uuid, FK)
- name (varchar)
- device_key (varchar)
- device_secret (varchar)
- status (varchar)
- location (jsonb)
- metadata (jsonb)
- configuration (jsonb)
- last_seen (timestamp)
- created_at (timestamp)
- updated_at (timestamp)

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-004: Verify Device Data Table Schema
**Priority**: P0
**Category**: Schema

**Test Steps**:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'device_data'
ORDER BY ordinal_position;
```

**Expected Result**:
- id (uuid, PK)
- device_id (uuid, FK)
- metric_name (varchar)
- value (double precision)
- unit (varchar)
- time (timestamp)
- quality_score (integer)
- metadata (jsonb)

**Status**: [ ] Pass [ ] Fail

---

## 2. Constraint Tests

### TC-DB-005: Primary Key Constraints
**Priority**: P0
**Category**: Constraints

**Test Steps**:
```sql
SELECT
  tc.table_name,
  tc.constraint_name,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'PRIMARY KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

**Expected Result**:
Each major table has a primary key on 'id' column

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-006: Foreign Key Constraints - Devices
**Priority**: P0
**Category**: Constraints

**Test Steps**:
```sql
SELECT
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'devices';
```

**Expected Result**:
- devices.tenant_id → tenants.id
- devices.device_type_id → device_types.id
- devices.created_by → users.id

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-007: Unique Constraints
**Priority**: P1
**Category**: Constraints

**Test Steps**:
```sql
SELECT
  tc.table_name,
  tc.constraint_name,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

**Expected Result**:
- tenants.slug is unique
- devices.device_key is unique

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-008: NOT NULL Constraints
**Priority**: P1
**Category**: Constraints

**Test Steps**:
```sql
SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_name = 'devices'
  AND is_nullable = 'NO';
```

**Expected Result**:
Required fields are NOT NULL:
- id
- tenant_id
- name
- device_key
- device_secret
- status

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-009: Check Constraint - Device Status
**Priority**: P1
**Category**: Constraints

**Test Steps**:
```sql
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name LIKE '%status%';
```

**Expected Result**:
Device status must be one of: 'online', 'offline', 'warning', 'error', 'maintenance'

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-010: Test Foreign Key Constraint Enforcement
**Priority**: P0
**Category**: Constraints

**Test Steps**:
```sql
-- Attempt to insert device with non-existent tenant_id
INSERT INTO devices (
  id, tenant_id, device_type_id, name, device_key, device_secret, status
) VALUES (
  gen_random_uuid(),
  '99999999-9999-9999-9999-999999999999', -- Non-existent tenant
  'c814b779-4456-4bc1-a0fb-e354cc2d5d20',
  'Test Device',
  'test_key',
  'test_secret',
  'online'
);
```

**Expected Result**:
- Operation FAILS with foreign key violation error
- Error message mentions tenant_id constraint

**Status**: [ ] Pass [ ] Fail

---

## 3. Relationship Tests

### TC-DB-011: Tenant-Device Relationship
**Priority**: P0
**Category**: Relationships

**Test Steps**:
```sql
SELECT
  t.name as tenant_name,
  COUNT(d.id) as device_count
FROM tenants t
LEFT JOIN devices d ON t.id = d.tenant_id
GROUP BY t.id, t.name
ORDER BY t.name;
```

**Expected Result**:
- ACME Corporation: 5 devices
- TechStart Industries: 0 devices

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-012: Device-DeviceType Relationship
**Priority**: P0
**Category**: Relationships

**Test Steps**:
```sql
SELECT
  dt.name as device_type,
  COUNT(d.id) as device_count
FROM device_types dt
LEFT JOIN devices d ON dt.id = d.device_type_id
GROUP BY dt.id, dt.name
ORDER BY device_count DESC;
```

**Expected Result**:
- Each device type shows count of devices
- Total devices = 5

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-013: Device-DeviceData Relationship
**Priority**: P1
**Category**: Relationships

**Test Steps**:
```sql
SELECT
  d.name as device_name,
  COUNT(dd.id) as data_points
FROM devices d
LEFT JOIN device_data dd ON d.id = dd.device_id
WHERE d.tenant_id = '10000000-0000-0000-0000-000000000001'
GROUP BY d.id, d.name
ORDER BY d.name;
```

**Expected Result**:
- Shows data point count per device
- No errors in relationships

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-014: Cascade Delete - Device Data
**Priority**: P1
**Category**: Relationships

**Test Steps**:
```sql
-- Create test device
INSERT INTO devices (id, tenant_id, device_type_id, name, device_key, device_secret, status)
VALUES (
  '99999999-9999-9999-9999-999999999999',
  '10000000-0000-0000-0000-000000000001',
  'c814b779-4456-4bc1-a0fb-e354cc2d5d20',
  'Delete Test Device',
  'test_delete_key',
  'test_delete_secret',
  'online'
);

-- Insert test data
INSERT INTO device_data (device_id, metric_name, value, unit, time, quality_score)
VALUES (
  '99999999-9999-9999-9999-999999999999',
  'temperature',
  25.5,
  'celsius',
  NOW(),
  100
);

-- Verify data exists
SELECT COUNT(*) FROM device_data WHERE device_id = '99999999-9999-9999-9999-999999999999';

-- Delete device
DELETE FROM devices WHERE id = '99999999-9999-9999-9999-999999999999';

-- Verify cascade delete
SELECT COUNT(*) FROM device_data WHERE device_id = '99999999-9999-9999-9999-999999999999';
```

**Expected Result**:
- Data point count before delete: 1
- Data point count after delete: 0 (cascaded)

**Status**: [ ] Pass [ ] Fail

---

## 4. Data Integrity Tests

### TC-DB-015: UUID Generation
**Priority**: P1
**Category**: Data Integrity

**Test Steps**:
```sql
-- Insert without specifying ID
INSERT INTO tenants (name, slug)
VALUES ('Test Tenant', 'test-tenant')
RETURNING id;
```

**Expected Result**:
- ID is auto-generated
- ID is valid UUID format

**Post-Test**: Delete test tenant

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-016: Timestamp Auto-Generation
**Priority**: P1
**Category**: Data Integrity

**Test Steps**:
```sql
INSERT INTO devices (
  tenant_id, device_type_id, name, device_key, device_secret, status
) VALUES (
  '10000000-0000-0000-0000-000000000001',
  'c814b779-4456-4bc1-a0fb-e354cc2d5d20',
  'Timestamp Test',
  'test_timestamp_key',
  'test_timestamp_secret',
  'online'
)
RETURNING id, created_at, updated_at;
```

**Expected Result**:
- created_at is populated automatically
- updated_at is populated automatically
- Both timestamps are current

**Post-Test**: Delete test device

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-017: JSONB Data Type - Metadata
**Priority**: P1
**Category**: Data Integrity

**Test Steps**:
```sql
-- Insert device with metadata
INSERT INTO devices (
  tenant_id, device_type_id, name, device_key, device_secret, status, metadata
) VALUES (
  '10000000-0000-0000-0000-000000000001',
  'c814b779-4456-4bc1-a0fb-e354cc2d5d20',
  'JSON Test',
  'test_json_key',
  'test_json_secret',
  'online',
  '{"test_key": "test_value", "nested": {"foo": "bar"}}'::jsonb
)
RETURNING id, metadata;

-- Query JSON data
SELECT metadata->>'test_key' as test_value FROM devices WHERE device_key = 'test_json_key';
```

**Expected Result**:
- JSONB stored correctly
- JSON query returns "test_value"

**Post-Test**: Delete test device

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-018: Default Values
**Priority**: P2
**Category**: Data Integrity

**Test Steps**:
```sql
INSERT INTO tenants (name, slug)
VALUES ('Default Test', 'default-test')
RETURNING subscription_tier, max_devices, is_active;
```

**Expected Result**:
- subscription_tier = 'free'
- max_devices = 10
- is_active = true

**Post-Test**: Delete test tenant

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-019: Data Consistency - Device Count
**Priority**: P1
**Category**: Data Integrity

**Test Steps**:
```sql
-- Count via API (list endpoint)
-- Compare with direct DB query
SELECT COUNT(*) FROM devices WHERE tenant_id = '10000000-0000-0000-0000-000000000001';
```

**Expected Result**:
- API count matches DB count
- Both return 5 devices for ACME tenant

**Status**: [ ] Pass [ ] Fail

---

## 5. Row-Level Security Tests

### TC-DB-020: RLS Policies Exist
**Priority**: P0
**Category**: Security

**Test Steps**:
```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected Result**:
- RLS policies defined for multi-tenant tables
- Policies enforce tenant isolation

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-021: RLS Enabled on Tables
**Priority**: P0
**Category**: Security

**Test Steps**:
```sql
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('devices', 'device_data', 'users', 'channels')
ORDER BY tablename;
```

**Expected Result**:
- rowsecurity = true for multi-tenant tables

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-022: Tenant Isolation Enforcement
**Priority**: P0
**Category**: Security

**Test Steps**:
```sql
-- Set session to tenant 1
SET LOCAL app.current_tenant_id = '10000000-0000-0000-0000-000000000001';

-- Query devices
SELECT COUNT(*) FROM devices;

-- Set session to tenant 2
SET LOCAL app.current_tenant_id = '10000000-0000-0000-0000-000000000002';

-- Query devices again
SELECT COUNT(*) FROM devices;
```

**Expected Result**:
- Tenant 1 query returns 5 devices
- Tenant 2 query returns 0 devices
- RLS prevents cross-tenant data access

**Status**: [ ] Pass [ ] Fail

---

## 6. Performance Tests

### TC-DB-023: Index Efficiency - Device Lookup by ID
**Priority**: P1
**Category**: Performance

**Test Steps**:
```sql
EXPLAIN ANALYZE
SELECT * FROM devices WHERE id = '30000000-0000-0000-0000-000000000001';
```

**Expected Result**:
- Uses index scan (not sequential scan)
- Execution time < 5ms
- Returns 1 row

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-024: Index Efficiency - Device Lookup by Tenant
**Priority**: P1
**Category**: Performance

**Test Steps**:
```sql
EXPLAIN ANALYZE
SELECT * FROM devices WHERE tenant_id = '10000000-0000-0000-0000-000000000001';
```

**Expected Result**:
- Uses index scan on tenant_id
- Execution time < 10ms
- Returns 5 rows

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-025: Device Data Query Performance
**Priority**: P1
**Category**: Performance

**Test Steps**:
```sql
EXPLAIN ANALYZE
SELECT * FROM device_data
WHERE device_id = '30000000-0000-0000-0000-000000000001'
  AND metric_name = 'temperature'
  AND time >= NOW() - INTERVAL '24 hours'
ORDER BY time DESC
LIMIT 100;
```

**Expected Result**:
- Uses index on (device_id, metric_name, time)
- Execution time < 20ms
- Efficient sort operation

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-026: Pagination Performance
**Priority**: P2
**Category**: Performance

**Test Steps**:
```sql
-- Page 1
EXPLAIN ANALYZE
SELECT * FROM devices
WHERE tenant_id = '10000000-0000-0000-0000-000000000001'
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;

-- Page 10
EXPLAIN ANALYZE
SELECT * FROM devices
WHERE tenant_id = '10000000-0000-0000-0000-000000000001'
ORDER BY created_at DESC
LIMIT 10 OFFSET 90;
```

**Expected Result**:
- Both queries have similar execution time
- No significant degradation with higher offsets
- Uses index for ordering

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-027: Aggregate Query Performance
**Priority**: P2
**Category**: Performance

**Test Steps**:
```sql
EXPLAIN ANALYZE
SELECT
  device_id,
  metric_name,
  COUNT(*) as data_points,
  AVG(value) as avg_value,
  MIN(value) as min_value,
  MAX(value) as max_value
FROM device_data
WHERE time >= NOW() - INTERVAL '7 days'
GROUP BY device_id, metric_name;
```

**Expected Result**:
- Execution time < 50ms (on demo data)
- Uses appropriate indexes

**Status**: [ ] Pass [ ] Fail

---

### TC-DB-028: Connection Pool Efficiency
**Priority**: P1
**Category**: Performance

**Test Steps**:
```sql
-- Check current connections
SELECT count(*) FROM pg_stat_activity
WHERE datname = 'postgres';
```

**Expected Result**:
- Connection count is reasonable (< 10 for dev)
- No idle connections piling up

**Status**: [ ] Pass [ ] Fail

---

## Data Verification Queries

### Quick Health Check
```sql
-- Count records in each table
SELECT 'tenants' as table_name, COUNT(*) as count FROM tenants
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'devices', COUNT(*) FROM devices
UNION ALL
SELECT 'device_types', COUNT(*) FROM device_types
UNION ALL
SELECT 'device_data', COUNT(*) FROM device_data
UNION ALL
SELECT 'channels', COUNT(*) FROM channels;
```

### Data Integrity Check
```sql
-- Find orphaned devices (invalid tenant_id)
SELECT d.id, d.name, d.tenant_id
FROM devices d
LEFT JOIN tenants t ON d.tenant_id = t.id
WHERE t.id IS NULL;

-- Find orphaned device data (invalid device_id)
SELECT dd.id, dd.device_id
FROM device_data dd
LEFT JOIN devices d ON dd.device_id = d.id
WHERE d.id IS NULL
LIMIT 10;
```

### Schema Version Check
```sql
-- Check Supabase migrations
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC;
```

---

## Test Execution Summary

**Total Database Tests**: 28
- Schema: 4
- Constraints: 6
- Relationships: 4
- Data Integrity: 5
- Security (RLS): 3
- Performance: 6

**Pass/Fail Summary**:
- Passed: _____ / 28
- Failed: _____ / 28
- Not Applicable: _____ / 28

**Database Health**: [ ] Healthy [ ] Issues Found

---

**Tested By**: _________________
**Date**: _________________
**Database Version**: PostgreSQL 15.x (Supabase)
**Environment**: Local Development
