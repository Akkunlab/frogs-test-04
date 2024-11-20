import { useState } from 'react';
import { ref, push } from 'firebase/database';
import { database } from '../lib/firebase';
import type { Letter, Evaluation } from '../types';

interface LetterEvaluationProps {
  letter: Letter;
  onClose: () => void;
  onSubmitEvaluation: (evaluation: Evaluation) => void;
}

export default function LetterEvaluation({
  letter,
  onClose,
  onSubmitEvaluation,
}: LetterEvaluationProps) {
  const [intimacy, setIntimacy] = useState(3);
  const [naturalness, setNaturalness] = useState(3);
  const [grammar, setGrammar] = useState(3);
  const [corrections, setCorrections] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = async () => {
    const evaluation = {
      senderId: letter.receiverId,
      receiverId: letter.senderId,
      intimacy,
      naturalness,
      grammar,
      corrections,
      comments,
      sentAt: new Date().toISOString(),
    };
  
    const evaluationsRef = ref(database, 'evaluations');
  
    try {
      await push(evaluationsRef, evaluation);
      onSubmitEvaluation(evaluation);
      onClose();
    } catch (error) {
      console.error('Error saving evaluation:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Review Letter</h2>
        <p className="mb-6 bg-gray-100 p-3 rounded">{letter.content}</p>

        <div className="space-y-4">
          <div>
            <label className="block mb-2">Intimacy</label>
            <input
              type="range"
              min="1"
              max="5"
              value={intimacy}
              onChange={(e) => setIntimacy(Number(e.target.value))}
              className="w-full"
            />
            <p>Rating: {intimacy}</p>
          </div>

          <div>
            <label className="block mb-2">Naturalness</label>
            <input
              type="range"
              min="1"
              max="5"
              value={naturalness}
              onChange={(e) => setNaturalness(Number(e.target.value))}
              className="w-full"
            />
            <p>Rating: {naturalness}</p>
          </div>

          <div>
            <label className="block mb-2">Grammar</label>
            <input
              type="range"
              min="1"
              max="5"
              value={grammar}
              onChange={(e) => setGrammar(Number(e.target.value))}
              className="w-full"
            />
            <p>Rating: {grammar}</p>
          </div>

          <div>
            <label className="block mb-2">Corrections</label>
            <textarea
              value={corrections}
              onChange={(e) => setCorrections(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Corrections"
            />
          </div>

          <div>
            <label className="block mb-2">Comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Comments"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
