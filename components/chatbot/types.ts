export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface ChatbotWindowProps {
  onClose: () => void;
}

export interface ChatHistory {
  role: 'user' | 'model';
  text: string;
}
