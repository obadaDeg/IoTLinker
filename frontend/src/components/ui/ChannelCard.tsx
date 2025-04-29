import Link from 'next/link';
import { Eye, Settings, Share2, Key } from 'lucide-react';
import { Channel } from '@/types/channel';

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg transition-all duration-300 hover:shadow-md hover:scale-102 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{channel.name}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            channel.access === 'Private' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {channel.access}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500 truncate">{channel.description}</p>
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {channel.tags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 transition-all hover:bg-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <div className="flex justify-between py-1">
            <span>Fields:</span>
            <span className="font-medium">{channel.fields}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Entries:</span>
            <span className="font-medium">{channel.entries}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Last update:</span>
            <span className="font-medium">{channel.lastUpdate}</span>
          </div>
        </div>
        <ChannelActions channelId={channel.id} />
      </div>
    </div>
  );
}

interface ChannelActionsProps {
  channelId: string;
}

function ChannelActions({ channelId }: ChannelActionsProps) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <Link href={`/channels/${channelId}`}>
        <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors duration-200 transform hover:scale-105">
          <Eye size={14} className="mr-1" /> View
        </span>
      </Link>
      <Link href={`/channels/${channelId}/settings`}>
        <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105">
          <Settings size={14} className="mr-1" /> Settings
        </span>
      </Link>
      <Link href={`/channels/${channelId}/share`}>
        <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105">
          <Share2 size={14} className="mr-1" /> Share
        </span>
      </Link>
      <Link href={`/channels/${channelId}/api`}>
        <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105">
          <Key size={14} className="mr-1" /> API
        </span>
      </Link>
    </div>
  );
}
