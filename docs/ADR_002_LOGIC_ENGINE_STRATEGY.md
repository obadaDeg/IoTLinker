# ADR 002: Automation Strategy - Build vs. Integrate n8n

## Context
We need to decide how to implement the automation/logic layer for IoTLinker. The initial plan was to build a custom "Visual Logic Builder" using React Flow. The alternative is to recommend or integrate an existing solution like n8n.

## Comparison

### Option A: Build Custom (React Flow)
**Concept**: A "Lite" logic builder embedded directly in the dashboard.
*   **✅ Pros**:
    *   **Native UX**: "Device" node has a dropdown of *your* actual devices. No copying API keys or IDs.
    *   **Simplicity**: We curate the nodes. No overwhelming generic options.
    *   **Commercial Control**: We own the IP. No licensing issues (n8n is fair-code, which has restrictions).
    *   **Performance**: Optimized purely for our specific IoT event loop.
*   **❌ Cons**:
    *   **High Effort**: We must build the execution engine, UI, and every single node type (Email, Slack, SMS) ourselves.
    *   **Limited Features**: We will never match n8n's 500+ integrations.

### Option B: Integrate n8n
**Concept**: Run an n8n instance alongside the app and frame it in, or just push data to it via Webhooks.
*   **✅ Pros**:
    *   **Instant Power**: Out-of-the-box support for Slack, Google Sheets, Twilio, OpenAI, etc.
    *   **Zero Engine Maintenance**: n8n handles the complex directed-graph execution.
*   **❌ Cons**:
    *   **UX Friction**: The "Device" node in n8n doesn't know about your IoTLinker devices. User must copy/paste IDs manually.
    *   **Licensing**: n8n's license may require payment if you offer it as a SaaS feature to customers.
    *   **Overkill**: A simple "Alert me if temp > 50" is 5 clicks in a custom UI, but a whole project setup in n8n.

## Recommendation: The Hybrid "Crawl, Walk, Run"
1.  **Crawl (Native "Simple Actions")**: Keep building the **Simple Logic Builder** (what we started) but limit scope. Just "Trigger -> Threshold -> Alert". This covers 80% of IoT use cases.
2.  **Walk (Webhook Output)**: Add a "Webhook" action node. This allows Power Users to send data to n8n/Zapier for the complex stuff (Slack/Jira/Salesforce).
3.  **Run (Full n8n Node)**: Later, we build an official *IoTLinker Node* for n8n so users can easily consume our API there.

## Decision
**Proposal**: Continue with the React Flow builder for **basic** logic (essential for the product's "differentiation" and UX), but explicitly design it to "offload" complex tasks via Webhooks to n8n.
