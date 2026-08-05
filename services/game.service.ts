import { dragonsClient } from "../clients/dragonsofmugloar/api.ts";
import type { GameResponse } from "../types/game.types.ts";

export class GameService {
  public async startGame() {
    return dragonsClient.post<GameResponse>("/game/start");
  }

  public async getGame(gameId: string) {
    return dragonsClient.get<GameResponse>(`/game/${gameId}`);
  }
}
