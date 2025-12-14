# IoTLinker - QA Test Data & Scenarios

## Overview
This document provides comprehensive test data and testing scenarios for the IoTLinker platform.

---

## Table of Contents
1. [Pre-seeded Demo Data](#1-pre-seeded-demo-data)
2. [Test User Accounts](#2-test-user-accounts)
3. [Test Scenarios](#3-test-scenarios)
4. [Sample API Payloads](#4-sample-api-payloads)
5. [Edge Cases & Boundary Values](#5-edge-cases--boundary-values)
6. [Performance Test Data](#6-performance-test-data)

---

## 1. Pre-seeded Demo Data

### Tenants

| Tenant ID | Name | Slug | Subscription Tier | Max Devices | Is Active |
|-----------|------|------|-------------------|-------------|-----------|
| `10000000-0000-0000-0000-000000000001` | ACME Corporation | acme-corp | enterprise | 1000 | true |
| `10000000-0000-0000-0000-000000000002` | TechStart Industries | techstart | professional | 100 | true |
| `10000000-0000-0000-0000-000000000003` | SmartHome Inc | smarthome | free | 10 | true |

---

### Users

| User ID | Email | Name | Tenant ID | Role |
|---------|-------|------|-----------|------|
| `20000000-0000-0000-0000-000000000001` | john.doe@acme.com | John Doe | ACME | admin |
| `20000000-0000-0000-0000-000000000002` | jane.smith@acme.com | Jane Smith | ACME | operator |
| `20000000-0000-0000-0000-000000000003` | bob.wilson@techstart.com | Bob Wilson | TechStart | admin |

---

### Devices (ACME Corporation)

| Device ID | Name | Type | Status | Device Key |
|-----------|------|------|--------|------------|
| `30000000-0000-0000-0000-000000000001` | Warehouse Temperature Sensor #1 | Temperature Sensor | online | `dev_2cd721db0076cf21f1e560e4b2c6bf98` |
| `30000000-0000-0000-0000-000000000002` | Production Line Gateway #1 | Industrial Gateway | online | `dev_5796e1b45c32a94e55e94527d9b640a8` |
| `30000000-0000-0000-0000-000000000003` | Building Energy Meter | Smart Energy Meter | online | `dev_4d5b3d8c253d18d3121eb1bda67c3007` |
| `30000000-0000-0000-0000-000000000004` | Motor Vibration Sensor #1 | Vibration Sensor | online | `dev_4eca3cd25ef8c3e02d9efd991a147f93` |
| `30000000-0000-0000-0000-000000000005` | Office Air Quality Monitor | Air Quality Monitor | online | `dev_88462cc5ee40cfeb2481d9b7876ff6d0` |

---

### Device Types

| Type ID | Name | Icon | Description |
|---------|------|------|-------------|
| `c814b779-4456-4bc1-a0fb-e354cc2d5d20` | Temperature Sensor | thermometer | Environmental temperature monitoring |
| `672aee13-f73f-42d1-a91d-325f6df7d05a` | Industrial Gateway | server | Multi-protocol industrial IoT gateway |
| `5645e548-3429-4ec6-a723-bcc0d9386b1e` | Smart Energy Meter | zap | Energy consumption monitoring |
| `3523810d-a98a-49bb-9e85-feca4bd30720` | Vibration Sensor | activity | Machine vibration for predictive maintenance |
| `be52b448-0b51-43df-807a-ccd394a235a2` | Air Quality Monitor | wind | Indoor and outdoor air quality measurement |
| `0c6e25ad-fec3-4925-be43-b20728c980b0` | Water Quality Sensor | droplet | Water quality monitoring |
| `1e9666c5-44e9-4eaf-8312-b7bdcade1f44` | GPS Tracker | map-pin | Asset tracking and fleet management |
| `8dc8b87c-6800-473d-979f-e444cc565298` | Generic IoT Device | cpu | Customizable IoT device |

---

## 2. Test User Accounts

### For API Testing

**Admin User (Full Access)**
```
Email: john.doe@acme.com
Tenant: ACME Corporation
Tenant ID: 10000000-0000-0000-0000-000000000001
Role: admin
```

**Operator User (Limited Access)**
```
Email: jane.smith@acme.com
Tenant: ACME Corporation
Tenant ID: 10000000-0000-0000-0000-000000000001
Role: operator
```

**Separate Tenant User (Isolation Testing)**
```
Email: bob.wilson@techstart.com
Tenant: TechStart Industries
Tenant ID: 10000000-0000-0000-0000-000000000002
Role: admin
```

---

## 3. Test Scenarios

### Scenario 1: New Customer Onboarding

**Objective**: Simulate a new customer setting up their first device

**Steps**:
1. Create new tenant (SmartHome Inc)
2. Create admin user for tenant
3. Create first temperature sensor device
4. Ingest initial sensor data
5. Verify device appears in dashboard
6. Query device data

**Expected Outcome**: Complete onboarding flow succeeds

---

### Scenario 2: Multi-Device Deployment

**Objective**: Deploy multiple devices for warehouse monitoring

**Steps**:
1. List available device types
2. Create 10 temperature sensors for different warehouse zones
3. Create 1 gateway device
4. Associate sensors with gateway (via metadata)
5. Ingest data from all sensors
6. Query aggregated data

**Expected Outcome**: All devices operational and reporting data

---

### Scenario 3: Device Lifecycle Management

**Objective**: Test full device lifecycle

**Steps**:
1. Create device (status: online)
2. Ingest operational data
3. Update device to maintenance status
4. Update firmware version
5. Return device to online status
6. Eventually decommission (delete) device

**Expected Outcome**: All status transitions successful, data preserved

---

### Scenario 4: Anomaly Detection Workflow

**Objective**: Simulate anomaly detection and alerting

**Steps**:
1. Create vibration sensor
2. Ingest normal data (0.5-1.5g)
3. Ingest anomalous data (5.0g - exceeds threshold)
4. Generate insights via insights API
5. Verify anomaly detected in response

**Expected Outcome**: System identifies anomalies correctly

---

### Scenario 5: High-Volume Data Ingestion

**Objective**: Test data ingestion at scale

**Steps**:
1. Create device
2. Ingest batch of 100 data points
3. Verify all points stored
4. Query data with time filters
5. Test pagination of results

**Expected Outcome**: All data ingested and queryable

---

### Scenario 6: Multi-Tenant Isolation

**Objective**: Verify tenant data isolation

**Steps**:
1. Query devices for Tenant A
2. Query devices for Tenant B
3. Attempt to access Tenant A device using Tenant B credentials
4. Verify no cross-tenant data leakage

**Expected Outcome**: Complete tenant isolation enforced

---

## 4. Sample API Payloads

### Create Temperature Sensor
```json
{
  "name": "Warehouse Zone A - Temp Sensor",
  "description": "Temperature monitoring for Zone A",
  "tenant_id": "10000000-0000-0000-0000-000000000001",
  "device_type_id": "c814b779-4456-4bc1-a0fb-e354cc2d5d20",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Warehouse St, New York, NY 10001"
  },
  "metadata": {
    "zone": "A",
    "floor": 1,
    "installation_date": "2024-01-15",
    "calibration_due": "2025-01-15"
  },
  "configuration": {
    "sampling_interval_seconds": 60,
    "alert_threshold_high": 30,
    "alert_threshold_low": 5
  },
  "firmware_version": "1.2.3"
}
```

### Create Industrial Gateway
```json
{
  "name": "Production Line 1 - Gateway",
  "description": "Main data aggregator for production line 1",
  "tenant_id": "10000000-0000-0000-0000-000000000001",
  "device_type_id": "672aee13-f73f-42d1-a91d-325f6df7d05a",
  "metadata": {
    "line_number": 1,
    "production_area": "Assembly",
    "max_downstream_devices": 50
  },
  "configuration": {
    "protocols": ["modbus", "mqtt", "opcua"],
    "max_connections": 100
  }
}
```

### Create Energy Meter
```json
{
  "name": "Main Building - Energy Meter",
  "description": "Primary energy consumption monitoring",
  "tenant_id": "10000000-0000-0000-0000-000000000001",
  "device_type_id": "5645e548-3429-4ec6-a723-bcc0d9386b1e",
  "metadata": {
    "circuit": "main",
    "building": "HQ",
    "rated_voltage": 220,
    "rated_current": 100
  },
  "configuration": {
    "tariff_enabled": true,
    "sampling_interval_seconds": 300,
    "power_factor_correction": true
  }
}
```

### Ingest Temperature Data
```json
{
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
}
```

### Ingest Vibration Data (with Anomaly)
```json
{
  "device_id": "30000000-0000-0000-0000-000000000004",
  "device_key": "dev_4eca3cd25ef8c3e02d9efd991a147f93",
  "data": [
    {
      "metric_name": "vibration_x",
      "value": 5.2,
      "unit": "g",
      "quality_score": 100,
      "metadata": {
        "anomaly_detected": true,
        "threshold": 2.5
      }
    },
    {
      "metric_name": "vibration_y",
      "value": 0.8,
      "unit": "g",
      "quality_score": 100
    },
    {
      "metric_name": "vibration_z",
      "value": 1.2,
      "unit": "g",
      "quality_score": 100
    },
    {
      "metric_name": "frequency",
      "value": 60.5,
      "unit": "hz",
      "quality_score": 100
    }
  ]
}
```

### Ingest Energy Data
```json
{
  "device_id": "30000000-0000-0000-0000-000000000003",
  "device_key": "dev_4d5b3d8c253d18d3121eb1bda67c3007",
  "data": [
    {
      "metric_name": "power",
      "value": 5500.0,
      "unit": "watts",
      "quality_score": 100
    },
    {
      "metric_name": "energy",
      "value": 125.5,
      "unit": "kwh",
      "quality_score": 100
    },
    {
      "metric_name": "voltage",
      "value": 220.5,
      "unit": "volts",
      "quality_score": 100
    },
    {
      "metric_name": "current",
      "value": 25.0,
      "unit": "amperes",
      "quality_score": 100
    }
  ]
}
```

### Update Device Status
```json
{
  "status": "maintenance",
  "metadata": {
    "maintenance_reason": "Scheduled calibration",
    "maintenance_scheduled": "2024-12-15T10:00:00Z",
    "expected_downtime_minutes": 120
  }
}
```

---

## 5. Edge Cases & Boundary Values

### Valid Edge Cases

**Minimum Device Name Length (1 character)**
```json
{
  "name": "A",
  "tenant_id": "10000000-0000-0000-0000-000000000001",
  "device_type_id": "c814b779-4456-4bc1-a0fb-e354cc2d5d20"
}
```

**Maximum Device Name Length (255 characters)**
```json
{
  "name": "A very long device name that contains exactly two hundred and fifty five characters to test the maximum length validation constraint in the Pydantic model and ensure that the API correctly handles this edge case without truncation or errors ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "tenant_id": "10000000-0000-0000-0000-000000000001"
}
```

**Extreme Temperature Values**
```json
{
  "device_id": "30000000-0000-0000-0000-000000000001",
  "device_key": "dev_2cd721db0076cf21f1e560e4b2c6bf98",
  "data": [
    {
      "metric_name": "temperature",
      "value": -273.15,
      "unit": "celsius",
      "quality_score": 100
    }
  ]
}
```

**Quality Score Boundaries**
```json
{
  "device_id": "30000000-0000-0000-0000-000000000001",
  "device_key": "dev_2cd721db0076cf21f1e560e4b2c6bf98",
  "data": [
    {
      "metric_name": "temperature",
      "value": 25.0,
      "unit": "celsius",
      "quality_score": 0
    },
    {
      "metric_name": "humidity",
      "value": 60.0,
      "unit": "percent",
      "quality_score": 100
    }
  ]
}
```

**Pagination Edge Cases**
```
# Page 1 with page_size = 1
GET /api/v1/devices/?tenant_id=...&page=1&page_size=1

# Last page
GET /api/v1/devices/?tenant_id=...&page=5&page_size=1

# Beyond last page (should return empty)
GET /api/v1/devices/?tenant_id=...&page=999&page_size=10
```

---

### Invalid Edge Cases (Should Fail Validation)

**Empty Device Name**
```json
{
  "name": "",
  "tenant_id": "10000000-0000-0000-0000-000000000001"
}
```
Expected: `422 Unprocessable Entity` - name must have min_length of 1

**Missing Required Field**
```json
{
  "description": "No name provided",
  "tenant_id": "10000000-0000-0000-0000-000000000001"
}
```
Expected: `422 Unprocessable Entity` - name is required

**Invalid Device Status**
```json
{
  "status": "invalid_status"
}
```
Expected: `422 Unprocessable Entity` - status must be one of: online, offline, warning, error, maintenance

**Quality Score Out of Range**
```json
{
  "device_id": "30000000-0000-0000-0000-000000000001",
  "device_key": "dev_2cd721db0076cf21f1e560e4b2c6bf98",
  "data": [
    {
      "metric_name": "temperature",
      "value": 25.0,
      "unit": "celsius",
      "quality_score": 150
    }
  ]
}
```
Expected: `422 Unprocessable Entity` - quality_score must be 0-100

**Invalid Data Type**
```json
{
  "name": "Test Device",
  "tenant_id": "10000000-0000-0000-0000-000000000001",
  "location": {
    "latitude": "not-a-number",
    "longitude": -73.9855
  }
}
```
Expected: `422 Unprocessable Entity` - latitude must be a number

---

## 6. Performance Test Data

### Load Test Dataset - 1000 Devices

**Script to Generate Test Devices**:
```python
import requests
import uuid

base_url = "http://127.0.0.1:8000"
tenant_id = "10000000-0000-0000-0000-000000000001"
device_type_id = "c814b779-4456-4bc1-a0fb-e354cc2d5d20"

for i in range(1000):
    device = {
        "name": f"Load Test Device {i+1}",
        "description": f"Performance test device number {i+1}",
        "tenant_id": tenant_id,
        "device_type_id": device_type_id,
        "metadata": {
            "test_batch": "load_test_001",
            "sequence": i+1
        }
    }

    response = requests.post(f"{base_url}/api/v1/devices/", json=device)
    if response.status_code == 201:
        print(f"Created device {i+1}/1000")
    else:
        print(f"Failed to create device {i+1}: {response.status_code}")
```

### High-Volume Data Ingestion Test

**100 Data Points Per Request**:
```json
{
  "device_id": "30000000-0000-0000-0000-000000000001",
  "device_key": "dev_2cd721db0076cf21f1e560e4b2c6bf98",
  "data": [
    {"metric_name": "temperature", "value": 22.1, "unit": "celsius", "quality_score": 100},
    {"metric_name": "temperature", "value": 22.2, "unit": "celsius", "quality_score": 100},
    {"metric_name": "temperature", "value": 22.3, "unit": "celsius", "quality_score": 100},
    ... (repeat for 100 data points)
  ]
}
```

### Concurrent Request Test

**Simulate 100 concurrent device data queries**:
```bash
# Using Apache Bench
ab -n 1000 -c 100 "http://127.0.0.1:8000/api/v1/devices/?tenant_id=10000000-0000-0000-0000-000000000001&page=1&page_size=10"

# Using hey
hey -n 1000 -c 100 "http://127.0.0.1:8000/api/v1/devices/?tenant_id=10000000-0000-0000-0000-000000000001&page=1&page_size=10"
```

---

## Quick Reference - cURL Commands

### List Devices
```bash
curl "http://127.0.0.1:8000/api/v1/devices/?tenant_id=10000000-0000-0000-0000-000000000001&page=1&page_size=10"
```

### Create Device
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/devices/" \
  -H "Content-Type: application/json" \
  -d @test_device.json
```

### Ingest Data
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/devices/30000000-0000-0000-0000-000000000001/data" \
  -H "Content-Type: application/json" \
  -d @sensor_data.json
```

### Query Data
```bash
curl "http://127.0.0.1:8000/api/v1/devices/30000000-0000-0000-0000-000000000001/data?metric_name=temperature&limit=100"
```

---

**Document Version**: 1.0
**Last Updated**: 2024-12-13
**Test Data Set**: Phase 2 (Device Management)
