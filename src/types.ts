
export interface StudioRoom {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface DanceClass {
  id: string;
  title: string;
  instructor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  time: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
