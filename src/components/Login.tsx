import { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '../lib/firebase';

interface LoginProps {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [language, setLanguage] = useState('');
  const [interests, setInterests] = useState('');
  const [allowDetails, setAllowDetails] = useState(true); // allowDetails の初期値
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!username.trim()) {
      setErrorMessage('ユーザー名を入力してください。');
      return;
    }
    setErrorMessage('');

    const userRef = ref(database, `users/${username}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      // ユーザーが存在する場合はログイン処理を進める
      onLogin(username.trim());
    } else {
      // ユーザーが存在しない場合、新規登録を促す
      setIsNewUser(true);
    }
  };

  const handleRegister = async () => {
    if (!language.trim() || !interests.trim()) {
      setErrorMessage('全ての項目を入力してください。');
      return;
    }
    setErrorMessage('');

    const userRef = ref(database, `users/${username}`);
    const newUser = {
      id: username,
      name: username,
      language,
      interests: interests.split(',').map((interest) => interest.trim()),
      allowDetails, // ユーザーが選択した値を保存
      gender: null,
      photo: null,
    };

    await set(userRef, newUser);

    onLogin(username.trim()); // 登録後にログイン
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {isNewUser ? '新規登録' : 'ログイン'}
        </h1>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        {!isNewUser ? (
          <>
            <p className="text-gray-600 mb-6 text-center">
              お名前を入力してください。
            </p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="お名前"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              ログイン
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-6 text-center">
              必要な情報を入力してください。
            </p>
            <div className="space-y-4">
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="使用する言語 (例: English, 日本語)"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="興味 (カンマ区切り)"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="flex items-center space-x-2">
                <label className="text-gray-700">詳細情報を公開する</label>
                <input
                  type="checkbox"
                  checked={allowDetails}
                  onChange={(e) => setAllowDetails(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded"
                />
              </div>
            </div>
            <button
              onClick={handleRegister}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors mt-4"
            >
              新規登録
            </button>
          </>
        )}
      </div>
    </div>
  );
}
