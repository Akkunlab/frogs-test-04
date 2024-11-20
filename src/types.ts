export interface User {
  language: string;
  id: string;
  name: string;
  photo?: string;
  gender?: string;
  interests: string[];
  allowDetails: boolean;
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
  sentAt: string;
  isRead: boolean;
}

export interface Evaluation {
  senderId: string;
  receiverId: string;
  intimacy: number;
  naturalness: number;
  grammar: number;
  corrections: string;
  comments: string;
  sentAt: string;
}
