import { dragonsClient } from "../clients/dragonsofmugloar/api.ts";
import type { ReputationResponse } from "../types/reputation.types.ts";

export class ReputationService {
  public async investigateReputation(gameId: string) {
    return dragonsClient.post<ReputationResponse>(
      `/${gameId}/investigate/reputation`,
    );
  }
}
