export type SolveAdRequestParams = {
  gameId: string;
  adId: string;
};

export type AdItem = {
  adId: string;
  message: string;
  reward: number;
  expiresIn: number;
  encrypted: string | null;
  probability: string;
};

export type AdsResponse = AdItem[];
