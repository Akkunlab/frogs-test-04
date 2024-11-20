import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import LetterEvaluation from './LetterEvaluation';
import { Evaluation, Letter } from '../types';

interface LetterListProps {
  currentUserId: string;
}

export default function LetterList({ currentUserId }: LetterListProps) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);

  // 手紙データを取得
  useEffect(() => {
    const lettersRef = ref(database, 'letters');
    const unsubscribe = onValue(
      lettersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val()) as Letter[];
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

    return () => unsubscribe();
  }, [currentUserId]);

  // 評価データを取得
  useEffect(() => {
    const evaluationsRef = ref(database, 'evaluations');
    const unsubscribe = onValue(
      evaluationsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val()) as Evaluation[];
          const filteredEvaluations = data.filter(
            (evaluation) => evaluation.receiverId === currentUserId
          );
          setEvaluations(filteredEvaluations);
        } else {
          setEvaluations([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching evaluations:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUserId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Letters</h2>
      <div className="space-y-4">
        {letters.length === 0 && evaluations.length === 0 && (
          <p className="text-gray-500">You have no letters and evaluations at the moment.</p>
        )}
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
        {evaluations.map((evaluation) => (
          <div
            key={evaluation.sentAt}
            className="p-4 rounded-lg bg-green-50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedEvaluation(evaluation)}
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-gray-800">
                  Reviewed by {evaluation.senderId}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(evaluation.sentAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative m-4">
            <button
              onClick={() => setSelectedLetter(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Letter Details</h2>
            <p>
              <strong>Sender:</strong> {selectedLetter.senderId}
            </p>
            <p>
              <strong>Content:</strong> {selectedLetter.content}
            </p>
            <p>
              <strong>Sent At:</strong>{' '}
              {new Date(selectedLetter.sentAt).toLocaleString()}
            </p>
            <button
              onClick={() => setIsEvaluationOpen(true)}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Review
            </button>
          </div>
        </div>
      )}

      {selectedEvaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative m-4">
            <button
              onClick={() => setSelectedEvaluation(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">評価の詳細</h2>
      
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">項目</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">送信者</td>
                  <td className="border border-gray-300 px-4 py-2">{selectedEvaluation.senderId}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">親密度</td>
                  <td className="border border-gray-300 px-4 py-2">{selectedEvaluation.intimacy} / 5</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">自然さ</td>
                  <td className="border border-gray-300 px-4 py-2">{selectedEvaluation.naturalness} / 5</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">文法</td>
                  <td className="border border-gray-300 px-4 py-2">{selectedEvaluation.grammar} / 5</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">修正内容</td>
                  <td className="border border-gray-300 px-4 py-2">{selectedEvaluation.corrections || 'なし'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">コメント</td>
                  <td className="border border-gray-300 px-4 py-2">{selectedEvaluation.comments || 'なし'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">評価日時</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(selectedEvaluation.sentAt).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isEvaluationOpen && selectedLetter && (
        <LetterEvaluation
          letter={selectedLetter}
          onClose={() => {
            setIsEvaluationOpen(false);
            setSelectedLetter(null);
          }}
          onSubmitEvaluation={() => {
            setIsEvaluationOpen(false);
          }}
        />
      )}
    </div>
  );
}
