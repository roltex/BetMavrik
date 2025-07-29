export interface Game {
  id: number;
  title: string;
  category: string;
  producer: string;
  thumbnail?: string;
  thumbnail_horizontal?: string;
  thumbnail_vertical?: string;
  feature_group?: string;
  devices?: string[];
  licenses?: string[];
  jackpot_type?: string;
  has_freespins?: boolean;
  has_jackpot?: boolean;
  lines?: number;
  ways?: number;
  payout?: number;
  hit_rate?: number;
  volatility_rating?: string;
  hd?: boolean;
  multiplier?: number;
  released_at?: string;
  recalled_at?: string;
  restrictions?: Record<string, any>;
  playing?: number;
}

export interface CreateFreespinsRequest {
  game: string;
  currency: string;
  betlevel: number;
  freespincount: number;
  expiretime: string; // Format: "2025-05-12 10:00:00"
}

export interface FreespinsResponse {
  identifier: string;
} 