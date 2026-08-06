import { Db } from "mongodb";

export async function addDBIndexes(db: Db): Promise<void> {
  const games = db.collection("games");

  await Promise.all([
    games.createIndex({ gameId: 1 }, { unique: true }),

    games.createIndex({ playerId: 1, gameId: 1 }, { unique: true }),

    games.createIndex({ playerName: 1, createdAt: -1 }),
  ]);
}
