import { SyncExternalCategoriesUseCase } from "../../application/SyncExternalCategoriesUseCase";
import { CategorySteamRepository } from "../repositories/CategorySteamRepository";
import { CategorySequelizeRepository } from "../repositories/CategorySequelizeRepository";

const useCase = new SyncExternalCategoriesUseCase(
  new CategorySequelizeRepository(),
  new CategorySteamRepository()
);

useCase.execute();
