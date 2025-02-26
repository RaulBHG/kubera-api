import { SearchMysteryBoxMatchesUseCase } from "../../application/SearchMysteryBoxMatchesUseCase";
import { MockedTxnService } from "../../application/services/MockedTxnService";
import { PinoLoggerAdapter } from "../adapters/log/PinoLoggerAdapter";
import { MysteryBoxController } from "../controllers/MysteryBoxController";
import { WebsocketConnectionPublisher } from "../publishers/websocket/WebsocketConnectionPublisher";
import { CategorySequelizeRepository } from "../repositories/CategorySequelizeRepository";
import { KinguinRepository } from "../repositories/KinguinRepository";
import { MysteryBoxSequelizeRepository } from "../repositories/MysteryBoxSequelizeRepository";
import { MysteryBoxTypeSequelizeRepository } from "../repositories/MysteryBoxTypeSequelizeRepository";
import { PlatformSequelizeRepository } from "../repositories/PlatformSequelizeRepository";
import { SteamAccountReferenceGamesSequelizeRepository } from "../repositories/SteamAccountReferenceGamesSequelizeRepository";
import { SteamAccountSequelizeRepository } from "../repositories/SteamAccountSequelizeRepository";
import { SteamGamePlatformRepository } from "../repositories/SteamGamePlatformRepository";
import { UserSequelizeRepository } from "../repositories/UserSequelizeRepository";
import { WebSocketServer } from "./websocket/WebSocketServer";

const { asClass, asValue, createContainer } = require("awilix");

const DIContainer = createContainer({
  injectionMode: "CLASSIC",
});

DIContainer.register({
  // ---------------- INFRA ----------------
  webSocketServer: asClass(WebSocketServer).singleton().scoped(),

  // ---------------- PUBLISHERS ----------------
  wsConnectionPublisher: asClass(WebsocketConnectionPublisher)
    .singleton()
    .scoped(),

  // ---------------- SERVICES ----------------
  mockedTxnService: asClass(MockedTxnService).singleton().scoped(),

  // ---------------- REPOSITORIES ----------------
  logger: asClass(PinoLoggerAdapter).scoped(),
  userRepository: asClass(UserSequelizeRepository).scoped(),
  mysteryBoxRepository: asClass(MysteryBoxSequelizeRepository).scoped(),
  mysteryBoxTypeRepository: asClass(MysteryBoxTypeSequelizeRepository).scoped(),
  gameProviderRepository: asClass(KinguinRepository).scoped(),
  categoryRepository: asClass(CategorySequelizeRepository).scoped(),
  platformRepository: asClass(PlatformSequelizeRepository).scoped(),
  gamePlatformAccountGamesRepository: asClass(
    SteamAccountReferenceGamesSequelizeRepository
  ).scoped(),
  platformAccountReporitory: asClass(SteamAccountSequelizeRepository).scoped(),
  externalGamePlatformRepository: asClass(SteamGamePlatformRepository).scoped(),

  // ---------------- USE CASES ----------------
  searchMysteryBoxMatchesUseCase: asClass(
    SearchMysteryBoxMatchesUseCase
  ).scoped(),

  // ---------------- CONTROLLERS ----------------
  mysteryBoxController: asClass(MysteryBoxController).scoped(),
});

module.exports = DIContainer;
