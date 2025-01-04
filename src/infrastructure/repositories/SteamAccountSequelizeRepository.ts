import { GamePlatformAccountRepositoryContract } from "../../domain/contracts/GamePlatform/GamePlatformAccountRepositoryContract";
import { GamePlatformAccount } from "../../domain/entities/GamePlatformAccount";

const AccountModel = require("../../../models").steam_account;

export class SteamAccountSequelizeRepository implements GamePlatformAccountRepositoryContract {
  async create(
    gamePlatformAccount: GamePlatformAccount
  ): Promise<GamePlatformAccount> {
    const newAccount = await AccountModel.create({
      id: gamePlatformAccount.getId()?.getValue(),
      user_id: gamePlatformAccount.getUserId(),
      steam_username: gamePlatformAccount.getPlatformUsername(),
      steam_userid: gamePlatformAccount.getPlatformUserId(),
    });

    return new GamePlatformAccount(
      newAccount.id,
      newAccount.user_id,
      newAccount.steam_username,
      newAccount.steam_userid
    );
  }
}
