"use client";

import { useState } from 'react';
import WorkflowCard from '@/components/automation/WorkflowCard';
import N8nConnectionDialog from '@/components/automation/N8nConnectionDialog';
import { Sheet, Table2, MessageSquare, Mail, Zap, Database } from "lucide-react";

export default function AutomationPage() {
  const [showWebhookGen, setShowWebhookGen] = useState(false);

  const workflows = [
    {
      id: 'gsheets',
      title: "Log to Google Sheets",
      description: "Automatically append new device data rows to a Google Sheet for analysis.",
      icon: <Table2 className="w-8 h-8" />,
      color: "bg-emerald-500",
      n8nTemplateUrl: "https://n8n.io/workflows/1536-log-iot-data-to-google-sheets",
    },
    {
      id: 'discord',
      title: "Discord Alerts",
      description: "Send a message to a Discord channel when specific thresholds are breached.",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "bg-indigo-500",
      n8nTemplateUrl: "https://n8n.io/workflows/1560-send-discord-notifications",
    },
    {
      id: 'email',
      title: "Email Digest",
      description: "Send a daily summary email of your device's performance metrics.",
      icon: <Mail className="w-8 h-8" />,
      color: "bg-rose-500",
      n8nTemplateUrl: "https://n8n.io/workflows/1200-send-email",
    },
    {
      id: 'db',
      title: "Sync to PostgreSQL",
      description: "Backup your raw telemetry data to an external PostgreSQL database.",
      icon: <Database className="w-8 h-8" />,
      color: "bg-blue-500",
      n8nTemplateUrl: "https://n8n.io/workflows/1100-postgresql-sync",
    },
    {
        id: 'openai',
        title: "AI Analysis",
        description: "Analyze sensor trends using OpenAI GPT-4 to detect anomalies.",
        icon: <Zap className="w-8 h-8" />,
        color: "bg-amber-500",
        n8nTemplateUrl: "https://n8n.io/workflows/1900-ai-iot-analysis",
      },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Workflow Hub</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Power up your IoT devices by connecting them to 500+ apps via n8n.
          </p>
        </div>
        <button 
            onClick={() => setShowWebhookGen(!showWebhookGen)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5"
        >
          <Zap className="w-4 h-4 mr-2" />
          {showWebhookGen ? 'Hide Configuration' : 'Configure Integration'}
        </button>
      </div>

      {/* Webhook Generator Section */}
      {showWebhookGen && (
        <div className="animate-fade-in-down">
            <N8nConnectionDialog />
        </div>
      )}

      {/* Templates Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Popular Workflows
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((wf) => (
            <WorkflowCard
                key={wf.id}
                title={wf.title}
                description={wf.description}
                icon={wf.icon}
                color={wf.color}
                n8nTemplateUrl={wf.n8nTemplateUrl}
                onConnect={() => setShowWebhookGen(true)}
            />
            ))}
        </div>
      </div>
    </div>
  );
}
