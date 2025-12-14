"use client";

import { Copy, RefreshCw, Key, Plus, Check, Shield, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function ApiKeysView() {
  const [copied, setCopied] = useState<string | null>(null);
  const [showWriteKey, setShowWriteKey] = useState(false);

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
          <Key className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">API Keys</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage access credentials for this channel</p>
        </div>
      </div>

      {/* Write API Key Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Write API Key</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Use this key to send data to this channel</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-grow relative">
              <input
                type={showWriteKey ? "text" : "password"}
                readOnly
                value="ABC123XYZ456-WRITE-KEY-SECRET"
                className="w-full px-4 py-3 pr-20 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-lg font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
              />
              <button
                onClick={() => setShowWriteKey(!showWriteKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showWriteKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button
              onClick={() => handleCopy("ABC123XYZ456-WRITE-KEY-SECRET", "write")}
              className={`p-3 rounded-lg border transition-all ${
                copied === "write"
                  ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
                  : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
              title="Copy"
            >
              {copied === "write" ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Last regenerated: <span className="font-medium text-slate-600 dark:text-slate-300">December 10, 2024</span>
            </p>
            <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <RefreshCw className="w-4 h-4" /> Regenerate Key
            </button>
          </div>
        </div>
      </div>

      {/* Read API Keys Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 dark:bg-sky-900/50 rounded-lg">
              <Eye className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Read API Keys</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Allow others to read this channel's data</p>
            </div>
          </div>
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded-full">
            1 Active Key
          </span>
        </div>
        <div className="p-6 space-y-4">
          {/* Existing Read Key */}
          <div className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50">
            <div className="flex-grow">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Key #1 (Created Dec 1, 2024)</p>
              <code className="text-lg font-mono text-slate-800 dark:text-slate-200">READ987KEY654</code>
            </div>
            <button
              onClick={() => handleCopy("READ987KEY654", "read1")}
              className={`p-3 rounded-lg border transition-all ${
                copied === "read1"
                  ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
                  : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
              title="Copy"
            >
              {copied === "read1" ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* Add New Read Key Button */}
          <button className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 font-medium">
            <Plus className="w-4 h-4" /> Generate New Read Key
          </button>
        </div>
      </div>

      {/* API Usage Section */}
      <div className="bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 dark:from-indigo-900/20 dark:via-violet-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 p-6">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
          <span className="text-xl">💡</span> Quick Tip: Sending Data
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Use the following endpoint to write sensor data to this channel:
        </p>
        <code className="block bg-slate-900 text-emerald-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
          POST https://api.iotlinker.com/update?api_key=YOUR_WRITE_KEY&field1=VALUE
        </code>
      </div>
    </div>
  );
}
