export interface User {
  id: string;
  name: string;
  photo: string;
  language: string;
  interests: string[];
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