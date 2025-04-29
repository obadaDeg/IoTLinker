"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ChannelInsightsProps {
  channelId: string;
}

export function ChannelInsights({ channelId }: ChannelInsightsProps) {
  const [insights, setInsights] = useState<{ summary: string; anomalies: number[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/insights/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel_id: channelId, data: [10, 20, 150, 30, 200] }), // Example data
      });

      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }

      const data = await response.json();
      setInsights(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">AI-Powered Insights</h2>
      <Button onClick={fetchInsights} disabled={loading} className="mb-4">
        {loading ? "Generating Insights..." : "Generate Insights"}
      </Button>

      {error && <p className="text-red-500">{error}</p>}

      {insights && (
        <div className="p-4 border rounded-md shadow-sm">
          <h3 className="text-lg font-bold">Summary</h3>
          <p>{insights.summary}</p>

          <h3 className="text-lg font-bold mt-4">Anomalies</h3>
          <ul className="list-disc pl-5">
            {insights.anomalies.map((anomaly, index) => (
              <li key={index}>{anomaly}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}