"use client";

import { useState, use } from "react";
import { AlertConfigForm } from "@/components/alerts/AlertConfigForm";

interface Alert {
  threshold: number;
  condition: string;
  notificationType: string;
  isActive: boolean;
}

export default function AlertsPage({ params }: { params: Promise<{ channelId: string }> }) {
  const resolvedParams = use(params);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const handleAddAlert = (newAlert: Alert) => {
    // Simulate adding the alert to the backend
    setAlerts((prev) => [...prev, newAlert]);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Alerts for Channel {resolvedParams.channelId}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Alert</h2>
        <AlertConfigForm onSubmit={handleAddAlert} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Alerts</h2>
        {alerts.length === 0 ? (
          <p>No alerts configured yet.</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert, index) => (
              <li key={index} className="p-4 border rounded-md shadow-sm">
                <p><strong>Threshold:</strong> {alert.threshold}</p>
                <p><strong>Condition:</strong> {alert.condition}</p>
                <p><strong>Notification Type:</strong> {alert.notificationType}</p>
                <p><strong>Active:</strong> {alert.isActive ? "Yes" : "No"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}