"use client";

import { Handle, Position } from '@xyflow/react';
import { Mail } from 'lucide-react';

export default function ActionNode({ data }: { data: { label: string } }) {
  return (
    <div className="bg-white dark:bg-slate-800 border-2 border-rose-500 rounded-lg p-3 min-w-[150px] shadow-md">
      <Handle type="target" position={Position.Left} className="!bg-slate-400 !w-3 !h-3" />
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded">
            <Mail className="w-4 h-4 text-rose-600 dark:text-rose-400" />
        </div>
        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Action</span>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        {data.label}
      </div>
    </div>
  );
}
