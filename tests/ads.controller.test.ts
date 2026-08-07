import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Response, NextFunction, Request } from "express";
import { getAds } from "../controllers/ads.controller.ts";
import { AdsService } from "../services/ads.service.ts";
import type { GameIdRequestParams } from "../types/index.types.ts";
import type { AdItem } from "../types/ads.types.ts";

vi.mock("../services/ads.service.ts", () => ({
  AdsService: vi.fn(function AdsService() {
    return { getAds: vi.fn() };
  }),
}));

vi.mock("../db/config.db.ts", () => ({
  database: {
    db: vi.fn(() => ({
      collection: vi.fn(() => ({
        findOne: vi.fn(),
        insertOne: vi.fn(),
        updateOne: vi.fn(),
        find: vi.fn(),
      })),
    })),
  },
}));
 

const mockAdsService = vi.mocked(AdsService).mock.results[0]!.value as {
    getAds: ReturnType<typeof vi.fn>;
};

function mockRes(): Response {
    return { success: vi.fn(), error: vi.fn() } as unknown as Response;
}

function mockReq(gameId?: string): Request<GameIdRequestParams> {
    return { params: { gameId } } as unknown as Request<GameIdRequestParams>;
}

describe("ads.controller getAds function", () => {
    let next: NextFunction;

    beforeEach(() => {
        mockAdsService.getAds.mockReset();
        next = vi.fn();
    });

    it("fetches ads for the given gameId and responds via res.success", async () => {
        const ads: AdItem[] = [
            {
                "adId": "zY0BCCFb",
                "message": "Help Vepkhia Auteberry to transport a magic house to steppe in Pencrest",
                "reward": 20,
                "expiresIn": 7,
                "encrypted": null,
                "probability": "Gamble"
            },
        ];
        mockAdsService.getAds.mockResolvedValue(ads);

        const req = mockReq("jiRpdWHM");
        const res = mockRes();

        await getAds(req, res, next);

        expect(mockAdsService.getAds).toHaveBeenCalledWith("jiRpdWHM");
        expect(mockAdsService.getAds).toHaveBeenCalledTimes(1);
        expect(res.success).toHaveBeenCalledWith(ads);
        expect(res.error).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it("forwards service errors to next() instead of responding", async () => {
        const error = new Error("Dragons of Mugloar API is unavailable.");
        mockAdsService.getAds.mockRejectedValue(error);

        const req = mockReq("jiRpdWHM");
        const res = mockRes();

        await getAds(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.success).not.toHaveBeenCalled();
    });

    it("sends no response at all when gameId is missing", async () => {
        const req = mockReq("");
        const res = mockRes();

        await getAds(req, res, next);

        expect(mockAdsService.getAds).not.toHaveBeenCalled();
        expect(res.success).not.toHaveBeenCalled();
        expect(res.error).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });
});