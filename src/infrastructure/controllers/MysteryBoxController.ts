import { Category } from "../../domain/entities/Category";
import { CategorySequelizeRepository } from "../repositories/CategorySequelizeRepository";
import { Response } from "express";
import { Controller } from "./Controller";
import { SearchMysteryBoxMatchesUseCase } from "../../application/SearchMysteryBoxMatchesUseCase";
import { UserSequelizeRepository } from './../repositories/UserSequelizeRepository';
import { MysteryBoxSequelizeRepository } from "../repositories/MysteryBoxSequelizeRepository";
import { MysteryBoxTypeSequelizeRepository } from "../repositories/MysteryBoxTypeSequelizeRepository";
import { KinguinRepository } from "../repositories/KinguinRepository";
import { PlatformSequelizeRepository } from "../repositories/PlatformSequelizeRepository";
import { SteamGamePlatformRepository } from "../repositories/SteamGamePlatformRepository";
import { SteamAccountReferenceGamesSequelizeRepository } from "../repositories/SteamAccountReferenceGamesSequelizeRepository";

export class MysteryBoxController extends Controller {
  async getRollOption(res: Response): Promise<void> {
    try {
      const useCase = new SearchMysteryBoxMatchesUseCase(
        new UserSequelizeRepository(),
        new MysteryBoxSequelizeRepository(),
        new MysteryBoxTypeSequelizeRepository(),
        new KinguinRepository(),
        new CategorySequelizeRepository(),
        new PlatformSequelizeRepository(),
        new SteamAccountReferenceGamesSequelizeRepository(),
        new SteamGamePlatformRepository(),

      );
      const categories = await useCase.getVisible();
      const formatedCategories = categories.map((category: Category) => ({
        id: category.getId(),
        slug: category.getSlug(),
        name: category.getName(),
      }));

      res.status(200).json({
        success: true,
        data: formatedCategories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching categories",
      });
    }
  }
}
