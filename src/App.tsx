import React, { useState } from 'react';
import { PenTool } from 'lucide-react';
import UserSearch from './components/UserSearch';
import LetterList from './components/LetterList';
import LetterEditor from './components/LetterEditor';
import Notifications from './components/Notifications';
import type { Letter } from './types';

const SAMPLE_LETTERS: Letter[] = [
  {
    id: '1',
    senderId: 'user1',
    receiverId: 'user2',
    content: 'Hello from Japan!',
    sentAt: new Date(),
    isRead: false
  },
  {
    id: '2',
    senderId: 'user3',
    receiverId: 'user2',
    content: 'Greetings from France!',
    sentAt: new Date(Date.now() - 86400000),
    isRead: true
  }
];

function App() {
  const [letters] = useState<Letter[]>(SAMPLE_LETTERS);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'received',
      message: 'You have received a new letter!',
      timestamp: new Date()
    }
  ]);

  const handleSearch = (filters: any) => {
    console.log('Searching with filters:', filters);
  };

  const handleLetterClick = (letter: Letter) => {
    if (!letter.isRead) {
      setNotifications(prev => [...prev, {
        id: Date.now().toString(),
        type: 'read',
        message: 'Letter marked as read',
        timestamp: new Date()
      }]);
    }
  };

  const handleSendLetter = (content: string) => {
    setNotifications(prev => [...prev, {
      id: Date.now().toString(),
      type: 'sent',
      message: 'Letter sent successfully',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <PenTool className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">PenPal Connect</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <UserSearch onSearch={handleSearch} />
            <LetterList letters={letters} onLetterClick={handleLetterClick} />
          </div>
          <div>
            <LetterEditor onSend={handleSendLetter} />
          </div>
        </div>
      </main>

      <Notifications notifications={notifications} />
    </div>
  );
}

export default App;