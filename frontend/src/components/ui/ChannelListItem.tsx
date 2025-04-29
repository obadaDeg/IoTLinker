import Link from 'next/link';
import { Eye, Settings, Share2, Key } from 'lucide-react';
import { Channel } from '@/types/channel';

interface ChannelListItemProps {
  channel: Channel;
  isVisible: boolean;
  animationDelay: number;
}

export default function ChannelListItem({ channel, isVisible, animationDelay }: ChannelListItemProps) {
  return (
    <tr 
      className={`
        transition-all duration-300 
        hover:bg-gray-50
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      style={{ 
        transitionDelay: `${animationDelay * 50}ms`,
        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)'
      }}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">{channel.name}</div>
            <div className="text-sm text-gray-500">ID: {channel.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
          channel.access === 'Private' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {channel.access}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {channel.entries}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {channel.lastUpdate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <Link href={`/channels/${channel.id}`}>
            <span className="text-emerald-600 hover:text-emerald-900 transition-colors duration-200 transform hover:scale-110 inline-block">
              <Eye size={18} />
            </span>
          </Link>
          <Link href={`/channels/${channel.id}/settings`}>
            <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200 transform hover:scale-110 inline-block">
              <Settings size={18} />
            </span>
          </Link>
          <Link href={`/channels/${channel.id}/share`}>
            <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200 transform hover:scale-110 inline-block">
              <Share2 size={18} />
            </span>
          </Link>
          <Link href={`/channels/${channel.id}/api`}>
            <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200 transform hover:scale-110 inline-block">
              <Key size={18} />
            </span>
          </Link>
        </div>
      </td>
    </tr>
  );
}