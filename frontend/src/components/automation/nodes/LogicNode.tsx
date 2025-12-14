"use client";

import { Handle, Position } from '@xyflow/react';
import { GitMerge } from 'lucide-react';

export default function LogicNode({ data }: { data: { label: string } }) {
  return (
    <div className="bg-white dark:bg-slate-800 border-2 border-amber-500 rounded-lg p-3 min-w-[150px] shadow-md">
       <Handle type="target" position={Position.Left} className="!bg-slate-400 !w-3 !h-3" />
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded">
            <GitMerge className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Logic</span>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        {data.label}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-amber-500 !w-3 !h-3" />
    </div>
  );
}
