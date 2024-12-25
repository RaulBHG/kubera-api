import { GamePlatformAccount } from "../../entities/GamePlatformAccount";

export interface GamePlatformAccountRepositoryContract {
  create(): Promise<GamePlatformAccount>;
}