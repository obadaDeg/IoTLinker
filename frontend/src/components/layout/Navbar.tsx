'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavItem {
  name: string;
  href: string;
  active: boolean;
}

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([
    { name: 'Channels', href: '/', active: true },
    { name: 'Analytics', href: '/analytics', active: false },
    { name: 'Devices', href: '/devices', active: false },
    { name: 'Alerts', href: '/alerts', active: false },
  ]);
  
  // Animation on mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleNavItemClick = (clickedItemName: string) => {
    setNavItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        active: item.name === clickedItemName
      }))
    );
  };

  return (
    <nav className={`bg-white shadow-sm transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-emerald-600 transition-all duration-300 hover:text-emerald-800 transform hover:scale-105">
                IoTLinker
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:items-center">
              {navItems.map((item, index) => (
                <Link key={item.name} href={item.href}>
                  <span 
                    onClick={() => handleNavItemClick(item.name)}
                    className={`
                      ${item.active 
                        ? 'border-emerald-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } 
                      inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                      transition-all duration-300 ease-in-out
                      hover:transform hover:translate-y-1
                      ${mounted ? 'translate-y-0' : 'translate-y-4'}
                      transition-delay-${index * 100}
                    `}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <button className="bg-emerald-600 p-1 rounded-full text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:rotate-12 hover:scale-110">
              <Bell size={20} />
            </button>
            <div className="ml-3 relative">
              <div>
                <button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform duration-300 transform hover:scale-110">
                  <Image
                    className="h-8 w-8 rounded-full"
                    src="/placeholder.png"
                    alt="User profile"
                    width={32}
                    height={32}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}