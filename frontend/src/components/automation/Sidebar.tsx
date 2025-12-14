"use client";

import React from 'react';

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-4 flex flex-col gap-6 overflow-y-auto">
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Triggers</h3>
        <div className="space-y-2">
          <div 
            className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm cursor-grab hover:border-indigo-500 transition-colors flex items-center gap-2"
            onDragStart={(event) => onDragStart(event, 'triggerDevice', 'Device Data')}
            draggable
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Device Data</span>
          </div>
          <div 
            className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm cursor-grab hover:border-indigo-500 transition-colors flex items-center gap-2"
            onDragStart={(event) => onDragStart(event, 'triggerSchedule', 'Schedule')}
            draggable
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Schedule</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Logic</h3>
        <div className="space-y-2">
          <div 
            className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm cursor-grab hover:border-amber-500 transition-colors flex items-center gap-2"
            onDragStart={(event) => onDragStart(event, 'logicIf', 'If / Else')}
            draggable
          >
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">If / Else</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Actions</h3>
        <div className="space-y-2">
          <div 
            className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm cursor-grab hover:border-rose-500 transition-colors flex items-center gap-2"
            onDragStart={(event) => onDragStart(event, 'actionEmail', 'Send Email')}
            draggable
          >
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Send Email</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
