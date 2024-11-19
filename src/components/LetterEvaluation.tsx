import { useState } from 'react';
import type { Letter } from '../types';

interface LetterEvaluationProps {
  letter: Letter;
  onClose: () => void;
  onSubmitEvaluation: (evaluation: Evaluation) => void;
}

interface Evaluation {
  intimacy: number; // 親密度
  naturalness: number; // 言語の自然さ
  grammar: number; // 文法の正確さ
  corrections: string; // 修正箇所
  comments: string; // コメント
}

export default function LetterEvaluation({ letter, onClose, onSubmitEvaluation }: LetterEvaluationProps) {
  const [intimacy, setIntimacy] = useState(3);
  const [naturalness, setNaturalness] = useState(3);
  const [grammar, setGrammar] = useState(3);
  const [corrections, setCorrections] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    const evaluation: Evaluation = { intimacy, naturalness, grammar, corrections, comments };
    onSubmitEvaluation(evaluation);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md md:max-w-lg mx-auto h-auto md:h-auto">
        <div className="p-6 overflow-auto max-h-[90vh]">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center">手紙の評価</h2>
          <p className="text-gray-700 bg-gray-100 p-3 rounded-md mb-6">{letter.content}</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">☆ 評価者との親密度</label>
              <input
                type="range"
                min="1"
                max="5"
                value={intimacy}
                onChange={(e) => setIntimacy(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <p className="text-sm text-gray-600 mt-1">評価: {intimacy}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">☆ 言語の自然さ</label>
              <input
                type="range"
                min="1"
                max="5"
                value={naturalness}
                onChange={(e) => setNaturalness(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <p className="text-sm text-gray-600 mt-1">評価: {naturalness}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">☆ 文法の正確さ</label>
              <input
                type="range"
                min="1"
                max="5"
                value={grammar}
                onChange={(e) => setGrammar(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <p className="text-sm text-gray-600 mt-1">評価: {grammar}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">間違っていたところの指摘と修正</label>
              <textarea
                value={corrections}
                onChange={(e) => setCorrections(e.target.value)}
                placeholder="間違いを指摘し、修正を記入してください。"
                className="w-full h-20 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">コメント</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="追加のコメントを記入してください。"
                className="w-full h-20 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center p-4 space-x-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="py-2 px-4 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            提出する
          </button>
        </div>
      </div>
    </div>
  );
}
