# IoTLinker - QA Test Cases

## Table of Contents
1. [Health & System Tests](#1-health--system-tests)
2. [Device Management API Tests](#2-device-management-api-tests)
3. [Channel Management API Tests](#3-channel-management-api-tests)
4. [Insights API Tests](#4-insights-api-tests)
5. [Data Validation Tests](#5-data-validation-tests)
6. [Error Handling Tests](#6-error-handling-tests)
7. [Integration Tests](#7-integration-tests)

---

## 1. Health & System Tests

### TC-SYS-001: Health Check Endpoint
**Priority**: P0
**Category**: Smoke Test

**Preconditions**: Server is running

**Test Steps**:
```bash
curl -X GET "http://127.0.0.1:8000/health"
```

**Expected Result**:
- Status Code: `200 OK`
- Response Body: `{"status":"healthy"}`

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-SYS-002: Root Endpoint
**Priority**: P1
**Category**: Smoke Test

**Test Steps**:
```bash
curl -X GET "http://127.0.0.1:8000/"
```

**Expected Result**:
- Status Code: `200 OK`
- Response contains: `message`, `version`, `status` fields
- Version is "1.0.0"

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-SYS-003: Swagger Documentation
**Priority**: P1
**Category**: Smoke Test

**Test Steps**:
1. Open browser to `http://127.0.0.1:8000/docs`
2. Verify page loads
3. Verify all endpoints are listed

**Expected Result**:
- Swagger UI loads successfully
- All API endpoints visible
- Can test endpoints via UI

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-SYS-004: ReDoc Documentation
**Priority**: P2
**Category**: Smoke Test

**Test Steps**:
1. Open browser to `http://127.0.0.1:8000/redoc`
2. Verify page loads

**Expected Result**:
- ReDoc UI loads successfully
- API documentation is readable

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

## 2. Device Management API Tests

### TC-DEV-001: List All Devices
**Priority**: P0
**Category**: Functional

**Preconditions**: Demo data seeded

**Test Steps**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/devices/?tenant_id=10000000-0000-0000-0000-000000000001&page=1&page_size=10"
```

**Expected Result**:
- Status Code: `200 OK`
- Response contains `devices` array
- Response contains `total`, `page`, `page_size`, `total_pages`
- Returns 5 devices for ACME tenant

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-DEV-002: List Devices with Pagination
**Priority**: P1
**Category**: Functional

**Test Steps**:
```bash
# Page 1 with 3 items
curl -X GET "http://127.0.0.1:8000/api/v1/devices/?tenant_id=10000000-0000-0000-0000-000000000001&page=1&page_size=3"

# Page 2 with 3 items
curl -X GET "http://127.0.0.1:8000/api/v1/devices/?tenant_id=10000000-0000-0000-0000-000000000001&page=2&page_size=3"
```

**Expected Result**:
- Page 1 returns 3 devices
- Page 2 returns 2 devices
- `total` is consistent across pages (5)
- `total_pages` is 2

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-DEV-003: Get Single Device by ID
**Priority**: P0
**Category**: Functional

**Test Steps**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/devices/30000000-0000-0000-0000-000000000001"
```

**Expected Result**:
- Status Code: `200 OK`
- Returns device with matching ID
- Device name is "Warehouse Temperature Sensor #1"
- Contains all device fields (id, name, description, etc.)

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-DEV-004: Create New Device
**Priority**: P0
**Category**: Functional

**Test Steps**:
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/devices/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "QA Test Sensor",
    "description": "Automated QA test device",
    "tenant_id": "10000000-0000-0000-0000-000000000001",
    "device_type_id": "c814b779-4456-4bc1-a0fb-e354cc2d5d20",
    "location": {
      "latitude": 40.7580,
      "longitude": -73.9855,
      "address": "Times Square, NYC"
    },
    "metadata": {
      "test": true,
      "created_by": "qa_automation"
    }
  }'
```

**Expected Result**:
- Status Code: `201 Created`
- Response contains `device_id`, `device_key`, `device_secret`, `mqtt_endpoint`
- Device ID is a valid UUID
- Device key and secret are generated strings

**Post-Test Cleanup**: Delete created device

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-DEV-005: Update Device
**Priority**: P1
**Category**: Functional

**Preconditions**: Device exists with ID from TC-DEV-004

**Test Steps**:
```bash
curl -X PUT "http://127.0.0.1:8000/api/v1/devices/{device_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "QA Test Sensor - Updated",
    "description": "Updated description",
    "status": "maintenance"
  }'
```

**Expected Result**:
- Status Code: `200 OK`
- Response shows updated name and description
- Status changed to "maintenance"
- Other fields unchanged

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-DEV-006: Delete Device
**Priority**: P1
**Category**: Functional

**Preconditions**: Test device exists

**Test Steps**:
```bash
curl -X DELETE "http://127.0.0.1:8000/api/v1/devices/{device_id}"
```

**Expected Result**:
- Status Code: `204 No Content`
- Device no longer appears in list
- GET request for device returns 404

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-DEV-007: List Device Types
**Priority**: P0
**Category**: Functional

**Test Steps**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/devices/types/list"
```

**Expected Result**:
- Status Code: `200 OK`
- Returns array of device types
- Each type has: id, name, description, icon, default_configuration, sensor_schema
- Returns 8 device types

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-DEV-008: Ingest Device Data (Valid Authentication)
**Priority**: P0
**Category**: Functional

**Preconditions**:
- Device exists
- Device key retrieved from database

**Test Steps**:
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/devices/30000000-0000-0000-0000-000000000001/data" \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "30000000-0000-0000-0000-000000000001",
    "device_key": "dev_2cd721db0076cf21f1e560e4b2c6bf98",
    "data": [
      {
        "metric_name": "temperature",
        "value": 22.5,
        "unit": "celsius",
        "quality_score": 100
      },
      {
        "metric_name": "humidity",
        "value": 65.0,
        "unit": "percent",
        "quality_score": 98
      }
    ]
  }'
```

**Expected Result**:
- Status Code: `201 Created`
- Data successfully ingested
- Device `last_seen` timestamp updated

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-DEV-009: Query Device Data
**Priority**: P0
**Category**: Functional

**Preconditions**: Device data ingested (TC-DEV-008)

**Test Steps**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/devices/30000000-0000-0000-0000-000000000001/data?metric_name=temperature&limit=10"
```

**Expected Result**:
- Status Code: `200 OK`
- Returns array of data points
- Each point has: device_id, metric_name, value, unit, time, quality_score
- Data is sorted by time (most recent first)

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-DEV-010: Filter Devices by Status
**Priority**: P2
**Category**: Functional

**Test Steps**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/devices/?tenant_id=10000000-0000-0000-0000-000000000001&status=online&page=1&page_size=10"
```

**Expected Result**:
- Status Code: `200 OK`
- Returns only devices with status "online"
- All returned devices have `"status": "online"`

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-DEV-011: Search Devices by Name
**Priority**: P2
**Category**: Functional

**Test Steps**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/devices/?tenant_id=10000000-0000-0000-0000-000000000001&search=Temperature&page=1&page_size=10"
```

**Expected Result**:
- Status Code: `200 OK`
- Returns only devices with "Temperature" in name or description
- "Warehouse Temperature Sensor #1" is in results

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

## 3. Channel Management API Tests

### TC-CHN-001: List All Channels
**Priority**: P0
**Category**: Functional

**Test Steps**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/channels/"
```

**Expected Result**:
- Status Code: `200 OK`
- Returns array of channels
- Each channel has: id, name, description, is_public

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-CHN-002: Create New Channel
**Priority**: P0
**Category**: Functional

**Test Steps**:
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/channels/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "QA Test Channel",
    "description": "Channel for QA testing",
    "is_public": false
  }'
```

**Expected Result**:
- Status Code: `201 Created`
- Returns created channel with auto-generated ID
- Channel appears in list

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-CHN-003: Get Single Channel
**Priority**: P1
**Category**: Functional

**Preconditions**: Channel exists

**Test Steps**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/channels/{channel_id}"
```

**Expected Result**:
- Status Code: `200 OK`
- Returns channel with matching ID

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-CHN-004: Update Channel
**Priority**: P1
**Category**: Functional

**Test Steps**:
```bash
curl -X PUT "http://127.0.0.1:8000/api/v1/channels/{channel_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "QA Test Channel - Updated",
    "is_public": true
  }'
```

**Expected Result**:
- Status Code: `200 OK`
- Channel name and is_public updated
- Description unchanged (if not provided)

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-CHN-005: Delete Channel
**Priority**: P1
**Category**: Functional

**Test Steps**:
```bash
curl -X DELETE "http://127.0.0.1:8000/api/v1/channels/{channel_id}"
```

**Expected Result**:
- Status Code: `204 No Content`
- Channel removed from database

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

## 4. Insights API Tests

### TC-INS-001: Generate Insights
**Priority**: P2
**Category**: Functional

**Test Steps**:
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/insights/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "channel_id": 1,
    "data": [50, 75, 120, 85, 90, 105, 95]
  }'
```

**Expected Result**:
- Status Code: `200 OK`
- Returns `summary` and `anomalies` fields
- Anomalies contains values > 100 (120, 105)

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

## 5. Data Validation Tests

### TC-VAL-001: Create Device - Missing Required Field (name)
**Priority**: P1
**Category**: Validation

**Test Steps**:
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/devices/" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Missing name field",
    "tenant_id": "10000000-0000-0000-0000-000000000001"
  }'
```

**Expected Result**:
- Status Code: `422 Unprocessable Entity`
- Error message indicates "name" field is required

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-VAL-002: Create Device - Missing Required Field (tenant_id)
**Priority**: P1
**Category**: Validation

**Test Steps**:
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/devices/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Device",
    "description": "Missing tenant_id"
  }'
```

**Expected Result**:
- Status Code: `422 Unprocessable Entity`
- Error indicates "tenant_id" is required

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-VAL-003: Create Device - Invalid Data Type
**Priority**: P1
**Category**: Validation

**Test Steps**:
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/devices/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Device",
    "tenant_id": "10000000-0000-0000-0000-000000000001",
    "location": {
      "latitude": "not-a-number",
      "longitude": -73.9855
    }
  }'
```

**Expected Result**:
- Status Code: `422 Unprocessable Entity`
- Error indicates latitude must be a number

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-VAL-004: Ingest Data - Invalid Device Key
**Priority**: P0
**Category**: Security/Validation

**Test Steps**:
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/devices/30000000-0000-0000-0000-000000000001/data" \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "30000000-0000-0000-0000-000000000001",
    "device_key": "invalid_key_12345",
    "data": [
      {
        "metric_name": "temperature",
        "value": 22.5,
        "unit": "celsius"
      }
    ]
  }'
```

**Expected Result**:
- Status Code: `401 Unauthorized` or `403 Forbidden`
- Error message indicates invalid authentication

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-VAL-005: Update Device - Invalid Status Value
**Priority**: P2
**Category**: Validation

**Test Steps**:
```bash
curl -X PUT "http://127.0.0.1:8000/api/v1/devices/30000000-0000-0000-0000-000000000001" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "invalid_status"
  }'
```

**Expected Result**:
- Status Code: `422 Unprocessable Entity`
- Error indicates status must be one of: online, offline, warning, error, maintenance

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-VAL-006: Device Name Length Validation
**Priority**: P2
**Category**: Validation

**Test Steps**:
```bash
# Test with empty name
curl -X POST "http://127.0.0.1:8000/api/v1/devices/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "tenant_id": "10000000-0000-0000-0000-000000000001"
  }'
```

**Expected Result**:
- Status Code: `422 Unprocessable Entity`
- Error indicates name must have min_length of 1

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

## 6. Error Handling Tests

### TC-ERR-001: Get Non-Existent Device
**Priority**: P1
**Category**: Error Handling

**Test Steps**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/devices/99999999-9999-9999-9999-999999999999"
```

**Expected Result**:
- Status Code: `404 Not Found`
- Error message: "Device not found"

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ERR-002: Update Non-Existent Device
**Priority**: P1
**Category**: Error Handling

**Test Steps**:
```bash
curl -X PUT "http://127.0.0.1:8000/api/v1/devices/99999999-9999-9999-9999-999999999999" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

**Expected Result**:
- Status Code: `404 Not Found`
- Error message indicates device not found

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ERR-003: Delete Non-Existent Device
**Priority**: P1
**Category**: Error Handling

**Test Steps**:
```bash
curl -X DELETE "http://127.0.0.1:8000/api/v1/devices/99999999-9999-9999-9999-999999999999"
```

**Expected Result**:
- Status Code: `404 Not Found`

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ERR-004: Malformed JSON Request
**Priority**: P2
**Category**: Error Handling

**Test Steps**:
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/devices/" \
  -H "Content-Type: application/json" \
  -d '{invalid json'
```

**Expected Result**:
- Status Code: `422 Unprocessable Entity`
- Error indicates JSON parsing error

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ERR-005: Query Device Data for Non-Existent Metric
**Priority**: P2
**Category**: Error Handling

**Test Steps**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/devices/30000000-0000-0000-0000-000000000001/data?metric_name=nonexistent_metric&limit=10"
```

**Expected Result**:
- Status Code: `200 OK`
- Returns empty array (no error, just no data)

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

## 7. Integration Tests

### TC-INT-001: Create Device and Ingest Data Workflow
**Priority**: P0
**Category**: Integration

**Test Steps**:
1. Create a new device (TC-DEV-004)
2. Retrieve device_id and device_key from response
3. Ingest data using the device_key (TC-DEV-008)
4. Query the data (TC-DEV-009)
5. Verify data matches what was ingested

**Expected Result**:
- All steps succeed
- Data retrieved matches data ingested
- Device last_seen is updated

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-INT-002: Multi-Tenant Isolation
**Priority**: P0
**Category**: Security/Integration

**Test Steps**:
1. List devices for tenant 1: `10000000-0000-0000-0000-000000000001`
2. List devices for tenant 2: `10000000-0000-0000-0000-000000000002`
3. Verify tenant 1 devices don't appear in tenant 2 results

**Expected Result**:
- Each tenant sees only their own devices
- No cross-tenant data leakage

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-INT-003: Device Type Relationship
**Priority**: P1
**Category**: Integration

**Test Steps**:
1. Get list of device types
2. Select a device_type_id (e.g., Temperature Sensor)
3. Create device with that device_type_id
4. Verify device is created successfully
5. Retrieve device and verify device_type_id matches

**Expected Result**:
- Device creation succeeds with valid device_type_id
- Foreign key relationship maintained

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-INT-004: Pagination Consistency
**Priority**: P2
**Category**: Integration

**Test Steps**:
1. Create 15 test devices
2. Query page 1 with page_size=5
3. Query page 2 with page_size=5
4. Query page 3 with page_size=5
5. Verify total count is consistent across all pages
6. Verify no duplicate devices across pages
7. Verify all 15 devices appear exactly once

**Expected Result**:
- Total count is 15 (+ 5 existing = 20)
- No duplicates
- All devices accounted for

**Post-Test Cleanup**: Delete 15 test devices

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

### TC-INT-005: Device Update Preserves Related Data
**Priority**: P2
**Category**: Integration

**Test Steps**:
1. Create device with location and metadata
2. Ingest sensor data for the device
3. Update device name and description only
4. Query device data
5. Verify sensor data still exists

**Expected Result**:
- Device name/description updated
- Location and metadata preserved
- Sensor data unchanged

**Status**: [ ] Pass [ ] Fail [ ] Blocked

---

## Test Execution Summary

**Total Test Cases**: 48
- P0 (Critical): 12
- P1 (High): 16
- P2 (Medium): 20

**By Category**:
- Smoke Tests: 4
- Functional: 23
- Validation: 6
- Error Handling: 5
- Security: 2
- Integration: 5
- Performance: 3

**Pass/Fail Summary**:
- Passed: _____ / 48
- Failed: _____ / 48
- Blocked: _____ / 48
- Not Executed: _____ / 48

**Test Coverage**: _____%

---

**Tested By**: _________________
**Date**: _________________
**Build Version**: 1.0.0
**Environment**: Local Development
