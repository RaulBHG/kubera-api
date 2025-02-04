import { GamePlatformAccountRepositoryContract } from "../../domain/contracts/game-platform/GamePlatformAccountRepositoryContract";
import { GamePlatformAccount } from "../../domain/entities/GamePlatformAccount";
import { Uuid } from "../../domain/value-objects/Uuid";

const AccountModel = require("../../../models").steam_account;

export class SteamAccountSequelizeRepository implements GamePlatformAccountRepositoryContract {
  async create(
    gamePlatformAccount: GamePlatformAccount
  ): Promise<GamePlatformAccount> {
    const newAccount = await AccountModel.create({
      id: gamePlatformAccount.getId()?.getValue() ?? Uuid.create().getValue(),
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
