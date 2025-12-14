"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Download, Calendar, ArrowUpRight, Activity } from 'lucide-react';

const MOCK_DATA = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: Math.floor(Math.random() * 10) + 20,
  humidity: Math.floor(Math.random() * 20) + 40,
}));

export function PrivateView() {
  const fields = [
    { id: 1, name: "Temperature", color: "#6366f1", unit: "°C" },
    { id: 2, name: "Humidity", color: "#0ea5e9", unit: "%" }
  ];

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Live Data Feeds
            </h2>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                    <Calendar className="w-4 h-4" />
                    Last 24h
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
                <div>
                     <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{field.name} (Field {field.id})</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400">Real-time sensor data</p>
                </div>
                 <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg border border-slate-100 dark:border-slate-600">
                    <ArrowUpRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                 </div>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_DATA}>
                  <defs>
                    <linearGradient id={`gradient-${field.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={field.color} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={field.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'currentColor', fontSize: 12}} 
                    className="text-slate-500 dark:text-slate-400"
                    interval={3}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'currentColor', fontSize: 12}}
                    className="text-slate-500 dark:text-slate-400"
                    unit={field.unit}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'var(--card)',
                      color: 'var(--card-foreground)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={field.id === 1 ? "value" : "humidity"} 
                    stroke={field.color} 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill={`url(#gradient-${field.id})`} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
