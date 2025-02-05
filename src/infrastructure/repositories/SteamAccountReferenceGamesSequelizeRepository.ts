import { GamePlatformAccountGamesRepositoryContract } from "../../domain/contracts/game-platform/GamePlatformAccountGamesRepositoryContract";
import { GamePlatformAccountGame } from "../../domain/entities/GamePlatformAccountGame";
import { Uuid } from "../../domain/value-objects/Uuid";

const AccountModel =
  require("../../../models").steam_account;
const AccountGameModel =
  require("../../../models").steam_account_reference_game;

export class SteamAccountReferenceGamesSequelizeRepository
  implements GamePlatformAccountGamesRepositoryContract
{
  async createMultiple(games: GamePlatformAccountGame[]): Promise<boolean> {
    const newGames = await AccountGameModel.bulkCreate(
      games.map((game) => ({
        id: game.getId()?.getValue() ?? Uuid.create().getValue(),
        steam_account_id: game.getPlatformAccountId(),
        steam_game_id: game.getPlatformGameId(),
        name: game.getName(),
        playtime_2_weeks: game.getPlaytime2Weeks(),
        playtime_forever: game.getPlaytimeForever(),
      }))
    );

    return newGames.length === games.length;
  }

  async getAccountGamesByUserId(userId: Uuid): Promise<GamePlatformAccountGame[]> {
    const account = await AccountModel.findOne({
      include: [{ association: "steam_account_reference_games" }],
      where: {
        user_id: userId.getValue(),
      },
    });
    if(!account) return [];
    const games = account.steam_account_reference_games;

    return games.map((game: any) => {
      return new GamePlatformAccountGame(
        new Uuid(game.id),
        new Uuid(game.steam_account_id),
        game.steam_game_id,
        game.name,
        game.playtime_2_weeks,
        game.playtime_forever
      );
    });
  }
}
