import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import type { Letter } from '../types';
import LetterDetailsModal from './LetterDetailsModal';

interface LetterListProps {
  currentUserId: string;
}

export default function LetterList({ currentUserId }: LetterListProps) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  useEffect(() => {
    const lettersRef = ref(database, 'letters');

    const unsubscribe = onValue(
      lettersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val()) as Letter[];
          // 自分宛の手紙をフィルタリング
          const filteredLetters = data.filter(
            (letter) => letter.receiverId === currentUserId
          );
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
            onClick={() => setSelectedLetter(letter)}
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
                </div>
              </div>
              {letter.isRead ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Clock className="w-5 h-5 text-indigo-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      <LetterDetailsModal
        letter={selectedLetter}
        isOpen={!!selectedLetter}
        onClose={() => setSelectedLetter(null)}
      />
    </div>
  );
}
