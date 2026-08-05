import { DragonsOfMugloarAPIClient } from "./api.client.ts";

export const dragonsClient = new DragonsOfMugloarAPIClient(
  process.env.DRAGONS_API_URL!,
);
