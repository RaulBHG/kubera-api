import { SearchMysteryBoxMatchesUseCase } from "../../application/SearchMysteryBoxMatchesUseCase";
import { MysteryBoxController } from "../controllers/MysteryBoxController";
import { CategorySequelizeRepository } from "../repositories/CategorySequelizeRepository";
import { KinguinRepository } from "../repositories/KinguinRepository";
import { MysteryBoxSequelizeRepository } from "../repositories/MysteryBoxSequelizeRepository";
import { PlatformSequelizeRepository } from "../repositories/PlatformSequelizeRepository";
import { SteamAccountReferenceGamesSequelizeRepository } from "../repositories/SteamAccountReferenceGamesSequelizeRepository";
import { SteamGamePlatformRepository } from "../repositories/SteamGamePlatformRepository";
import { UserSequelizeRepository } from "../repositories/UserSequelizeRepository";

const { asClass, asValue, createContainer } = require("awilix");

const DIContainer = createContainer();

DIContainer.register({
    // ---------------- REPOSITORIES ----------------
    userRepository: asClass(UserSequelizeRepository).scoped(),
    mysteryBoxRepository: asClass(MysteryBoxSequelizeRepository).scoped(),
    mysteryBoxTypeRepository: asClass(MysteryBoxSequelizeRepository).scoped(),
    gameProviderRepository: asClass(KinguinRepository).scoped(),
    categoryRepository: asClass(CategorySequelizeRepository).scoped(),
    platformRepository: asClass(PlatformSequelizeRepository).scoped(),
    gamePlatformAccountGamesRepository: asClass(
      SteamAccountReferenceGamesSequelizeRepository
    ).scoped(),
    externalGamePlatformRepository: asClass(
      SteamGamePlatformRepository
    ).scoped(),

    // ---------------- USE CASES ----------------
    searchMysteryBoxMatchesUseCase: asClass(
      SearchMysteryBoxMatchesUseCase
    ).scoped(),

    // ---------------- CONTROLLERS ----------------
    mysteryBoxController: asClass(MysteryBoxController).scoped(),
  });

module.exports = DIContainer;
