"use client";

import { Settings, Save, Globe, Lock, Trash2, Plus } from "lucide-react";
import { useState } from "react";

export function SettingsView() {
  const [fields, setFields] = useState([
    { id: 1, name: "Temperature", enabled: true },
    { id: 2, name: "Humidity", enabled: true },
    { id: 3, name: "", enabled: false },
    { id: 4, name: "", enabled: false },
  ]);

  return (
    <div className="max-w-3xl animate-fade-in">
      {/* Settings Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
          <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Channel Settings</h2>
          <p className="text-slate-500 dark:text-slate-400">Configure your channel's properties and fields</p>
        </div>
      </div>

      <form className="space-y-8">
        {/* Basic Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Basic Information</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Channel Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                placeholder="e.g., Weather Station A"
                defaultValue="Weather Station A"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
                rows={3}
                placeholder="Describe what this channel monitors..."
                defaultValue="Monitoring temp and humidity in the backyard garden"
              />
            </div>
          </div>
        </div>

        {/* Fields Configuration Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Data Fields</h3>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded-full">
              Up to 8 fields
            </span>
          </div>
          <div className="p-6 space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  field.enabled
                    ? "border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-900/20"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 opacity-60"
                }`}
              >
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={field.enabled}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[index].enabled = !newFields[index].enabled;
                      setFields(newFields);
                    }}
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 w-16">
                  Field {field.id}
                </span>
                <input
                  type="text"
                  className={`flex-grow px-4 py-2.5 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow ${
                    field.enabled ? "border-slate-300 dark:border-slate-600" : "border-slate-200 dark:border-slate-700"
                  }`}
                  placeholder="Field name (e.g., Temperature)"
                  value={field.name}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].name = e.target.value;
                    setFields(newFields);
                  }}
                  disabled={!field.enabled}
                />
              </div>
            ))}
            <button
              type="button"
              className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" /> Add More Fields
            </button>
          </div>
        </div>

        {/* Visibility Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Visibility & Access</h3>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors cursor-pointer group">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Make Channel Public</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  When enabled, anyone can view this channel's data feeds and charts without authentication.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            className="text-red-600 dark:text-red-400 hover:text-red-700 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete Channel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 transition-all"
          >
            <Save className="w-5 h-5" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
