import { GamePlatformAccountGame } from "../../entities/GamePlatformAccountGame";

export interface GamePlatformAccountGamesRepositoryContract {
  createMultiple(games: GamePlatformAccountGame[]): Promise<boolean>;
}
