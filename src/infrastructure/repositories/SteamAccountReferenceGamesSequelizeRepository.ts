import { GamePlatformAccountGamesRepositoryContract } from "../../domain/contracts/GamePlatform/GamePlatformAccountGamesRepositoryContract";
import { GamePlatformAccountGame } from "../../domain/entities/GamePlatformAccountGame";

const AccountGameModel = require("../../../models").steam_account_reference_game;

export class SteamAccountReferenceGamesSequelizeRepository
  implements GamePlatformAccountGamesRepositoryContract
{
  async createMultiple(games: GamePlatformAccountGame[]): Promise<boolean> {
    const newGames = await AccountGameModel.bulkCreate(
      games.map((game) => ({
        id: game.getId()?.getValue(),
        steam_account_id: game.getPlatformAccountId(),
        steam_game_id: game.getPlatformGameId(),
        name: game.getName(),
        playtime_2_weeks: game.getPlaytime2Weeks(),
        playtime_forever: game.getPlaytimeForever(),
      }))
    );

    return newGames.length === games.length;
  }
}
