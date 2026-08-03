
export type MessageSender = 'user' | 'bot';

export interface Message {
  id: string | number;
  text: string;
  sender: MessageSender;
}

export interface Project {
  id: number;
  title: string;
  desc: string;
  img: string;
}
