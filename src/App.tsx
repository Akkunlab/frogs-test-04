import { useState } from 'react';
import { PenTool } from 'lucide-react';
import Login from './components/Login';
import UserSearch from './components/UserSearch';
import LetterList from './components/LetterList';
import LetterEditor from './components/LetterEditor';
import Notifications from './components/Notifications';
import type { Letter, User } from './types';

interface Notification {
  id: string;
  type: 'sent' | 'received' | 'evaluation';
  message: string;
  timestamp: Date;
}

const SAMPLE_USERS: User[] = [
  {
    id: 'user1',
    name: 'Alice Johnson',
    photo: 'https://via.placeholder.com/50',
    language: 'English',
    interests: ['Music', 'Art'],
  },
  {
    id: 'user2',
    name: 'Bob Smith',
    photo: 'https://via.placeholder.com/50',
    language: 'Japanese',
    interests: ['Anime', 'Gaming'],
  },
];

const SAMPLE_LETTERS: Letter[] = [
  {
    id: '1',
    senderId: 'user1',
    receiverId: 'user2',
    content: 'Hello from Japan!',
    sentAt: new Date(),
    isRead: false,
  },
  {
    id: '2',
    senderId: 'user3',
    receiverId: 'user2',
    content: 'Greetings from France!',
    sentAt: new Date(Date.now() - 86400000),
    isRead: true,
  },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [letters, setLetters] = useState<Letter[]>(SAMPLE_LETTERS);
  const [notifications, setNotifications] = useState<Notification[]>([]); // 修正: 型注釈を追加
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleLogin = (username: string) => {
    setUsername(username);
    setIsLoggedIn(true);
  };

  const handleSendLetter = (content: string) => {
    if (selectedUser) {
      const newLetter: Letter = {
        id: Date.now().toString(),
        senderId: username,
        receiverId: selectedUser.id,
        content,
        sentAt: new Date(),
        isRead: false,
      };
      setLetters((prevLetters) => [...prevLetters, newLetter]);
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'sent',
          message: `Letter sent to ${selectedUser.name}: ${content}`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <PenTool className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">PenPal Connect</h1>
            <p className="text-gray-600">ようこそ, {username}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <UserSearch
              onSearch={() => {}}
              users={SAMPLE_USERS}
              onUserClick={setSelectedUser}
            />
            <LetterList letters={letters} onLetterClick={() => {}} />
          </div>
          <div>
            <LetterEditor
              onSend={handleSendLetter}
              selectedUser={selectedUser}
            />
          </div>
        </div>
      </main>

      <Notifications notifications={notifications} />
    </div>
  );
}

export default App;
