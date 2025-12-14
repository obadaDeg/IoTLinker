"use client";

import { useState } from "react";
import { Channel } from "@/types/channel";
import { ChannelHeader } from "./details/ChannelHeader";
import { ChannelTabs } from "./details/ChannelTabs";
import { PrivateView } from "./details/PrivateView";
import { PublicView } from "./details/PublicView";
import { ApiKeysView } from "./details/ApiKeysView";
import { SettingsView } from "./details/SettingsView";
import { DataImportExportView } from "./details/DataImportExportView";
import { Eye, EyeOff, Settings, Key, FileSpreadsheet } from "lucide-react";

interface ChannelDetailsProps {
  channel: Channel;
}

export function ChannelDetails({ channel }: ChannelDetailsProps) {
  const [activeTab, setActiveTab] = useState("private");

  const tabs = [
    { id: "private", label: "Private View", icon: EyeOff },
    { id: "public", label: "Public View", icon: Eye },
    { id: "settings", label: "Channel Settings", icon: Settings },
    { id: "apikeys", label: "API Keys", icon: Key },
    { id: "import", label: "Data Import/Export", icon: FileSpreadsheet },
  ];

  return (
    <div className="animate-fade-in">
      <ChannelHeader channel={channel} />
      <ChannelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mt-6">
        {activeTab === "private" && <PrivateView />}
        {activeTab === "public" && <PublicView />}
        {activeTab === "settings" && <SettingsView />}
        {activeTab === "apikeys" && <ApiKeysView />}
        {activeTab === "import" && <DataImportExportView />}
      </div>
    </div>
  );
}
