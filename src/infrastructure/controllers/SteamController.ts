import { StoreExternalGamePlatformAccountUseCase } from "../../application/StoreExternalGamePlatformAccountUseCase";
import { Request, Response } from "express";
import { SteamGamePlatformRepository } from "../repositories/SteamGamePlatformRepository";
import { UserSequelizeRepository } from "../repositories/UserSequelizeRepository";
import { SteamAccountSequelizeRepository } from "../repositories/SteamAccountSequelizeRepository";
import { SteamAccountReferenceGamesSequelizeRepository } from "../repositories/SteamAccountReferenceGamesSequelizeRepository";
import { body, param, validationResult } from "express-validator";

export class SteamController {
  static validate(method: string) {
    switch (method) {
      case "storeAccountData": {
        return [body("user_id").exists().withMessage("user_id is required")];
      }
    }
  }
  // Sacar este método fuera
  static handleValidationResult(req: Request, res: Response, next: any) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }


  async storeAccountData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.user_id;
      const clientIp = req.ip;

      const useCase = new StoreExternalGamePlatformAccountUseCase(
        new SteamGamePlatformRepository(),
        new UserSequelizeRepository(),
        new SteamAccountSequelizeRepository(),
        new SteamAccountReferenceGamesSequelizeRepository()
      );

      res.status(200).json({
        success: await useCase.storeAccountData(userId, clientIp!),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing the request",
      });
    }
  }
}
