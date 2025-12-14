"use client";

import { Channel } from "@/types/channel";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useChannels } from "@/components/hooks/useChannels";
import { Plus, Lock, Globe, Settings, Activity, Clock, Database, ChevronRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Demo tenant ID
const TENANT_ID = '10000000-0000-0000-0000-000000000001';

// Mock sparkline data generator
const generateSparkData = () => Array.from({ length: 20 }, () => ({ val: Math.random() * 10 + 20 }));

export function MyChannels() {
  const { channels, loading, error } = useChannels({
    filters: {
      tenant_id: TENANT_ID,
      page: 1,
      page_size: 100,
    },
  });

  // Add sparkline data to channels
  const channelsWithSparkData = channels.map(channel => ({
    ...channel,
    sparkData: generateSparkData(),
  }));

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading channels...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">Error Loading Channels</h3>
          <p className="text-red-700 dark:text-red-300 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">My Channels</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Manage your IoT data streams. Create channels to collect, analyze, and visualize sensor data in real-time.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5">
          <Plus className="w-5 h-5 mr-2" />
          Create Channel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {channelsWithSparkData.map((channel) => (
          <div key={channel.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full card-hover">
            {/* Card Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/50">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        <Link href={`/channels/${channel.id}`} className="hover:underline decoration-indigo-300 dark:decoration-indigo-600 underline-offset-4">
                            {channel.icon || '📦'} {channel.name}
                        </Link>
                    </h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{channel.description || 'No description'}</p>
              </div>
              <div className="flex items-center space-x-1">
                 <Link href={`/channels/${channel.id}/settings`} className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                     <Settings className="w-5 h-5" />
                 </Link>
              </div>
            </div>

            {/* Card Body - Sparkline & Stats */}
            <div className="p-6 flex-grow space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center">
                            <Database className="w-3 h-3 mr-1.5" /> Total Devices
                        </p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{channel.device_count || 0}</p>
                    </div>
                     <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1.5" /> Online
                        </p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{channel.online_count || 0}</p>
                    </div>
                </div>

                <div className="h-16 w-full">
                     <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 flex items-center">
                        <Activity className="w-3 h-3 mr-1" /> Activity Trend
                     </p>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={channel.sparkData}>
                            <Line type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/50 flex justify-between items-center">
                <div className="flex gap-2 items-center text-xs text-slate-500 dark:text-slate-400">
                    <span>Created {new Date(channel.created_at).toLocaleDateString()}</span>
                </div>
                 <Link
                    href={`/channels/${channel.id}`}
                    className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center group-hover:translate-x-1 transition-transform"
                 >
                    View Dashboard <ChevronRight className="w-4 h-4 ml-1" />
                 </Link>
            </div>
          </div>
        ))}
        
        {/* New Channel Placeholder Card */}
        <button className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/10 dark:hover:bg-indigo-900/20 transition-all duration-300 h-full min-h-[300px] group">
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-1 text-slate-700 dark:text-slate-300">Create New Channel</h3>
            <p className="text-sm text-center max-w-xs text-slate-500 dark:text-slate-400">
                Start collecting data from your devices in less than a minute.
            </p>
        </button>
      </div>
    </div>
  );
}
