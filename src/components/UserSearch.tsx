import { useState } from 'react';
import { Search, Globe, Heart } from 'lucide-react';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../lib/firebase';
import { User } from '../types';

interface UserSearchProps {
  currentUserId: string;
  onUserClick: (user: User) => void;
}

export default function UserSearch({ currentUserId, onUserClick }: UserSearchProps) {
  const [language, setLanguage] = useState('');
  const [interest, setInterest] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const filterUsers = async () => {
    setLoading(true);
    const userRef = ref(database, 'users');
    let firebaseQuery = query(userRef);

    // 言語でフィルタリング
    if (language) {
      firebaseQuery = query(userRef, orderByChild('language'), equalTo(language));
    }

    try {
      const snapshot = await get(firebaseQuery);

      if (snapshot.exists()) {
        const data = Object.values(snapshot.val()) as User[];
        const result = interest
          ? data.filter(
              (user) =>
                user.id !== currentUserId &&
                user.interests.some((i) => i.toLowerCase().includes(interest.toLowerCase()))
            )
          : data.filter((user) => user.id !== currentUserId);

        setFilteredUsers(result);
      } else {
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
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
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <ul className="space-y-4">
            {filteredUsers.map((user) => (
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
            {filteredUsers.length === 0 && !loading && (
              <p className="text-gray-500">No users found with the given criteria.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
