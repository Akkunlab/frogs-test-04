import { useState } from 'react';
import { Search, Globe, Heart } from 'lucide-react';
import { User } from '../types';

interface UserSearchProps {
  users: User[];
  currentUserId: string; // ログイン中のユーザーID
  onUserClick: (user: User) => void;
}

export default function UserSearch({ users, currentUserId, onUserClick }: UserSearchProps) {
  const [language, setLanguage] = useState('');
  const [interest, setInterest] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const filterUsers = () => {
    // 自分自身を除外し、条件に一致するユーザーをフィルタリング
    const result = users
      .filter((user) => user.id !== currentUserId) // 自分を除外
      .filter((user) => {
        const languageMatch = language
          ? user.language.toLowerCase().includes(language.toLowerCase())
          : true;
        const interestMatch = interest
          ? user.interests.some((i) =>
              i.toLowerCase().includes(interest.toLowerCase())
            )
          : true;
        return languageMatch && interestMatch;
      });

    setFilteredUsers(result);
  };

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
          onClick={filterUsers}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>Search Pen Pals</span>
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Users</h3>
        <ul className="space-y-4">
          {(filteredUsers.length ? filteredUsers : users.filter(user => user.id !== currentUserId)) // 初期表示でも自分を除外
            .map((user) => (
              <li
                key={user.id}
                className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                onClick={() => onUserClick(user)}
              >
                <img
                  src={user.photo || '/default-avatar.png'}
                  alt={`${user.name}'s avatar`}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{user.name}</h4>
                  <p className="text-gray-600">Language: {user.language}</p>
                  <p className="text-gray-600">
                    Interests: {Array.isArray(user.interests) ? user.interests.join(', ') : 'No interests provided'}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
