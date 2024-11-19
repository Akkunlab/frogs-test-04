import { useState } from 'react';
import { PenTool } from 'lucide-react';
import Login from './components/Login';
import UserSearch from './components/UserSearch';
import LetterList from './components/LetterList';
import LetterEditor from './components/LetterEditor';
import Notifications from './components/Notifications';
import type { Letter, User, Notification } from './types';

const SAMPLE_USERS: User[] = [
  {
    id: 'user1',
    name: 'Alice Johnson',
    photo: 'https://via.placeholder.com/50',
    gender: 'Female',
    interests: ['Music', 'Art'],
    allowDetails: true,
  },
  {
    id: 'user2',
    name: 'Bob Smith',
    interests: ['Anime', 'Gaming'],
    allowDetails: false, // 情報非公開
  },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [letters, setLetters] = useState<Letter[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userInteractions, setUserInteractions] = useState<Record<string, number>>({}); // 各ユーザーとの手紙送信回数

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

      // 手紙送信回数の更新
      setUserInteractions((prev) => {
        const newCount = (prev[selectedUser.id] || 0) + 1;
        return { ...prev, [selectedUser.id]: newCount };
      });
    }
  };

  // 解放される情報を取得
  const getVisibleDetails = (user: User) => {
    const sendCount = userInteractions[user.id] || 0;

    // 公開設定が無効なら情報を返さない
    if (!user.allowDetails) {
      return {
        gender: undefined,
        photo: undefined,
      };
    }

    const details: Partial<User> = {};
    if (sendCount >= 3) details.gender = user.gender; // 性別を解放
    if (sendCount >= 5) details.photo = user.photo; // 顔写真を解放
    return details;
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
              users={SAMPLE_USERS.map((user) => ({
                ...user,
                ...getVisibleDetails(user), // 解放情報をマージ
              }))}
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
