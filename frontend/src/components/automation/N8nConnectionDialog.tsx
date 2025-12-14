"use client";

import { useState } from "react";
import { Copy, Check, Info, Save, Link as LinkIcon, AlertTriangle, Trash2, Plus, ArrowLeft, Plug } from "lucide-react";
import { Channel } from "@/types/channel";
import { useChannels } from "@/components/hooks/useChannels";
import { apiClient } from "@/lib/api";

const TEMPLATE_TENANT_ID = "10000000-0000-0000-0000-000000000001"; // Should be from context

export default function N8nConnectionDialog() {
  const [view, setView] = useState<'list' | 'form'>('list');
  
  // Form State
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { channels, loading, refetch: mutate } = useChannels({
    filters: {
        tenant_id: TEMPLATE_TENANT_ID,
        page: 1,
        page_size: 100
    }
  });

  // Derived state: Active Integrations
  const activeIntegrations = channels ? channels.filter(c => c.metadata?.n8n_webhook) : [];

  const handleEdit = (channel: Channel) => {
      setSelectedChannelId(channel.id);
      setWebhookUrl(channel.metadata?.n8n_webhook || "");
      setView('form');
  };

  const handleAddNew = () => {
      setSelectedChannelId("");
      setWebhookUrl("");
      setView('form');
  };

  const handleDelete = async (channelId: string) => {
      if (!confirm("Are you sure you want to disconnect this channel?")) return;
      
      const channel = channels.find(c => c.id === channelId);
      if (!channel) return;

      const updatedMetadata = { ...channel.metadata };
      delete updatedMetadata.n8n_webhook;

      try {
        await apiClient.put(`/api/v1/channels/${channelId}?tenant_id=${TEMPLATE_TENANT_ID}`, {
            metadata: updatedMetadata
        });
        mutate(); // Refresh list
      } catch (e) {
          console.error("Failed to disconnect", e);
          alert("Failed to disconnect channel");
      }
  };

  const handleSave = async () => {
    if (!selectedChannelId) return;
    
    setIsSaving(true);
    setSaveStatus('idle');

    try {
        const channel = channels.find(c => c.id === selectedChannelId);
        if (!channel) throw new Error("Channel not found");

        const updatedMetadata = {
            ...channel.metadata,
            n8n_webhook: webhookUrl
        };

        await apiClient.put(`/api/v1/channels/${selectedChannelId}?tenant_id=${TEMPLATE_TENANT_ID}`, {
            metadata: updatedMetadata
        });

        setSaveStatus('success');
        mutate(); // Refresh list
        
        setTimeout(() => {
            setSaveStatus('idle');
            setView('list'); // Go back to list on success
        }, 1000);

    } catch (error) {
        console.error("Failed to save webhook", error);
        setSaveStatus('error');
    } finally {
        setIsSaving(false);
    }
  };

  // --- Render List View ---
  if (view === 'list') {
      return (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 transition-all">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Plug className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Active Integrations</h3>
                        <p className="text-slate-500 text-sm">Manage your n8n connections</p>
                    </div>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Connection
                </button>
            </div>

            {activeIntegrations.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                    <p className="text-slate-500 mb-2">No active integrations found.</p>
                    <button onClick={handleAddNew} className="text-indigo-600 font-medium hover:underline">
                        Create your first one
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {activeIntegrations.map(channel => (
                        <div key={channel.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">{channel.name}</h4>
                                <p className="text-xs text-slate-500 font-mono truncate max-w-[300px]">
                                    {channel.metadata?.n8n_webhook}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Active
                                </span>
                                <button 
                                    onClick={() => handleEdit(channel)}
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                                    title="Edit"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(channel.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                                    title="Disconnect"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      );
  }

  // --- Render Form View ---
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 transition-all">
      <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setView('list')} className="text-slate-400 hover:text-slate-600">
              <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {selectedChannelId && activeIntegrations.some(c => c.id === selectedChannelId) ? 'Edit Connection' : 'New Connection'}
          </h3>
      </div>

      <div className="space-y-4">
        {/* Channel Selector */}
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Select Channel
            </label>
            <select 
                value={selectedChannelId}
                onChange={(e) => setSelectedChannelId(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
            >
                <option value="">-- Choose a Channel --</option>
                {channels.map((c: Channel) => (
                    <option key={c.id} value={c.id}>
                        {c.name} {c.metadata?.n8n_webhook ? '(Connected)' : ''}
                    </option>
                ))}
            </select>
        </div>

        {/* Webhook URL Input */}
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                n8n Webhook URL (POST)
            </label>
            <div className="flex items-center gap-2">
                <input 
                    type="url" 
                    placeholder="https://your-n8n.com/webhook/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={!selectedChannelId}
                />
            </div>
        </div>
      </div>

      {/* Save Button & Status */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-500 flex items-center gap-1">
            {saveStatus === 'success' && <span className="text-emerald-600 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Saved!</span>}
            {saveStatus === 'error' && <span className="text-rose-600 font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Failed to save</span>}
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setView('list')}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
                Cancel
            </button>
            <button 
                onClick={handleSave}
                disabled={!selectedChannelId || isSaving}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${!selectedChannelId 
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
                    }
                `}
            >
                {isSaving ? "Saving..." : "Save Connection"}
            </button>
        </div>
      </div>
    </div>
  );
}
