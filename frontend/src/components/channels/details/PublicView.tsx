"use client";

import { Globe, Lock, Eye, ExternalLink, Share2, Code } from "lucide-react";

export function PublicView() {
  const isPublic = false;

  if (!isPublic) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 animate-fade-in">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 mb-8">
          <div className="inline-flex p-4 bg-amber-100 dark:bg-amber-900/50 rounded-full mb-6">
            <Lock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            This Channel is Private
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Public viewers cannot access this channel's data. To share your channel publicly, enable the "Make Public" option in Channel Settings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
            <Globe className="w-5 h-5" />
            Make Public Now
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Eye className="w-5 h-5" />
            Preview Public View
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
          <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Public View</h2>
          <p className="text-slate-500 dark:text-slate-400">This is how your channel appears to the public</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Share Your Channel
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Public URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="https://iotlinker.com/channels/public/1"
                className="flex-grow px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm font-mono text-slate-700 dark:text-slate-300"
              />
              <button className="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          Embed Chart
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Copy this code to embed a live chart on your website:
        </p>
        <code className="block bg-slate-900 text-emerald-400 p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre">
{`<iframe 
  src="https://iotlinker.com/embed/1/field/1"
  width="450" 
  height="260"
></iframe>`}
        </code>
      </div>
    </div>
  );
}
