import { useState } from 'react';
import { Send } from 'lucide-react';
import type { User } from '../types';

interface LetterEditorProps {
  onSend: (content: string) => void;
  setSelectedUser: (user: User | null) => void; // 宛先リセット用
  selectedUser: User | null;
}

export default function LetterEditor({ onSend, setSelectedUser, selectedUser }: LetterEditorProps) {
  const [content, setContent] = useState('');

  // 手紙送信処理
  const handleSend = () => {
    if (content.trim()) {
      onSend(content);
      setContent(''); // 内容をリセット
      setSelectedUser(null); // 宛先をリセット
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedUser ? `Write to ${selectedUser.name}` : 'Write a Letter'}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Original Text</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={selectedUser ? `Write a letter to ${selectedUser.name}...` : 'Write your letter here...'}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSend}
            disabled={!selectedUser}
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>Send Letter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
