import { SyncExternalCategoriesUseCase } from "../../application/SyncExternalCategoriesUseCase";
import { CategorySteamRepository } from "../repositories/CategorySteamRepository";
import { CategorySequelizeRepository } from "../repositories/CategorySequelizeRepository";
import { PinoLoggerAdapter } from "../adapters/log/PinoLoggerAdapter";

const useCase = new SyncExternalCategoriesUseCase(
  new CategorySequelizeRepository(),
  new CategorySteamRepository(),
  new PinoLoggerAdapter()
);

useCase.execute();
