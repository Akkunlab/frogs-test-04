import React from 'react';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import type { Letter } from '../types';

interface LetterListProps {
  letters: Letter[];
  onLetterClick: (letter: Letter) => void;
}

export default function LetterList({ letters, onLetterClick }: LetterListProps) {
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
                <Mail className={`w-5 h-5 ${letter.isRead ? 'text-gray-400' : 'text-indigo-500'}`} />
                <div>
                  <p className="font-medium text-gray-800">
                    {letter.isRead ? 'Read' : 'New Letter'}
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
    </div>
  );
}