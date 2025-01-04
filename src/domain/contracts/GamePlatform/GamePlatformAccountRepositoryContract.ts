import { GamePlatformAccount } from "../../entities/GamePlatformAccount";

export interface GamePlatformAccountRepositoryContract {
  create(
    gamePlatformAccount: GamePlatformAccount
  ): Promise<GamePlatformAccount>;
}