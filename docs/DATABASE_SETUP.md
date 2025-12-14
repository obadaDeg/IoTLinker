# IoTLinker Database Setup Guide

This guide will walk you through setting up the complete database infrastructure for IoTLinker Enterprise.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Database Schema Overview](#database-schema-overview)
5. [Running Migrations](#running-migrations)
6. [Seeding Demo Data](#seeding-demo-data)
7. [Troubleshooting](#troubleshooting)
8. [Clerk Integration](#clerk-integration)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (for Supabase local development)
- **Node.js** 18+ and npm
- **Supabase CLI**
  ```bash
  npm install -g supabase
  ```

---

## Quick Start

### 1. Start Supabase Locally

```bash
# Navigate to project root
cd IoTLinker-1

# Start Supabase (will download Docker images on first run)
supabase start
```

This will start:
- PostgreSQL database on `localhost:54322`
- Supabase API on `localhost:54321`
- Supabase Studio on `localhost:54323`
- Email testing (Inbucket) on `localhost:54324`

### 2. Apply Migrations

```bash
# Apply all migrations
supabase db reset

# Or apply migrations manually
supabase migration up
```

### 3. Verify Setup

Open Supabase Studio in your browser:
```
http://localhost:54323
```

You should see all tables created with demo data.

---

## Detailed Setup

### Step 1: Install TimescaleDB Extension

The second migration (`20241213000002_enable_timescaledb.sql`) requires TimescaleDB extension.

**For local Supabase:**
TimescaleDB should be included in Supabase's PostgreSQL image. If not:

```bash
# Connect to database
supabase db connect

# In psql, run:
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

**For production (managed Supabase):**
Contact Supabase support to enable TimescaleDB extension.

### Step 2: Get Supabase Credentials

After starting Supabase, get your credentials:

```bash
supabase status
```

Copy these values to your `.env` file:
- `API URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role key` → `SUPABASE_SERVICE_KEY`

### Step 3: Create .env File

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your Supabase keys
```

---

## Database Schema Overview

### Core Tables

#### **Multi-Tenancy**
- `organizations` - Top-level organization entities
- `tenants` - Isolated tenant instances with multi-tenancy support
- `users` - User accounts (synced with Clerk)

#### **RBAC (Role-Based Access Control)**
- `roles` - User roles (Admin, Manager, User, etc.)
- `permissions` - Granular permissions
- `user_roles` - User-role assignments

#### **IoT Device Management**
- `device_types` - Device templates
- `devices` - IoT device registry
- `device_data` - Time-series sensor data (TimescaleDB hypertable)
- `device_connections` - Connection history

#### **Alerts & Notifications**
- `alerts` - Alert rules
- `alert_instances` - Triggered alerts
- `notification_channels` - Email, SMS, webhook configs

#### **Automation**
- `workflows` - Automation workflows
- `workflow_executions` - Workflow run history

#### **Analytics**
- `anomalies` - AI-detected anomalies
- `predictions` - Predictive maintenance forecasts

#### **Security**
- `api_tokens` - API access tokens
- `audit_logs` - Audit trail

### Key Features

✅ **Row-Level Security (RLS)** - Multi-tenant data isolation
✅ **TimescaleDB Hypertables** - Optimized time-series storage
✅ **Continuous Aggregates** - Pre-computed hourly/daily metrics
✅ **Data Retention Policies** - Automatic old data cleanup (90 days)
✅ **Compression** - Storage optimization for old data
✅ **Triggers** - Auto-update timestamps, device key generation

---

## Running Migrations

### View Migration Status

```bash
supabase migration list
```

### Apply Specific Migration

```bash
supabase migration up --version 20241213000001
```

### Create New Migration

```bash
supabase migration new your_migration_name
```

### Reset Database (Caution!)

```bash
# This will drop all data and reapply migrations
supabase db reset
```

---

## Seeding Demo Data

The seed file (`supabase/seed.sql`) includes:

- 1 demo organization
- 1 demo tenant
- 3 demo users (admin, manager, user)
- 5 demo devices (temperature, energy, vibration sensors)
- 24 hours of synthetic sensor data
- 3 demo alert rules
- 2 demo notification channels

**To seed data:**

```bash
# Automatic (on db reset)
supabase db reset

# Manual
supabase db seed
```

**Demo Accounts:**
- `admin@demo-corp.com` - Tenant Admin
- `manager@demo-corp.com` - Department Manager
- `user@demo-corp.com` - End User

---

## Migration Files Explained

### 1. `20241213000001_init_schema.sql`
**Purpose:** Core database schema
**Contents:**
- All main tables (organizations, tenants, users, devices, etc.)
- Indexes for performance
- Triggers for auto-updates
- Basic functions

### 2. `20241213000002_enable_timescaledb.sql`
**Purpose:** Time-series optimization
**Contents:**
- Enable TimescaleDB extension
- Convert `device_data` to hypertable
- Create continuous aggregates (hourly, daily)
- Set up compression and retention policies
- Helper functions for time-series queries

### 3. `20241213000003_enable_rls.sql`
**Purpose:** Multi-tenant security
**Contents:**
- Enable RLS on all tables
- Tenant isolation policies
- Permission-based policies
- Helper functions (`get_current_tenant_id`, `has_permission`)

### 4. `20241213000004_seed_rbac.sql`
**Purpose:** Initial roles and permissions
**Contents:**
- System roles (Super Admin, Tenant Admin, Manager, etc.)
- Granular permissions
- Pre-configured device types

### 5. `20241213000005_clerk_integration.sql`
**Purpose:** Clerk user synchronization
**Contents:**
- Webhook handler functions
- User sync functions
- Metadata sync
- Role assignment helpers

---

## Clerk Integration

### Setting up Clerk Webhooks

1. **Go to Clerk Dashboard** → Your Application → Webhooks

2. **Create new webhook endpoint:**
   ```
   URL: https://your-domain.com/api/webhooks/clerk
   Events:
   - user.created
   - user.updated
   - user.deleted
   ```

3. **Copy the webhook secret** and add to `.env`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_xxxxx
   ```

### User Sync Flow

When a user signs up via Clerk:

1. Clerk sends `user.created` webhook
2. Your backend calls `handle_clerk_user_created()`
3. User is created in Supabase `users` table
4. Default "End User" role is assigned
5. Audit log entry is created

### Manual User Sync (Development)

```sql
-- Create user from Clerk
SELECT handle_clerk_user_created(
    p_clerk_user_id := 'user_xxxxx',
    p_email := 'user@example.com',
    p_full_name := 'John Doe',
    p_tenant_id := '10000000-0000-0000-0000-000000000001'
);

-- Assign admin role
SELECT assign_role_to_user(
    p_user_id := (SELECT id FROM users WHERE email = 'user@example.com'),
    p_role_name := 'Tenant Admin'
);
```

---

## Troubleshooting

### Issue: TimescaleDB extension not found

**Solution:**
```bash
# Connect to database
supabase db connect

# Check available extensions
\dx

# If timescaledb is not listed, it may not be available in your PostgreSQL version
# For local development, you can comment out TimescaleDB migration temporarily
```

### Issue: Migration fails with permission error

**Solution:**
```bash
# Reset and try again
supabase db reset

# Or connect as superuser
supabase db connect
```

### Issue: Can't connect to Supabase

**Solution:**
```bash
# Check Supabase status
supabase status

# Restart Supabase
supabase stop
supabase start
```

### Issue: RLS policies blocking queries

**Solution:**
```sql
-- Temporarily disable RLS for testing (NOT for production)
ALTER TABLE devices DISABLE ROW LEVEL SECURITY;

-- Check current policies
SELECT * FROM pg_policies WHERE tablename = 'devices';
```

### Issue: Seed data not appearing

**Solution:**
```bash
# Manually run seed file
supabase db seed

# Or use psql
psql "postgresql://postgres:postgres@localhost:54322/postgres" -f supabase/seed.sql
```

---

## Useful SQL Commands

### Check Table Sizes
```sql
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### View All Devices
```sql
SELECT
    d.id,
    d.name,
    d.status,
    dt.name AS device_type,
    t.name AS tenant
FROM devices d
JOIN device_types dt ON d.device_type_id = dt.id
JOIN tenants t ON d.tenant_id = t.id;
```

### Check Latest Sensor Readings
```sql
SELECT
    d.name AS device,
    dd.metric_name,
    dd.value,
    dd.unit,
    dd.time
FROM device_data dd
JOIN devices d ON dd.device_id = d.id
WHERE dd.time > NOW() - INTERVAL '1 hour'
ORDER BY dd.time DESC
LIMIT 20;
```

### View User Roles
```sql
SELECT
    u.email,
    u.full_name,
    r.name AS role,
    t.name AS tenant
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
JOIN tenants t ON u.tenant_id = t.id;
```

---

## Next Steps

After setting up the database:

1. ✅ Database schema created
2. ✅ Migrations applied
3. ✅ Demo data seeded
4. ⬜ Set up backend API (FastAPI)
5. ⬜ Configure MQTT broker
6. ⬜ Set up Clerk webhook endpoint
7. ⬜ Connect frontend to database
8. ⬜ Test device data ingestion

---

## Production Deployment

For production deployment to managed Supabase:

1. **Create Supabase project** at https://supabase.com

2. **Link your project:**
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Push migrations:**
   ```bash
   supabase db push
   ```

4. **Update environment variables** with production keys

5. **Enable required extensions** via Supabase dashboard

6. **Configure backups** and monitoring

---

## Support

For issues or questions:
- Check [Supabase Documentation](https://supabase.com/docs)
- Check [TimescaleDB Documentation](https://docs.timescale.com)
- Review migration logs: `supabase/migrations/*.sql`
- Check database logs: `supabase logs`

---

**Last Updated:** December 13, 2024
**Version:** 1.0
**Maintainer:** IoTLinker Development Team
