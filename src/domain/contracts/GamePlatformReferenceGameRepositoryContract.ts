import { Category } from "../entities/Category";
import { GamePlatformAccountGame } from "../entities/GamePlatformAccountGame";
import { GameProviderGame } from "../entities/GameProviderGame";
import { Uuid } from "../value-objects/Uuid";

export interface GamePlatformReferenceGameRepositoryContract {
  getByUserId(userId: Uuid): Promise<GamePlatformAccountGame[] | null>;
  getGamesCategories(games: GamePlatformAccountGame[]): Promise<Category[] | null>;
  checkIfIsValidGameCombination(games: GameProviderGame[]): Promise<boolean>
}