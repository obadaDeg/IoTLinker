"use client";

import { Upload, Download, FileSpreadsheet, Clock, CheckCircle, AlertCircle, ArrowUpRight } from "lucide-react";

export function DataImportExportView() {
  const recentExports = [
    { id: 1, filename: "channel_1_dec_10.csv", date: "Dec 10, 2024", status: "completed", size: "2.4 MB" },
    { id: 2, filename: "channel_1_dec_01.csv", date: "Dec 01, 2024", status: "completed", size: "1.8 MB" },
  ];

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-violet-100 dark:bg-violet-900/50 rounded-xl">
          <FileSpreadsheet className="w-6 h-6 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Data Import/Export</h2>
          <p className="text-slate-500 dark:text-slate-400">Bulk import or export your channel data</p>
        </div>
      </div>

      {/* Import/Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                <Download className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Export Data</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Download as CSV or JSON</p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
              Export all historical data from this channel. Select a date range and format to generate your export file.
            </p>
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">From</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">To</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Format</label>
                <select className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>CSV (Comma Separated)</option>
                  <option>JSON (JavaScript Object Notation)</option>
                  <option>XML (Extensible Markup Language)</option>
                </select>
              </div>
            </div>
            <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
              <Download className="w-5 h-5" /> Generate Export
            </button>
          </div>
        </div>

        {/* Import Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Import Data</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Upload CSV file</p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
              Import historical data or migrate from another platform. Upload a CSV file matching your channel's field structure.
            </p>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer group mb-6">
              <div className="inline-flex p-3 bg-slate-100 dark:bg-slate-700 rounded-full mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
              </div>
              <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Drag & drop your file here</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">or click to browse</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Supports CSV up to 50MB</p>
            </div>
            <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
              <Upload className="w-5 h-5" /> Upload & Import
            </button>
          </div>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            Recent Exports
          </h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {recentExports.map((exp) => (
            <div key={exp.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{exp.filename}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{exp.date} • {exp.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" /> Completed
                </span>
                <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
