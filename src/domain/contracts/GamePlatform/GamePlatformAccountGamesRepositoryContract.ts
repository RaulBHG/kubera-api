import { GamePlatformAccountGame } from "../../entities/GamePlatformAccountGame";

export interface GamePlatformAccountGamesRepositoryContract {
  create(): Promise<GamePlatformAccountGame>;
}
