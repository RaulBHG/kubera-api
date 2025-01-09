import axios from "axios";
import { ExternalGamePlatformRepositoryContract } from "../../domain/contracts/GamePlatform/ExternalGamePlatformRepositoryContract";
import { GamePlatformAccount } from "../../domain/entities/GamePlatformAccount";
import { GamePlatformAccountGame } from "../../domain/entities/GamePlatformAccountGame";

export class SteamGamePlatformRepository
  implements ExternalGamePlatformRepositoryContract
{
  async getAccountByUserId(
    userId: string
  ): Promise<GamePlatformAccount | null> {
    console.log("getAccountByUserId");
    return await axios
      .get(`${process.env.STEAM_API_URL}/IPlayerService/GetOwnedGames/v1`, {
        params: {
          key: process.env.STEAM_API_KEY,
          steamid: userId,
          include_appinfo: false,
          include_played_free_games: false,
        },
      })
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          return new GamePlatformAccount(null, null, null, userId);
        } else {
          console.error(`Unexpected response status: ${response.status}`);
          return null;
        }
      })
      .catch(function (error) {
        console.log(error);
        return null;
      });
  }

  async getAccountByUserName(
    userName: string
  ): Promise<GamePlatformAccount | null> {
    console.log("getAccountByUserName");
    const userId = await axios
      .get(`${process.env.STEAM_API_URL}/ISteamUser/ResolveVanityURL/v1`, {
        params: {
          key: process.env.STEAM_API_KEY,
          vanityurl: userName,
        },
      })
      .then(function (response) {
        console.log(response);
        if (response.status === 200 && response.data?.response?.success === 1) {
          return response.data.response.steamid;
        } else {
          console.error(`Unexpected response status: ${response.status}`);
          return null;
        }
      })
      .catch(function (error) {
        console.log(error);
        return null;
      });

    if (userId && (await this.getAccountByUserId(userId))) {
      return new GamePlatformAccount(null, null, userName, userId);
    } else {
      return null;
    }
  }

  async getAccountReferenceGamesByAccount(
    account: GamePlatformAccount,
    limit: number
  ): Promise<GamePlatformAccountGame[] | null> {
    console.log("getAccountReferenceGamesByAccount");
    return await axios
      .get(`${process.env.STEAM_API_URL}/IPlayerService/GetOwnedGames/v1`, {
        params: {
          key: process.env.STEAM_API_KEY,
          steamid: account.getPlatformUserId(),
          include_appinfo: true,
          include_played_free_games: true,
        },
      })
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          return response.data.response.games
            .sort((gameA: any, gameB: any) => {
              if (
                (gameB.playtime_2weeks ?? 0) !== (gameA.playtime_2weeks ?? 0)
              ) {
                return (
                  (gameB.playtime_2weeks ?? 0) - (gameA.playtime_2weeks ?? 0)
                );
              }
              return gameB.playtime_forever - gameA.playtime_forever;
            })
            .slice(0, limit)
            .map((game: any) => {
              return new GamePlatformAccountGame(
                null,
                account.getId()!,
                game.appid,
                game.name,
                game.playtime_2weeks ?? null,
                game.playtime_forever
              );
            });
        } else {
          console.error(`Unexpected response status: ${response.status}`);
          return null;
        }
      })
      .catch(function (error) {
        console.log(error);
        return null;
      });
  }
}
