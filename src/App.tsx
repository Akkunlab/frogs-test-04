import { useState } from 'react';
import { PenTool } from 'lucide-react';
import UserSearch from './components/UserSearch';
import LetterList from './components/LetterList';
import LetterEditor from './components/LetterEditor';
import Notifications from './components/Notifications';
import type { Letter, User } from './types';
import LetterEvaluation from './components/LetterEvaluation';

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
  const [letters] = useState<Letter[]>(SAMPLE_LETTERS);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'received',
      message: 'You have received a new letter!',
      timestamp: new Date(),
    },
  ]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  const handleSearch = (filters: unknown) => {
    console.log('Searching with filters:', filters);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleLetterClick = (letter: Letter) => {
    setSelectedLetter(letter);
  };

  const handleSendLetter = (content: string) => {
    if (selectedUser) {
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

  const handleSubmitEvaluation = (evaluation: { intimacy: number; naturalness: number; grammar: number; corrections: string; comments: string }) => {
    console.log('Evaluation submitted:', evaluation);
    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'evaluation',
        message: 'Evaluation submitted successfully!',
        timestamp: new Date(),
      },
    ]);
    setSelectedLetter(null); // 閉じる
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
            <UserSearch
              onSearch={handleSearch}
              users={SAMPLE_USERS}
              onUserClick={handleUserClick}
            />
            <LetterList letters={letters} onLetterClick={handleLetterClick} />
          </div>
          <div>
            <LetterEditor
              onSend={handleSendLetter}
              selectedUser={selectedUser}
            />
          </div>
        </div>
      </main>

      {selectedLetter && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <LetterEvaluation
            letter={selectedLetter}
            onClose={() => setSelectedLetter(null)}
            onSubmitEvaluation={handleSubmitEvaluation}
          />
        </div>
      )}

      <Notifications notifications={notifications} />
    </div>
  );
}

export default App;
