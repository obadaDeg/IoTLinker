'use client';
import { ChangeEvent, useState, useEffect } from 'react';
import SearchBar from '../ui/SearchBar';
import ViewToggle from '../ui/ViewToggle';
import { ViewMode } from '../../types';

interface SearchFilterProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery?: string;
  onSearchChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchFilter({ 
  viewMode, 
  setViewMode, 
  searchQuery = '', 
  onSearchChange 
}: SearchFilterProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`bg-white shadow-sm rounded-lg mb-6 p-4 transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar 
          placeholder="Search channels..." 
          value={searchQuery} 
          onChange={onSearchChange} 
        />
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </div>
  );
}
