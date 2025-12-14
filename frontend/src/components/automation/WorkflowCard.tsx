"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";

interface WorkflowCardProps {
  title: string;
  description: string;
  icon: string | React.ReactNode;
  color: string;
  n8nTemplateUrl?: string;
  onConnect: () => void;
}

export default function WorkflowCard({
  title,
  description,
  icon,
  color,
  n8nTemplateUrl,
  onConnect,
}: WorkflowCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group">
      <div className={`h-2 w-full ${color}`} />
      
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-lg ${color.replace('bg-', 'bg-').replace('500', '100')} dark:${color.replace('bg-', 'bg-').replace('500', '900')}/30`}>
            {typeof icon === 'string' ? (
                <span className="text-2xl">{icon}</span>
            ) : (
                <div className={`${color.replace('bg-', 'text-').replace('500', '600')} dark:${color.replace('bg-', 'text-').replace('500', '400')}`}>
                    {icon}
                </div>
            )}
          </div>
          {n8nTemplateUrl && (
             <a 
                href={n8nTemplateUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 text-slate-400 hover:text-indigo-500 transition-colors"
             >
                View Template <ExternalLink className="w-3 h-3" />
             </a>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
        </p>
      </div>

      <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
        <button 
            onClick={onConnect}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
        >
            Connect Workflow <ArrowRight className="w-4 h-4 ml-1 opacity-60 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
