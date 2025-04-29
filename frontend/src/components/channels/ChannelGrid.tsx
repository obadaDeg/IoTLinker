import ChannelCard from '../ui/ChannelCard';
import { Channel } from '@/types/channel';
import { useEffect, useState } from 'react';

interface ChannelGridProps {
  channels: Channel[];
}

export default function ChannelGrid({ channels }: ChannelGridProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {channels.map((channel, index) => (
        <div 
          key={channel.id}
          className={`transform transition-all duration-500 ease-out ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <ChannelCard channel={channel} />
        </div>
      ))}
    </div>
  );
}