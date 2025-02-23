import { GamePlatformAccountGame } from "../../entities/GamePlatformAccountGame";
import { Uuid } from "../../value-objects/Uuid";

export interface GamePlatformAccountGamesRepositoryContract {
  createMultiple(games: GamePlatformAccountGame[]): Promise<boolean>;
  getAccountGamesByUserId(userId: Uuid): Promise<GamePlatformAccountGame[]>;
}
