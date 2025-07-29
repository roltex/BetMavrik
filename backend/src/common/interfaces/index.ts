export interface Game {
  id: number;
  name: string;
  description?: string;
  thumbnail?: string;
  thumbnail_horizontal?: string;
  thumbnail_vertical?: string;
}

export interface User {
  id: string;
  username: string;
  balance: number;
  email?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'bet' | 'win' | 'rollback';
  game_id?: string;
  created_at: string;
}

export interface Balance {
  user_id: string;
  balance: number;
}

export interface GameSession {
  url: string;
  game_id: number;
} 