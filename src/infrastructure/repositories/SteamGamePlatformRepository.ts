import axios from "axios";
import { ExternalGamePlatformRepositoryContract } from "../../domain/contracts/GamePlatform/ExternalGamePlatformRepositoryContract";
import { GamePlatformAccount } from "../../domain/entities/GamePlatformAccount";

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
          vanityurl: "EnderProyects",
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

    if (userId && await this.getAccountByUserId(userId)) {
      return new GamePlatformAccount(null, null, userName, userId);
    } else {
      return null;
    }
  }

  async getAccountReferenceGamesByAccount(
    account: GamePlatformAccount,
    limit: number
  ): Promise<GamePlatformAccount[] | null> {
    console.log("getAccountReferenceGamesByAccount");
    return null;
  }
}
