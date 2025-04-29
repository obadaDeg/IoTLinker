import { Grid, List } from 'lucide-react';
import { ViewMode } from '../../types';

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export default function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  const commonClasses = 'p-2 rounded-md transition-all duration-200';

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => setViewMode('grid')}
        className={`${commonClasses} ${
          viewMode === 'grid'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        aria-label="Grid view"
      >
        <Grid size={20} />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`${commonClasses} ${
          viewMode === 'list'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        aria-label="List view"
      >
        <List size={20} />
      </button>
    </div>
  );
}
