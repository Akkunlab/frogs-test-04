import { Letter } from '../types';

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
  if (!isOpen || !letter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">手紙の詳細</h2>
        <p>
          <strong>送信者:</strong> {letter.senderId}
        </p>
        <p>
          <strong>受信者:</strong> {letter.receiverId}
        </p>
        <p>
          <strong>内容:</strong> {letter.content}
        </p>
        <p>
          <strong>送信日時:</strong>{' '}
          {new Date(letter.sentAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
