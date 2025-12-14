"use client";

import { Channel } from "@/types/channel";
import { Hash, User, Calendar } from "lucide-react";
import Link from "next/link";

interface ChannelHeaderProps {
  channel: Channel;
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border-b border-gray-200/60 dark:border-slate-700 p-8 rounded-t-xl shadow-sm mb-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Hash className="w-32 h-32 text-indigo-900 dark:text-indigo-400" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
            <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                     <Link href="/channels" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Channels</Link>
                     <span>/</span>
                     <span className="font-medium text-slate-700 dark:text-slate-300">{channel.id}</span>
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{channel.name}</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                    {channel.description}
                </p>
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400 pt-2">
                    <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                        By <span className="font-medium text-slate-700 dark:text-slate-300">{channel.created_by || 'Unknown'}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        Created: {channel.created_at ? channel.created_at.split('T')[0] : 'Unknown'}
                    </span>
                </div>
            </div>
            
             <div className="hidden md:flex flex-col items-end gap-2">
                <div className="text-right">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Channel ID</p>
                    <p className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100">{channel.id}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
