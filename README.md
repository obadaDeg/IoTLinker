# IoTLinker Enterprise

> **AI-Powered IoT Platform for Enterprise-Scale Deployments**

Enterprise-grade IoT platform combining real-time data processing, predictive analytics, low-code automation, and seamless integration capabilities.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-development-yellow)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker Desktop
- Supabase CLI
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/iotlinker.git
cd iotlinker

# Install Supabase CLI
npm install -g supabase

# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && pip install -r requirements.txt && cd ..

# Setup environment
cp .env.example .env
# Edit .env with your keys

# Start Supabase
supabase start

# Apply migrations
supabase db reset

# Start development servers
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
IoTLinker-1/
├── frontend/                    # Next.js 15 + React 19 application
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   ├── components/         # React components
│   │   ├── lib/                # Utilities & API clients
│   │   └── types/              # TypeScript types
│   └── package.json
│
├── backend/                     # FastAPI application
│   ├── app/
│   │   └── api/v1/             # API endpoints
│   ├── main.py                 # FastAPI entry point
│   └── requirements.txt
│
├── supabase/                    # Database configuration
│   ├── migrations/             # 5 migration files
│   │   ├── 20241213000001_init_schema.sql
│   │   ├── 20241213000002_enable_timescaledb.sql
│   │   ├── 20241213000003_enable_rls.sql
│   │   ├── 20241213000004_seed_rbac.sql
│   │   └── 20241213000005_clerk_integration.sql
│   ├── seed.sql                # Demo data
│   └── config.toml             # Supabase config
│
├── docs/                        # Documentation
│   ├── DATABASE_SETUP.md       # Database setup guide
│   ├── SETUP_INSTRUCTIONS.md   # Getting started guide
│   └── requirements.md         # Full requirements doc
│
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

---

## 🏗️ Architecture

### Technology Stack

#### **Frontend**
- **Framework:** Next.js 15.2.4 + React 19
- **Language:** TypeScript 5
- **Styling:** TailwindCSS 4.1.3
- **Auth:** Clerk
- **Database Client:** Supabase
- **Charts:** Recharts
- **State:** Zustand (planned)

#### **Backend**
- **Framework:** FastAPI (Python 3.11+)
- **Database:** PostgreSQL 15 + TimescaleDB
- **Caching:** Redis (planned)
- **Message Queue:** MQTT (Mosquitto)
- **AI/ML:** OpenAI API
- **ORM:** SQLAlchemy

#### **Infrastructure**
- **Development:** Docker + Supabase Local
- **Production:** AWS EKS (planned)
- **Monitoring:** Sentry, Prometheus (planned)

### Database Schema

**30+ Tables** organized into:
- **Multi-Tenancy** (organizations, tenants, users)
- **RBAC** (roles, permissions, user_roles)
- **IoT Core** (devices, device_types, device_data)
- **Alerts** (alerts, alert_instances, notification_channels)
- **Workflows** (workflows, workflow_executions)
- **Analytics** (anomalies, predictions)
- **Security** (api_tokens, audit_logs)

**Key Features:**
- ✅ Row-Level Security (RLS) for multi-tenant isolation
- ✅ TimescaleDB hypertables for time-series data
- ✅ Continuous aggregates (hourly, daily metrics)
- ✅ Automatic data retention (90 days)
- ✅ Data compression for storage optimization

---

## 📊 Features

### ✅ Implemented

- [x] Authentication (Clerk integration)
- [x] Database schema with migrations
- [x] Multi-tenant architecture
- [x] RBAC system (6 roles, 20+ permissions)
- [x] Device management UI (basic)
- [x] Real-time data subscriptions
- [x] Data visualization (charts)
- [x] Alert configuration UI
- [x] Responsive design

### 🚧 In Progress

- [ ] Device management API (FastAPI)
- [ ] MQTT broker integration
- [ ] Data ingestion pipeline
- [ ] Clerk webhook sync
- [ ] Frontend-backend integration

### 📋 Planned (Phase 2-4)

