import { GamePlatformAccount } from "../../entities/GamePlatformAccount";
import { GamePlatformAccountGame } from "../../entities/GamePlatformAccountGame";
import { GameProviderGame } from "../../entities/GameProviderGame";
import { MysteryBox } from "../../entities/MysteryBox";
import { MysteryBoxRoll } from "../../entities/MysteryBoxRoll";
import { Uuid } from "../../value-objects/Uuid";

export interface ExternalGamePlatformRepositoryContract {
  getAccountBySteamUserId(userId: string): Promise<GamePlatformAccount | null>;
  getAccountByUserName(userName: string): Promise<GamePlatformAccount | null>;
  getAccountReferenceGamesByAccount(
    account: GamePlatformAccount,
    limit: number
  ): Promise<GamePlatformAccountGame[] | null>;

  getAvailableGameProviderGames(
    userId: Uuid,
    mysteryBox: MysteryBox,
    referenceGames: GamePlatformAccountGame[],
    euroAmount: number
  ): Promise<{
    allowedGames: GameProviderGame[];
    matchedWithReferenceGames: GameProviderGame[];
  }>;

  getMysteryBoxRollOption(
    mysteryBox: MysteryBox,
    games: GameProviderGame[],
    matchedWithReferenceGames: GameProviderGame[],
    euroAmount: number
  ): Promise<MysteryBoxRoll>;
}