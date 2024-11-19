import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { Mail, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import type { Letter } from '../types';

interface LetterListProps {
  currentUserId: string; // 現在のユーザーID
  onLetterClick: (letter: Letter) => void; // 手紙クリック時のハンドラー
}

export default function LetterList({ currentUserId, onLetterClick }: LetterListProps) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lettersRef = ref(database, 'letters');

    const unsubscribe = onValue(
      lettersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val()) as Letter[];
          // 自分宛の手紙をフィルタリング
          const filteredLetters = data.filter((letter) => letter.receiverId === currentUserId);
          setLetters(filteredLetters);
        } else {
          setLetters([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching letters:', error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe(); // リスナー解除
    };
  }, [currentUserId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (letters.length === 0) {
    return <p className="text-gray-500">You have no letters at the moment.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Letters</h2>

      <div className="space-y-4">
        {letters.map((letter) => (
          <div
            key={letter.id}
            onClick={() => onLetterClick(letter)}
            className={`p-4 rounded-lg border ${
              letter.isRead ? 'bg-gray-50' : 'bg-indigo-50'
            } cursor-pointer hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail
                  className={`w-5 h-5 ${
                    letter.isRead ? 'text-gray-400' : 'text-indigo-500'
                  }`}
                />
                <div>
                  <p className="font-medium text-gray-800">
                    From: {letter.senderId} {letter.isRead ? '(Read)' : '(New)'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(letter.sentAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    {letter.translatedContent
                      ? `Translated (${letter.translatedContent.language}): ${letter.translatedContent.text}`
                      : `Content: ${letter.content}`}
                  </p>
                </div>
              </div>
              {letter.isRead ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Clock className="w-5 h-5 text-indigo-500" />
              )}
            </div>
            {letter.comments && letter.comments.length > 0 && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span>{letter.comments.length} comments</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
