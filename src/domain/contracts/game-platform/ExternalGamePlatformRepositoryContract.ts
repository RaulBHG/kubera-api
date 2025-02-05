import { GamePlatformAccount } from "../../entities/GamePlatformAccount";
import { GamePlatformAccountGame } from "../../entities/GamePlatformAccountGame";
import { MysteryBox } from "../../entities/MysteryBox";
import { MysteryBoxRoll } from "../../entities/MysteryBoxRoll";

export interface ExternalGamePlatformRepositoryContract {
  getAccountByUserId(userId: string): Promise<GamePlatformAccount | null>;
  getAccountByUserName(userName: string): Promise<GamePlatformAccount | null>;
  getAccountReferenceGamesByAccount(
    account: GamePlatformAccount,
    limit:number
  ): Promise<GamePlatformAccountGame[] | null>;

  getMysteryBoxRollOption(
    mysteryBox: MysteryBox,
    referenceGames: GamePlatformAccountGame[],
    euroAmount: number
  ): Promise<MysteryBoxRoll>;
}