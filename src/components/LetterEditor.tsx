import { useState } from 'react';
import { Send, MessageSquare, Languages } from 'lucide-react';
import type { Comment, User } from '../types';
import TranslationDropdown from './TranslationDropdown';

interface LetterEditorProps {
  onSend: (content: string) => void;
  onComment?: (comment: Omit<Comment, 'id' | 'userId' | 'createdAt'>) => void;
  selectedUser: User | null;
}

export default function LetterEditor({ onSend, onComment, selectedUser }: LetterEditorProps) {
  const [content, setContent] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!content.trim()) return;

    setIsTranslating(true);
    try {
      // 実際のアプリケーションではバックエンド翻訳サービスを呼び出します
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          targetLanguage,
        }),
      });

      const { translatedText } = await response.json();
      setTranslatedContent(translatedText);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedUser ? `Write to ${selectedUser.name}` : 'Write a Letter'}
        </h2>
        <TranslationDropdown
          selectedLanguage={targetLanguage}
          onLanguageChange={setTargetLanguage}
        />
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

        <button
          onClick={handleTranslate}
          disabled={isTranslating || !content.trim()}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Languages className="w-4 h-4" />
          <span>{isTranslating ? 'Translating...' : 'Translate'}</span>
        </button>

        {translatedContent && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Translated Text</label>
            <textarea
              value={translatedContent}
              readOnly
              className="w-full h-32 p-4 bg-gray-50 border border-gray-300 rounded-lg resize-none"
            />
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            onClick={() => onComment?.({
              content: 'Please review my letter',
              type: 'suggestion',
            })}
            className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Request Review</span>
          </button>

          <button
            onClick={() => onSend(content)}
            disabled={!selectedUser} // 宛先がない場合は無効化
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
