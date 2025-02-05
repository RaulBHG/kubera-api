import axios from "axios";
import { ExternalGamePlatformRepositoryContract } from "../../domain/contracts/game-platform/ExternalGamePlatformRepositoryContract";
import { GamePlatformAccount } from "../../domain/entities/GamePlatformAccount";
import { GamePlatformAccountGame } from "../../domain/entities/GamePlatformAccountGame";
import { PinoLoggerAdapter } from "../adapters/log/PinoLoggerAdapter";
import { LogLevel } from "../../domain/value-objects/LogLevel";
import { MysteryBox } from "../../domain/entities/MysteryBox";
import { MysteryBoxRoll } from "../../domain/entities/MysteryBoxRoll";
import { Op } from "sequelize";
import { Category } from "../../domain/entities/Category";
import { MysteryBoxType } from "../../domain/entities/MysteryBoxType";

const CategoryModel = require("../../../models").category;

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

  async getMysteryBoxRollOption(
    mysteryBox: MysteryBox,
    referenceGames: GamePlatformAccountGame[],
    euroAmount: number
  ): Promise<MysteryBoxRoll> {
    const categories = mysteryBox.getCategories();
    const platforms = mysteryBox.getPlatforms();
    const region = mysteryBox.getRegion();
    const referenceGamesGategories = [
      ...new Set(
        referenceGames.flatMap((game) => this.getGameCategories(game))
      ),
    ];
    const allowedGames = await this.requestAllowedGames(
      mysteryBox.getType(),
      categories,
      region ?? "",
      euroAmount
    );

    // TODO: TIENES QUE DEVOLVER ALLOWEDGAMES CON SUS REFERENTES CATEGORÍAS
    // TODO: PENDIENTE BUSCAR DE LOS ENCONTRADOS PRIORIZAR LOS QUE CONTENGAN ALGUNA CATEGORÍA DE LAS YA GUSTADAS
  }

  private async getGameCategories(
    game: GamePlatformAccountGame
  ): Promise<Category[]> {
    return await axios
      .get(`${process.env.STEAM_SPY_URL}`, {
        params: {
          request: "appdetails",
          appid: game.getPlatformGameId(),
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
          const tags: String[] = Object.keys(response.data.tags);
          const bbddCategories = CategoryModel.findAll({
            where: {
              name: {
                [Op.in]: tags,
              },
            },
          });

          return bbddCategories.map(
            (category: any) =>
              new Category(
                category.id,
                category.slug,
                category.name,
                category.external_id,
                category.visible
              )
          );
        } else {
          throw new Error(
            "Unexpected status code " +
              response.status +
              " for getAccountByUserId with response " +
              JSON.stringify(response.data)
          );
        }
      });
  }

  private async requestAllowedGames(
    mysteryBoxType: MysteryBoxType | null,
    categories: Category[] | null,
    region: string,
    euroAmount: number
  ): Promise<any[]> {
    // The maximum amount of games to request is 10000
    const maxGamesToRequest = Number(process.env.MAX_GAMES_TO_REQUEST ?? 10000);
    // The start index to request the games
    let start = 0;
    let items: any[] = [];

    // Request games until the items array has the maxGamesToRequest length
    while (items.length < maxGamesToRequest) {

      const query = JSON.stringify({
        query: {
          start: start.toString(),
          count: (maxGamesToRequest - items.length).toString(),
          filters: {
            regional_top_n_sellers: "30000",
            global_top_n_sellers: "50000",
            released_only: true,
            price_filters: { exclude_free_items: true },
            type_filters: {
              include_apps: "",
              include_packages: "",
              include_bundles: "",
              include_games: true,
              include_demos: "",
              include_mods: "",
              include_dlc: "",
              include_software: "",
              include_video: "",
              include_hardware: "",
              include_series: "",
              include_music: "",
            },
            tagids_must_match: [
              {
                tagids: categories?.map((category) => category.getExternalId()),
              },
            ],
          },
        },
        context: {
          language: "",
          country_code: region,
        },
        data_request: {
          include_ratings: false,
          include_basic_info: false,
        },
      });

      const response = await axios.get(
        `${process.env.STEAM_API_URL}/IStoreQueryService/Query/v1`,
        {
          params: {
            key: process.env.STEAM_API_KEY,
            query: query,
          },
        }
      );

      this.logger.log("requested", {
        context: "requestGames",
        attributes: {
          status: response.status,
        },
      });

      if (response.status === 200) {

        // Filter the steam response to get only the games that match the criteria
        const newItems = response.data.store_items.filter((item: any) => {

          // A valid name is only composed by letters and spaces and doesn't end with a number
          const itemName = item.name;
          const isValidName =
            /^[a-zA-Z\s]+$/.test(itemName) && !/\s\d$/.test(itemName);

          // Check if the price is valid
          const price = item.best_purchase_option.original_price_in_cents / 100;
          const availableAmount =
            euroAmount * (mysteryBoxType?.getMultiplier() ?? 1);
          const amountToGet2Games = Number(process.env.AMOUNT_TO_GET_2_GAMES);
          const isPriceValid =
            price <= availableAmount &&
            ((availableAmount < amountToGet2Games &&
              price >= 0.95 * availableAmount) ||
              (availableAmount >= amountToGet2Games &&
                price >= 0.3 * availableAmount));

          // Check if the game has enough valorations
          return (
            isValidName && isPriceValid && this.checkGameValorations(item.id)
          );

        });

        // Add the new items to the items array
        items = items.concat(newItems);

        // If the total of items requested is greater than the total of items available, break the loop
        const totalMatchingRecords =
          response.data.metadata.total_matching_records;
        if (start + newItems.length >= totalMatchingRecords) break;
        
        start += newItems.length;

      } else {
        throw new Error(
          "Unexpected status code " +
            response.status +
            " for getAccountByUserId with response " +
            JSON.stringify(response.data)
        );
      }
    }

    return items;
  }


  private async checkGameValorations(gameExternalId: number): Promise<boolean> {
    return await axios
      .get(`${process.env.STEAM_SPY_URL}`, {
        params: {
          request: "appdetails",
          appid: gameExternalId,
        },
      })
      .then((response) => {
        this.logger.log("requested", {
          context: "checkGameValorations",
          attributes: {
            status: response.status,
          },
        });
        if (response.status === 200) {
          const data = response.data;
          const minOwners = Number(response.data.owners.split(" .. ")[0] ?? 0);
          // Check if at least the 80% of the reviews are positive and if has more than 50000 downloads
          return (
            data.positive > 0.8 * (data.positive + data.negative) &&
            minOwners > Number(process.env.MIN_GAME_OWNERS)
          );
        } else {
          return false;
        }
      });
  }
}
