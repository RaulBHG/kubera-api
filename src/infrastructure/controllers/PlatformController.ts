import { GetPlatformUseCase } from "../../application/GetPlatformUseCase";
import { Platform } from "../../domain/entities/Platform";
import { PlatformSequelizeRepository } from "../../infrastructure/repositories/PlatformSequelizeRepository";
import { Response } from "express";
import { Controller } from "./Controller";

export class PlatformController extends Controller {
  async getAll(res: Response): Promise<void> {
    try {
      const getPlatformUseCase = new GetPlatformUseCase(
        new PlatformSequelizeRepository()
      );
      const platforms = await getPlatformUseCase.getAll();

      const platformsWithoutExternalId = platforms.map(
        (platform: Platform) => ({
          id: platform.getId(),
          slug: platform.getSlug(),
          name: platform.getName(),
          visible: platform.isVisible(),
        })
      );

      res.status(200).json({
        success: true,
        data: platformsWithoutExternalId,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching platforms",
      });
    }
  }
}
