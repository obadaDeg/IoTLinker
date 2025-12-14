"use client";

import { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface ChannelTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function ChannelTabs({ tabs, activeTab, onTabChange }: ChannelTabsProps) {
  return (
    <div className="border-b border-slate-200/60 dark:border-slate-700 mb-8 overflow-x-auto">
      <nav className="-mb-px flex space-x-1" aria-label="Tabs">
        {tabs.map((tab) => {
           const isActive = activeTab === tab.id;
           const Icon = tab.icon;
           return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                whitespace-nowrap py-3.5 px-4 rounded-t-lg font-medium text-sm transition-all flex items-center gap-2
                ${isActive
                  ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-b-white dark:border-b-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm -mb-px"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-700/50"
                }
              `}
            >
              {Icon && <Icon className={`w-4 h-4 ${isActive ? "text-indigo-500 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`} />}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  );
}
