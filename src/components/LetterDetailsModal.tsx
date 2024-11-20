import { useState } from 'react';
import { Letter } from '../types';
import LetterEvaluation from './LetterEvaluation';

interface LetterDetailsModalProps {
  letter: Letter | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LetterDetailsModal({
  letter,
  isOpen,
  onClose,
}: LetterDetailsModalProps) {
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);

  if (!isOpen || !letter) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-xl font-bold mb-4">Letter Details</h2>
          <p>
            <strong>Sender:</strong> {letter.senderId}
          </p>
          <p>
            <strong>Receiver:</strong> {letter.receiverId}
          </p>
          <p>
            <strong>Content:</strong> {letter.content}
          </p>
          <p>
            <strong>Sent At:</strong>{' '}
            {new Date(letter.sentAt).toLocaleString()}
          </p>

          <button
            onClick={() => setIsEvaluationOpen(true)}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Review
          </button>
        </div>
      </div>

      {isEvaluationOpen && (
        <LetterEvaluation
          letter={letter}
          onClose={() => setIsEvaluationOpen(false)}
          onSubmitEvaluation={(evaluation) => {
            // 評価を送信するロジックを追加
            console.log('Evaluation Submitted:', evaluation);
            setIsEvaluationOpen(false); // モーダルを閉じる
          }}
        />
      )}
    </>
  );
}
