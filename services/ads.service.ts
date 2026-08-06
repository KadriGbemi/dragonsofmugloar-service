import { dragonsClient } from "../clients/dragonsofmugloar/api.ts";
import type { AdsResponse, SolveAdResponse } from "../types/ads.types.ts";

export class AdsService {
  public async getAds(gameId: string) {
    return dragonsClient.get<AdsResponse>(`/${gameId}/messages`);
  }

  public async solveAd(gameId: string, adId: string) {
    return dragonsClient.post<SolveAdResponse>(`/${gameId}/solve/${adId}`);
  }
}
