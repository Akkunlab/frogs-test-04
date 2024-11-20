import { useState } from 'react';
import { PenTool } from 'lucide-react';
import { ref, set, get } from 'firebase/database';
import { database } from './lib/firebase';
import Login from './components/Login';
import UserSearch from './components/UserSearch';
import LetterList from './components/LetterList';
import LetterEditor from './components/LetterEditor';
import Notifications from './components/Notifications';
import type { Letter, User, Notification } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null); // 選択された手紙

  // ログイン処理
  const handleLogin = async (username: string) => {
    setUsername(username);
    setIsLoggedIn(true);

    const userRef = ref(database, `users/${username}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      await set(userRef, {
        id: username,
        name: username,
        allowDetails: true,
        interests: [],
        gender: null,
        photo: null,
      });
    }
  };

  // 手紙送信処理
  const handleSendLetter = async (content: string) => {
    if (selectedUser) {
      const newLetter: Letter = {
        id: Date.now().toString(),
        senderId: username,
        receiverId: selectedUser.id,
        content,
        sentAt: new Date().toISOString(),
        isRead: false,
      };
  
      // Firebaseに手紙データを保存
      const lettersRef = ref(database, `letters/${newLetter.id}`);
      await set(lettersRef, newLetter);
  
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'sent',
          message: `Letter sent to ${selectedUser.name}: ${content}`,
          timestamp: new Date(),
        },
      ]);
  
      // ユーザー間の送信回数を更新
      const userInteractionsRef = ref(
        database,
        `interactions/${username}/${selectedUser.id}`
      );
      const snapshot = await get(userInteractionsRef);
  
      const currentCount = snapshot.exists() ? snapshot.val() : 0;
      await set(userInteractionsRef, currentCount + 1);
  
      // 宛先と内容をリセット
      setSelectedUser(null);
      setSelectedLetter(null); // 必要ならリセット
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
              currentUserId={username}
              onUserClick={setSelectedUser}
            />
            <LetterList
              currentUserId={username}
            />
          </div>
          <div>
            {selectedLetter && (
              <div className="p-4 border rounded-lg bg-white shadow">
                <h2 className="text-xl font-bold">手紙の詳細</h2>
                <p><strong>送信者:</strong> {selectedLetter.senderId}</p>
                <p><strong>受信者:</strong> {selectedLetter.receiverId}</p>
                <p><strong>内容:</strong> {selectedLetter.content}</p>
                <p>
                  <strong>送信日時:</strong>{' '}
                  {selectedLetter.sentAt
                    ? new Date(selectedLetter.sentAt).toLocaleString()
                    : '日時情報なし'}
                </p>
              </div>
            )}
            <div className="my-4 border rounded-lg bg-white shadow">
              <LetterEditor onSend={handleSendLetter} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            </div>
          </div>
        </div>
      </main>

      <Notifications notifications={notifications} />
    </div>
  );
}

export default App;
