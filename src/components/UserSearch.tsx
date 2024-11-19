import { useState } from 'react';
import { Search, Globe, Heart } from 'lucide-react';

interface UserSearchProps {
  onSearch: (filters: { language: string; interest: string }) => void;
}

export default function UserSearch({ onSearch }: UserSearchProps) {
  const [language, setLanguage] = useState('');
  const [interest, setInterest] = useState('');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Find Pen Pals</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Globe className="w-5 h-5 text-indigo-500" />
          <input
            type="text"
            placeholder="Search by language..."
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Heart className="w-5 h-5 text-indigo-500" />
          <input
            type="text"
            placeholder="Search by interests..."
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => onSearch({ language, interest })}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>Search Pen Pals</span>
        </button>
      </div>
    </div>
  );
}