# Visual Logic Builder - Technical Design

## 1. Overview
The **Visual Logic Builder** is a low-code "drag-and-drop" rules engine embedded within IoTLinker. It allows users to create complex automation flows without writing code. This is our "Killer Feature" against ThingSpeak's simple React applications.

**Inspiration**: n8n, Node-RED, Unreal Engine Blueprints.

---

## 2. Architecture

### Frontend (The Canvas)
*   **Library**: `React Flow` (or `@xyflow/react`). It is the industry standard for React-based graph editors.
*   **State Management**: `Zustand` for local graph state (position, connections).
*   **UX**:
    *   **Sidebar**: Draggable nodes (Triggers, Logic, Actions).
    *   **Canvas**: Infinite grid for connecting nodes.
    *   **Mini-Map**: Navigation for large flows.
    *   **Properties Panel**: Click a node to configure parameters (e.g., Threshold value, Email address).

### Backend (The Execution Engine)
*   **Event Bus**: Redis Streams or RabbitMQ.
*   **Worker**: A dedicated Python worker (Celery or Dramatiq) that interprets the JSON graph.
*   **Execution Model**:
    1.  Ingestion API receives data -> Pushes event `device.telemetry`.
    2.  Rule Engine matches event to active Flows.
    3.  Engine traverses the JSON graph (DAG - Directed Acyclic Graph).
    4.  Executes nodes sequentially or in parallel.

---

## 3. Node Types

### 🟢 Triggers (The "When")
| Node | Description | Config Parameters |
|------|-------------|-------------------|
| **Device Data** | Fires when specific channel receives data. | `Channel ID`, `Field Name` |
| **Schedule** | Fires at fixed intervals (cron). | `Cron Expression` (e.g., "Every Friday at 5pm") |
| **Webhook** | Fires when an external URL is hit. | `Secret Token`, `HTTP Method` |
| **Device Status** | Fires on connect/disconnect (LWT). | `Channel ID`, `Event` (Online/Offline) |

### 🟡 Logic (The "If/Then")
| Node | Description | Config Parameters |
|------|-------------|-------------------|
| **Filter / If** | Continues only if condition is true. | `Input Value` > `Threshold` |
| **Debounce** | Prevents rapid-fire firing (e.g., bouncing switch). | `Time Window` (e.g., 5 seconds) |
| **Identify Change** | Fires only if value changed vs last time. | `Delta` (Min change amount) |
| **Aggregate** | Averages data over a time window. | `Function` (Avg/Min/Max), `Window` (10m) |

### 🔴 Actions (The "Do")
| Node | Description | Config Parameters |
|------|-------------|-------------------|
| **Send Email** | Sends an alert email. | `To`, `Subject`, `Body` (Template support) |
| **Update Device** | Sends a command back to a device (MQTT). | `Topic`, `Payload` |
| **Webhook Call** | Calls an external API (Slack, Discord). | `URL`, `Method`, `JSON Body` |
| **Create Incient**| Logs a system alert/incident. | `Severity`, `Message` |

---

## 4. User Experience Example: "The Freezing Pipe Protector"

**Goal**: Turn on a heater if the pipe temperature drops below 2°C, but only if it's nighttime.

**The Flow:**
1.  **[Trigger: Device Data]**: Listens to `Temp_Sensor_01` (Field: Temperature).
2.  **[Logic: If]**: Condition `value < 2.0`.
3.  **[Logic: Time Check]**: Condition `Time is between 20:00 AND 06:00`.
4.  **[Action: Webhook]**: POST to Smart Plug API (`turn_on`).
5.  **[Action: Email]**: Send "Heater Activated" to owner.

---

## 5. Technical Stack Implementation Plan

### Phase 1: MVP (Hardcoded Rules)
*   Build the `React Flow` UI to save a JSON configuration.
*   Backend just runs a simple check on incoming data against this JSON.

### Phase 2: The "Flow Runner"
*   Implement a proper traversal engine in Python.
*   Support state (e.g., "Wait for X").

### Data Structure (JSON spec)
```json
{
  "nodes": [
    { "id": "1", "type": "triggerDevice", "data": { "channel": "abc" }, "position": { "x": 0, "y": 0 } },
    { "id": "2", "type": "logicIf", "data": { "operator": "lt", "value": 2 }, "position": { "x": 200, "y": 0 } }
  ],
  "edges": [
    { "source": "1", "target": "2", "id": "e1-2" }
  ]
}
```
