import { StoreExternalGamePlatformAccountUseCase } from "../../application/StoreExternalGamePlatformAccountUseCase";
import { Request, Response } from "express";
import { SteamGamePlatformRepository } from "../repositories/SteamGamePlatformRepository";
import { UserSequelizeRepository } from "../repositories/UserSequelizeRepository";
import { SteamAccountSequelizeRepository } from "../repositories/SteamAccountSequelizeRepository";
import { SteamAccountReferenceGamesSequelizeRepository } from "../repositories/SteamAccountReferenceGamesSequelizeRepository";
import { Controller } from "./Controller";
import Joi from "joi";
import { PinoLoggerAdapter } from "../adapters/log/PinoLoggerAdapter";
import { CategorySequelizeRepository } from "../repositories/CategorySequelizeRepository";

export class SteamController extends Controller {
  async storeAccountData(req: Request, res: Response): Promise<void> {
    const loggerAdapter = new PinoLoggerAdapter();

    try {
      const schema = Joi.object({
        user_id: Joi.string().required().messages({
          "any.required": "The user_id field is required.",
        }),
      });
      if (!this.validateRequest(req, res, schema)) return;

      const userId = req.body.user_id;
      const clientIp = req.ip;

      const useCase = new StoreExternalGamePlatformAccountUseCase(
        new SteamGamePlatformRepository(
          new CategorySequelizeRepository(),
          new SteamAccountSequelizeRepository(),
          loggerAdapter
        ),
        new UserSequelizeRepository(),
        new SteamAccountSequelizeRepository(),
        new SteamAccountReferenceGamesSequelizeRepository(),
        loggerAdapter
      );

      const userFound = await useCase.storeAccountData(userId, clientIp!);

      res.status(userFound ? 200 : 404).json({
        success: userFound,
      });
    } catch (error: any) {
      await loggerAdapter.log("Fatal error during storing steam account data", {
        context: "SteamController.storeAccountData",
        attributes: {
          message: error.message,
          stack: error.stack,
        },
      });

      res.status(500).json({
        success: false,
        message: "An error occurred while processing the request",
      });
    }
  }
}