- [ ] AI anomaly detection
- [ ] Predictive maintenance
- [ ] Workflow automation engine
- [ ] Visual workflow designer
- [ ] Natural language queries
- [ ] Mobile app
- [ ] Digital twins
- [ ] Enterprise integrations

---

## 🗃️ Database Setup

### Start Supabase

```bash
supabase start
```

### Apply Migrations

```bash
# Apply all migrations and seed data
supabase db reset

# Or apply migrations only
supabase migration up
```

### Access Supabase Studio

```
http://localhost:54323
```

**Demo Accounts:**
- `admin@demo-corp.com` - Tenant Admin
- `manager@demo-corp.com` - Department Manager
- `user@demo-corp.com` - End User

For detailed setup instructions, see [Database Setup Guide](docs/DATABASE_SETUP.md).

---

## 🔑 Environment Variables

Required environment variables (see [.env.example](.env.example)):

### Frontend
```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

### Backend
```bash
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
SUPABASE_SERVICE_KEY=your_service_key
OPENAI_API_KEY=sk-xxx
MQTT_BROKER_HOST=localhost
MQTT_BROKER_PORT=1883
```

---

## 🚀 Development

### Frontend Development

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend Development

```bash
cd backend
uvicorn main:app --reload --port 8000
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Run Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest
```

---

## 📚 Documentation

- **[Setup Instructions](docs/SETUP_INSTRUCTIONS.md)** - Getting started guide
- **[Database Setup](docs/DATABASE_SETUP.md)** - Complete database guide
- **[Requirements](docs/requirements.md)** - Full system requirements
- **[API Documentation](http://localhost:8000/docs)** - OpenAPI/Swagger docs

---

## 🏢 Project Status

### Current Phase: **Phase 1 - Foundation** ✅ Complete

- ✅ Database schema (30+ tables)
- ✅ TimescaleDB configuration
- ✅ Row-Level Security (RLS)
- ✅ RBAC with 6 roles
- ✅ Clerk integration functions
- ✅ Seed data with 5 devices
- ✅ Basic UI components

### Next Phase: **Phase 2 - Core Features** 🚧 In Progress

- 🚧 Device Management API
- 🚧 MQTT Integration
- 🚧 Data Ingestion Pipeline
- 📋 Frontend-Backend Integration
- 📋 Real-time Device Dashboard

### Progress Overview

```
Overall Progress: ████████░░░░░░░░░░░░ 40%

Phase 1 (Foundation):     ████████████████████ 100% ✅
Phase 2 (Core Features):  ████░░░░░░░░░░░░░░░░  20% 🚧
Phase 3 (AI & Automation): ░░░░░░░░░░░░░░░░░░░░   0% 📋
Phase 4 (Enterprise):     ░░░░░░░░░░░░░░░░░░░░   0% 📋
```

---

## 👥 Team Structure (Recommended)

For full implementation, recommended team:
- 1x Product Manager
- 1x Tech Lead
- 2x Backend Developers (Python/FastAPI)
- 2x Frontend Developers (React/Next.js)
- 1x DevOps Engineer
- 1x QA Engineer
- 1x UX/UI Designer

**Current:** Solo development / small team

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/your-org/iotlinker/issues)
- **Email:** support@iotlinker.com

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Database & Auth platform
- [Clerk](https://clerk.com) - Authentication
- [TimescaleDB](https://www.timescale.com) - Time-series database
- [FastAPI](https://fastapi.tiangolo.com) - Backend framework
- [Next.js](https://nextjs.org) - Frontend framework

---

**Built with ❤️ by the IoTLinker Team**

---

## 📊 Quick Stats

- **Lines of Code:** ~15,000+
- **Database Tables:** 30+
- **API Endpoints:** 15+ (planned: 100+)
- **Migrations:** 5
- **Demo Devices:** 5
- **Sensor Data Points:** 5,000+ (demo)
- **Supported Device Types:** 8
- **System Roles:** 6
- **Permissions:** 20+

---

Last Updated: December 13, 2024
