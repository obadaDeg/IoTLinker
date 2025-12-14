"use client";

import { Handle, Position } from '@xyflow/react';
import { Zap } from 'lucide-react';

export default function TriggerNode({ data }: { data: { label: string } }) {
  return (
    <div className="bg-white dark:bg-slate-800 border-2 border-emerald-500 rounded-lg p-3 min-w-[150px] shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Trigger</span>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        {data.label}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-emerald-500 !w-3 !h-3" />
    </div>
  );
}
