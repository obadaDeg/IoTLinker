"use client";

import { useState } from "react";
import { Copy, Check, Info } from "lucide-react";

export default function WebhookGenerator() {
  const [webhookUrl, setWebhookUrl] = useState("https://iotlinker.app/api/v1/webhooks/trigger/wh_123456789");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg shrink-0">
            <Info className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-grow space-y-4">
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Configure n8n Webhook</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    To trigger an n8n workflow from IoTLinker, create a "Webhook" node in n8n and paste this URL into the "Production URL" field.
                </p>
            </div>

            <div className="relative group">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Your Unique Trigger URL
                </label>
                <div className="flex items-center gap-2">
                    <input 
                        type="text" 
                        readOnly 
                        value={webhookUrl}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button 
                        onClick={handleCopy}
                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    <span className="font-semibold text-amber-600 dark:text-amber-500">Note:</span> Keep this URL secret. Anyone with this URL can trigger your automation.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
