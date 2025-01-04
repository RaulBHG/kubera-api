import { GamePlatformAccount } from "../../entities/GamePlatformAccount";
import { GamePlatformAccountGame } from "../../entities/GamePlatformAccountGame";

export interface ExternalGamePlatformRepositoryContract {
  getAccountByUserId(userId: string): Promise<GamePlatformAccount | null>;
  getAccountByUserName(userName: string): Promise<GamePlatformAccount | null>;
  getAccountReferenceGamesByAccount(
    account: GamePlatformAccount,
    limit:number
  ): Promise<GamePlatformAccountGame[] | null>;
}