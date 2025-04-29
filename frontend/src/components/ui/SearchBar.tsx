import { Search } from 'lucide-react';
import { ChangeEvent } from 'react';
import TextField from '../shared/TextField';

interface SearchBarProps {
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export default function SearchBar({ 
  placeholder = 'Search', 
  onChange = () => {},
  value = ''
}: SearchBarProps) {
  return (
    <div className="relative">
      {/* <input
        type="text"
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 w-full sm:w-64"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      /> */}
      <TextField 
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
      <Search 
        size={20} 
        className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 " 
      />
    </div>
  );
}
