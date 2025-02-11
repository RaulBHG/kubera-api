import { Request, Response } from "express";
import { Controller } from "./Controller";
import { SearchMysteryBoxMatchesUseCase } from "../../application/SearchMysteryBoxMatchesUseCase";
import Joi from "joi";

export class MysteryBoxController extends Controller {
  constructor(
    private readonly searchMysteryBoxMatchesUseCase: SearchMysteryBoxMatchesUseCase
  ) {
    super();
  }
  async getRollOption(userId: string, req: Request, res: Response): Promise<void> {
    try {

      const schema = Joi.object({
        country_code: Joi.string().required().messages({
          "any.required": "The country_code field is required.",
        }),
        categories: Joi.string()
          .pattern(
            /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})(,([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}))*$/
          )
          .messages({
            "string.pattern.base":
              "The platforms field must be a comma-separated list of valid UUIDs.",
          }),
        platforms: Joi.string()
          .pattern(
            /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})(,([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}))*$/
          )
          .required()
          .messages({
            "any.required": "The platforms field is required.",
            "string.pattern.base":
              "The platforms field must be a comma-separated list of valid UUIDs.",
          }),
        reroll_option: Joi.number().valid(1, 2, 3).messages({
          "any.only": "The reroll_option field must be one of [1, 2, 3].",
        }),
      });
      if (!this.validateRequest(req, res, schema, 'query')) return;

      const countryCode = req.query.country_code as string;
      const categories = req.query.categories as string ?? "";
      const categoriesArray = categories.split(",").map((id: string) => id);
      const platforms = req.query.platforms as string;
      const platformArray = platforms.split(",").map((id: string) => id);
      const rerollOption = req.body.reroll_option as number ?? 1;

      //! Get From request
      const matches = await this.searchMysteryBoxMatchesUseCase.searchMatches(
        userId, // user_id
        rerollOption, // reroll option
        categoriesArray, // category_id
        platformArray, // platform_id
        countryCode // country_code
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
