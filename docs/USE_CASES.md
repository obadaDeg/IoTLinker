# IoTLinker - Product Vision, Use Cases & User Stories

## 1. Product Vision & Differentiation
**Goal**: To build the "Linear of IoT platforms"—a high-performance, aesthetically stunning, and developer-friendly alternative to ThingSpeak.

### Core Differentiators (The "Secret Sauce")
1.  **Ui/UX First**: deeply polished, dark-mode native interface using modern React patterns (Shadcn/Tailwind), contrasting with ThingSpeak's utilitarian look.
2.  **"Smart" Anomaly Detection**: Instead of just static thresholds (if > 50), implement "Deviation Alerts" (e.g., "Value is 30% higher than typical for this time of day").
3.  **Visual Logic Flow**: A built-in drag-and-drop rule builder (like a mini-n8n embedded) for triggers, rather than just simple "If X > Y then Email".
4.  **Device Twins & State Management**: Native support for "Device Shadow/Twin" states (desired vs. reported) which ThingSpeak lacks (it focuses mostly on time-series telemetry).

---

## 2. User Personas & Use Cases

### A. The "Smart Home" Hobbyist (Alex)
*Context*: Tech-savvy, uses ESP32/Home Assistant, wants pretty dashboards on an iPad on the wall.
*   **Use Case: Hydroponic Garden Monitor**
    *   **Inputs**: EC (Electrical Conductivity), pH, Water Temp, ambient light.
    *   **Goal**: Ensure plants don't die while Alex is on vacation.
    *   **Pain Point**: ThingSpeak charts look ugly on a wall tablet; setting up alerts requires external services.

### B. The STEM Student/Educator (Sarah)
*Context*: High school physics teacher or University engineering student.
*   **Use Case: Physics Lab Data Logger**
    *   **Inputs**: Accelerometer data, Voltage readings from custom circuits.
    *   **Goal**: Collect high-frequency data (10-50Hz) and export to CSV/Matlab for analysis.
    *   **Pain Point**: Needs easy setup (QR Code -> Data) without complex authentication/provisioning.

### C. The Industrial Operations Manager (Marcus)
*Context*: Manages a fleet of refrigerated delivery trucks or server rooms.
*   **Use Case: Cold Chain Compliance**
    *   **Inputs**: Temperature every 5 minutes, Door Open/Close events, GPS location.
    *   **Goal**: Receive immediate SMS if temperature exceeds 4°C for > 20 mins. Proof of compliance report PDF at end of month.
    *   **Pain Point**: Needs "Tenant/Organization" views to share distinct dashboards with different clients without sharing login credentials.

---

## 3. Comprehensive User Stories

### 🌐 Data Ingestion & Device Connectivity

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| **ING-1** | **As a** Hobbyist, **I want** to push data via a simple HTTP GET request (like `api_key=XYZ&field1=20`), **so that** I can use very low-power/limited devices like ESP8266 or Arduino with ease. | - Supports GET/POST params.<br>- Returns HTTP 200 OK.<br>- Updates "Last Seen" timestamp. |
| **ING-2** | **As an** Industrial Dev, **I want** to connect via MQTT over TLS, **so that** I maintain a persistent, secure, low-bandwidth connection for real-time signaling. | - MQTT Broker endpoint available.<br>- Supports Pub/Sub topics `channels/{id}/publish`. |
| **ING-3** | **As a** User, **I want** to bulk-import a CSV of historical data, **so that** I can migrate my old data from ThingSpeak/Excel. | - CSV mapping tool UI.<br>- Validates timestamps and types. |

### 📊 Visualization & Dashboards

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| **VIS-1** | **As a** User, **I want** responsive, drag-and-drop widgets (Line Chart, Gauge, Number Display, Map), **so that** I can build a custom layout for my specific needs. | - Grid-based layout system.<br>- Widgets serve real-time updates via WebSocket. |
| **VIS-2** | **As a** Manager, **I want** "Status Indicators" (Red/Green/Yellow traffic lights), **so that** I can see system health at a glance without reading graph numbers. | - Configurable thresholds for colors.<br>- Blinking animation for critical alerts. |
| **VIS-3** | **As a** Student, **I want** to overlay two different fields (e.g., Temp vs Humidity) on the same time-series chart, **so that** I can find correlations. | - Multi-axis Y-chart support. |

### ⚡ Triggers & Automation

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| **TRG-1** | **As a** User, **I want** to define "Deadman Switches" (Alert if NO data received for X minutes), **so that** I know if a device has power-cycled or lost WiFi. | - Server-side cron checker.<br>- Configurable timeout duration. |
| **TRG-2** | **As a** Developer, **I want** outgoing Webhooks when a threshold is breached, **so that** I can trigger a workflow in n8n/Zapier (e.g., turn on a fan). | - HTTP POST with JSON payload.<br>- Retry logic on failure. |
| **TRG-3** | **As a** User, **I want** Rate-of-Change alerts (e.g., "Temp dropping > 5° in 1 minute"), **so that** I detect sudden failures (like a broken pipe) faster than absolute thresholds. | - Sliding window calculation. |

### 🔒 Security & Management

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| **SEC-1** | **As an** Admin, **I want** API Tokens with scoped permissions (Write-Only vs Read-Only), **so that** if a device is stolen, the thief cannot read my other data or delete channels. | - Granular scopes (channel:write, channel:read).<br>- Ability to revoke keys instantly. |
| **SEC-2** | **As a** Team Lead, **I want** to invite members to my "Organization", **so that** we can collaborate on the same dashboards. | - Role-Based Access Control (Admin vs Viewer). |
