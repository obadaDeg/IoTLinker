'use client';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ChannelHeaderProps {
  onNewChannel?: () => void;
}

export default function ChannelHeader({ onNewChannel }: ChannelHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div 
      className={`px-4 py-5 sm:px-6 bg-white shadow-sm rounded-lg mb-6 transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
      }`}
    >
      <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Channels</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor your IoT data channels
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={onNewChannel}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <Plus 
              size={16} 
              className={`mr-2 transition-transform duration-300 ${isHovered ? 'rotate-90' : 'rotate-0'}`} 
            />
            <span className="transition-all duration-300">New Channel</span>
          </button>
        </div>
      </div>
    </div>
  );
}