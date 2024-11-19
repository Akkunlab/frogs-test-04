export interface User {
  id: string;
  name: string;
  country: string;
  languages: string[];
  interests: string[];
  avatar: string;
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