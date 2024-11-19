export interface User {
  language: ReactNode;
  id: string;
  name: string;
  photo?: string; // 解放される顔写真
  gender?: string; // 解放される性別
  interests: string[];
  allowDetails: boolean; // 情報を公開するかどうか
}

export interface Notification {
  id: string;
  type: 'sent' | 'received' | 'evaluation';
  message: string;
  timestamp: Date;
}

export interface Letter {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  translatedContent?: {
    text: string;
    language: string;
  };
  sentAt: Date;
  isRead: boolean;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  type: 'correction' | 'suggestion' | 'comment';
  createdAt: Date;
}

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
}
