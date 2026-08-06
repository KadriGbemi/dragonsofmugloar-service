export type SolveAdRequestParams = {
  gameId: string;
  adId: string;
};

export interface SolveAdResponse {
  success: boolean;
  lives: number;
  gold: number;
  score: number;
  highScore: number;
  turn: number;
  message: string;
}

export type AdItem = {
  adId: string;
  message: string;
  reward: number;
  expiresIn: number;
  encrypted: string | null;
  probability: string;
};

export type AdsResponse = AdItem[];
