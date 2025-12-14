"use client";

import React, { useState, use } from "react";
import { ChannelDataChart } from "@/components/channels/ChannelDataChart";
import { Button } from "@/components/ui/Button";
import { ChannelInsights } from "@/components/channels/ChannelInsights";

interface ChannelPageProps {
  params: Promise<{ channelId: string }>;
}

export default function ChannelDashboard({ params }: ChannelPageProps) {
  // Await params in Next.js 15
  const resolvedParams = use(params);
  const [timeRange, setTimeRange] = useState("24h");

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Channel Dashboard: {resolvedParams.channelId}</h1>

      <div className="mb-4 flex space-x-2">
        {[
          { label: "1h", value: "1h" },
          { label: "24h", value: "24h" },
          { label: "7d", value: "7d" },
          { label: "30d", value: "30d" },
        ].map((range) => (
          <Button
            key={range.value}
            variant={timeRange === range.value ? "primary" : "secondary"}
            onClick={() => handleTimeRangeChange(range.value)}
          >
            {range.label}
          </Button>
        ))}
      </div>

      <ChannelDataChart channelId={resolvedParams.channelId} timeRange={timeRange} />

      <ChannelInsights channelId={resolvedParams.channelId} />
    </div>
  );
}
