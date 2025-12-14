# IoTLinker - QA Test Plan

## Document Information
- **Project**: IoTLinker Enterprise
- **Version**: 1.0.0
- **Last Updated**: 2025-12-13
- **Test Scope**: Phase 1 (Database) + Phase 2 (Device Management API)

---

## 1. Executive Summary

This QA test plan covers comprehensive testing of the IoTLinker application including:
- Database schema and integrity
- REST API endpoints
- Authentication and authorization
- Data validation
- Error handling
- Performance baselines

---

## 2. Testing Scope

### 2.1 In Scope
- ✅ Database schema validation
- ✅ Device Management API (8 endpoints)
- ✅ Channel Management API (5 endpoints)
- ✅ Insights API (1 endpoint)
- ✅ Alerts API (if implemented)
- ✅ Data validation and constraints
- ✅ Error handling and responses
- ✅ CORS configuration
- ✅ API documentation (Swagger/ReDoc)

### 2.2 Out of Scope (Future Testing)
- ❌ MQTT broker integration
- ❌ WebSocket real-time features
- ❌ Clerk authentication integration
- ❌ Frontend React application
- ❌ Load/stress testing
- ❌ Security penetration testing

---

## 3. Test Environment

### 3.1 Backend Stack
```
Python: 3.13
FastAPI: 0.124.4
Uvicorn: 0.38.0
Pydantic: 2.12.5
Supabase SDK: 2.25.1
PostgreSQL: 15.x (via Supabase)
```

### 3.2 Database
```
Supabase URL: http://127.0.0.1:54321
Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio: http://127.0.0.1:54323
```

### 3.3 API Server
```
Base URL: http://127.0.0.1:8000
API Prefix: /api/v1
Swagger UI: http://127.0.0.1:8000/docs
ReDoc: http://127.0.0.1:8000/redoc
```

---

## 4. Test Categories

### 4.1 Functional Testing
- API endpoint functionality
- CRUD operations validation
- Business logic verification
- Data flow testing

### 4.2 Integration Testing
- Database-API integration
- Cross-endpoint data consistency
- Transaction integrity

### 4.3 Validation Testing
- Input validation (Pydantic models)
- Data type validation
- Constraint enforcement
- UUID format handling

### 4.4 Error Testing
- Invalid input handling
- Missing required fields
- Non-existent resource handling
- Database constraint violations

### 4.5 Performance Testing (Baseline)
- Response time measurement
- Query performance
- Pagination efficiency

---

## 5. Test Data

### 5.1 Pre-seeded Demo Data

**Tenants:**
- ID: `10000000-0000-0000-0000-000000000001` (ACME Corporation)
- ID: `10000000-0000-0000-0000-000000000002` (TechStart Industries)

**Users:**
- ID: `20000000-0000-0000-0000-000000000001` (john.doe@acme.com)
- ID: `20000000-0000-0000-0000-000000000002` (jane.smith@acme.com)
- ID: `20000000-0000-0000-0000-000000000003` (bob.wilson@techstart.com)

**Devices:**
- 5 devices for ACME Corporation tenant
- Device IDs: `30000000-0000-0000-0000-00000000000[1-5]`

**Device Types:**
- 8 device types (Temperature Sensor, Gateway, Energy Meter, etc.)

### 5.2 Test Data Guidelines
- Use valid UUIDs for ID fields
- Use tenant_id: `10000000-0000-0000-0000-000000000001` for testing
- Device keys available in database for data ingestion tests
- Test both valid and invalid data scenarios

---

## 6. Success Criteria

### 6.1 API Response Standards
- ✅ 2xx responses for successful operations
- ✅ 4xx responses for client errors
- ✅ 5xx responses for server errors
- ✅ Consistent JSON response format
- ✅ Proper HTTP status codes

### 6.2 Performance Benchmarks
- API response time < 200ms (simple queries)
- API response time < 500ms (complex queries)
- Database query time < 100ms

### 6.3 Data Integrity
- ✅ Foreign key constraints enforced
- ✅ Required fields validated
- ✅ Data types consistent
- ✅ Timestamps auto-generated
- ✅ UUIDs unique

---

## 7. Testing Tools

### 7.1 Manual Testing
- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc
- **Supabase Studio**: http://127.0.0.1:54323

### 7.2 Automated Testing
- **cURL**: Command-line API testing
- **Postman**: API collection testing
- **Python pytest**: Unit/integration tests (future)

### 7.3 Database Testing
- **Supabase Studio**: Data verification
- **psql**: Direct database queries
- **pgAdmin**: Database inspection

---

## 8. Test Execution Schedule

### Phase 1: Smoke Testing (Day 1)
- ✅ Verify server starts successfully
- ✅ Health check endpoint responsive
- ✅ Database connectivity
- ✅ API documentation accessible

### Phase 2: Functional Testing (Day 1-2)
- Test all Device Management endpoints
- Test all Channel Management endpoints
- Test Insights endpoint
- Verify CRUD operations

### Phase 3: Integration Testing (Day 2-3)
- Cross-endpoint data consistency
- Device-to-device_type relationships
- Tenant isolation validation
- Data ingestion workflow

### Phase 4: Error & Edge Case Testing (Day 3-4)
- Invalid input scenarios
- Missing required fields
- Non-existent resources
- Boundary value testing

### Phase 5: Documentation & Reporting (Day 4-5)
- Test result documentation
- Bug report creation
- Test coverage analysis
- Final QA report

---

## 9. Bug Reporting Template

```markdown
**Bug ID**: [AUTO-INCREMENT]
**Severity**: [Critical | High | Medium | Low]
**Priority**: [P0 | P1 | P2 | P3]

**Title**: [Brief description]

**Environment**:
- API Version: 1.0.0
- Endpoint: [e.g., GET /api/v1/devices/]
- Database: Supabase Local

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happened]

**Evidence**:
- Request: [cURL command or JSON]
- Response: [Response body]
- Status Code: [HTTP code]

**Additional Notes**:
[Any other relevant information]
```

---

## 10. Test Sign-off Criteria

### 10.1 Exit Criteria
- ✅ All critical and high-priority bugs resolved
- ✅ 100% of P0/P1 test cases passed
- ✅ 95%+ of all test cases passed
- ✅ Performance benchmarks met
- ✅ API documentation accurate
- ✅ Test report completed

### 10.2 Sign-off Approval
- [ ] QA Lead: ___________________ Date: _______
- [ ] Backend Developer: ___________ Date: _______
- [ ] Product Owner: ______________ Date: _______

---

## 11. Risk Assessment

### 11.1 High Risk Areas
- **Device Authentication**: Device key validation critical for security
- **Multi-tenancy**: Tenant isolation must be enforced
- **Data Ingestion**: High-volume sensor data requires optimization
- **UUID Handling**: Non-standard UUIDs may cause validation issues

### 11.2 Mitigation Strategies
- Comprehensive security testing for device authentication
- Explicit tenant_id filtering in all queries
- Performance testing with large datasets
- Consistent UUID format in test data

---

## 12. Appendices

### Appendix A: Test Case Document
See [QA_TEST_CASES.md](./QA_TEST_CASES.md)

### Appendix B: Postman Collection
See [IoTLinker_API_Tests.postman_collection.json](./IoTLinker_API_Tests.postman_collection.json)

### Appendix C: Test Data
See [QA_TEST_DATA.md](./QA_TEST_DATA.md)

### Appendix D: Bug Tracking
See [QA_BUG_TRACKER.md](./QA_BUG_TRACKER.md)

---

**Document Prepared By**: Claude AI Assistant
**Review Status**: Draft
**Next Review Date**: Upon Phase 3 completion
