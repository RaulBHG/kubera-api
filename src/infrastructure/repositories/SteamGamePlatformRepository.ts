import axios from "axios";
import { ExternalGamePlatformRepositoryContract } from "../../domain/contracts/game-platform/ExternalGamePlatformRepositoryContract";
import { GamePlatformAccount } from "../../domain/entities/GamePlatformAccount";
import { GamePlatformAccountGame } from "../../domain/entities/GamePlatformAccountGame";
import { PinoLoggerAdapter } from "../adapters/log/PinoLoggerAdapter";
import { LogLevel } from "../../domain/value-objects/LogLevel";

export class SteamGamePlatformRepository
  implements ExternalGamePlatformRepositoryContract
{
  constructor(private logger: PinoLoggerAdapter) {}

  async getAccountByUserId(
    userId: string
  ): Promise<GamePlatformAccount | null> {
    return await axios
      .get(`${process.env.STEAM_API_URL}/IPlayerService/GetOwnedGames/v1`, {
        params: {
          key: process.env.STEAM_API_KEY,
          steamid: userId,
          include_appinfo: false,
          include_played_free_games: false,
        },
      })
      .then((response) => {
        this.logger.log("requested", {
          context: "getAccountByUserId",
          attributes: {
            status: response.status,
          },
        });
        if (response.status === 200) {
          return new GamePlatformAccount(null, null, null, userId);
        } else {
          this.logger.log("unexpected status code", {
            level: LogLevel.ERROR,
            context: "getAccountByUserId",
            attributes: {
              status: response.status,
            },
          });
          return null;
        }
      })
      .catch((error) => {
        this.logger.log("fatal error", {
          level: LogLevel.FATAL,
          context: "getAccountByUserId",
          attributes: {
            message: error.message,
            stack: error.stack,
          },
        });
        return null;
      });
  }

  async getAccountByUserName(
    userName: string
  ): Promise<GamePlatformAccount | null> {
    const userId = await axios
      .get(`${process.env.STEAM_API_URL}/ISteamUser/ResolveVanityURL/v1`, {
        params: {
          key: process.env.STEAM_API_KEY,
          vanityurl: userName,
        },
      })
      .then((response) => {
        this.logger.log("requested", {
          context: "getAccountByUserName",
          attributes: {
            status: response.status,
          },
        });
        if (response.status === 200 && response.data?.response?.success === 1) {
          return response.data.response.steamid;
        } else {
          this.logger.log("unexpected status code", {
            level: LogLevel.ERROR,
            context: "getAccountByUserName",
            attributes: {
              status: response.status,
            },
          });
          return null;
        }
      })
      .catch((error) => {
        this.logger.log("fatal error", {
          level: LogLevel.FATAL,
          context: "getAccountByUserName",
          attributes: {
            message: error.message,
            stack: error.stack,
          },
        });
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
    return await axios
      .get(`${process.env.STEAM_API_URL}/IPlayerService/GetOwnedGames/v1`, {
        params: {
          key: process.env.STEAM_API_KEY,
          steamid: account.getPlatformUserId(),
          include_appinfo: true,
          include_played_free_games: true,
        },
      })
      .then((response) => {
        this.logger.log("requested", {
          context: "getAccountReferenceGamesByAccount",
          attributes: {
            status: response.status,
          },
        });
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
          this.logger.log("unexpected satus code", {
            level: LogLevel.ERROR,
            context: "getAccountReferenceGamesByAccount",
            attributes: {
              status: response.status,
            },
          });
          return null;
        }
      })
      .catch((error) => {
        this.logger.log("fatal error", {
          level: LogLevel.FATAL,
          context: "getAccountReferenceGamesByAccount",
          attributes: {
            message: error.message,
            stack: error.stack,
          },
        });
        return null;
      });
  }
}
