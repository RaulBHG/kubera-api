import { GamePlatformAccountRepositoryContract } from "../../domain/contracts/game-platform/GamePlatformAccountRepositoryContract";
import { GamePlatformAccount } from "../../domain/entities/GamePlatformAccount";
import { Uuid } from "../../domain/value-objects/Uuid";

const AccountModel = require("../../../models").steam_account;

export class SteamAccountSequelizeRepository implements GamePlatformAccountRepositoryContract {
  async create(
    gamePlatformAccount: GamePlatformAccount
  ): Promise<GamePlatformAccount> {
    const newAccount = await AccountModel.create({
      id: gamePlatformAccount.id?.getValue() ?? Uuid.create().getValue(),
      user_id: gamePlatformAccount.userId,
      steam_username: gamePlatformAccount.platformUsername,
      steam_userid: gamePlatformAccount.userId,
    });

    return new GamePlatformAccount(
      newAccount.id,
      newAccount.user_id,
      newAccount.steam_username,
      newAccount.steam_userid
    );
  }

  async getByUserId(userId: Uuid): Promise<GamePlatformAccount | null> {
    const account = await AccountModel.findOne({
      where: {
        user_id: userId.getValue(),
      },
    });
    if (!account) {
      return null;
    }

    return new GamePlatformAccount(
      account.id,
      account.user_id,
      account.steam_username,
      account.steam_userid
    );
  }
}
