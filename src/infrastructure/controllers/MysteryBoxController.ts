import { Response } from "express";
import { Controller } from "./Controller";
import { SearchMysteryBoxMatchesUseCase } from "../../application/SearchMysteryBoxMatchesUseCase";

export class MysteryBoxController extends Controller {
  constructor(
    private readonly searchMysteryBoxMatchesUseCase: SearchMysteryBoxMatchesUseCase
  ) {
    super();
  }
  async getRollOption(res: Response): Promise<void> {
    try {
      //! Get From request
      const matches = await this.searchMysteryBoxMatchesUseCase.searchMatches(
        "0e4a517e-aac2-43d2-9b5a-513d5e7dd09e",
        1,
        [
          "36b7bd42-16d4-40ff-b0a9-1bebbc408496",
          "4a574a12-3e88-41fc-9d7f-657664b44d9b",
        ],
        ["4a574a12-3e88-41fc-9d7f-657664b44d9b"],
        null
      );
      res.status(200).json({
        success: true,
        data: "matches",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching roll",
      });
    }
  }
}
