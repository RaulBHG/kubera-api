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
import { Uuid } from "../../domain/value-objects/Uuid";
import { GameProviderGame } from "../../domain/entities/GameProviderGame";
import { SteamAccountReferenceGamesSequelizeRepository } from "./SteamAccountReferenceGamesSequelizeRepository";
import { GameProviderRepositoryContract } from "../../domain/contracts/GameProviderRepositoryContract";

const CategoryModel = require("../../../models").category;

export class SteamGamePlatformRepository
  implements ExternalGamePlatformRepositoryContract
{
  constructor(
    private logger: PinoLoggerAdapter,
  ) {}

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

  async getAvailableGameProviderGame(
    mysteryBox: MysteryBox,
    referenceGames: GamePlatformAccountGame[],
    euroAmount: number
  ): Promise<GameProviderGame[]> {
    // Get the price of the mystery box
    euroAmount = euroAmount * (mysteryBox.getType()?.getMultiplier() ?? 1);

    const shuffle = (array: any[]): any[] => {
      let currentIndex = array.length;

      // While there remain elements to shuffle...
      while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    };

    const categories = mysteryBox.getCategories();
    const region = mysteryBox.getRegion();

    // ! BUSCAR LISTADO CATEGORÍAS STEAM, SI YA EXISTE EN MEMORIA NO HACER LA PETICIÓN 
    const referenceGamesCategories = [
      ...new Set(
        (
          await Promise.all(
            referenceGames.map(async (game, index: number) => {
              await this.delay(1000 * index);
              const categories = await this.getGameCategories(
                game.getPlatformGameId()
              );
              return categories.map((category) => JSON.stringify(category));
            })
          )
        ).flat()
      ),
    ].map((categoryStr) => JSON.parse(categoryStr));


    // ! QUITAR STEAMSPY. MODIFICAR MODELOS PARA QUE JUEGOS DE REFERENCIA ALMACENEN YA EL TAG
    // ! CRUZAR JUEGO QUE GUSTAN CON SUS CATEGORÍAS EN STEAM /3 SOLICITUDES POR SEGUNDO

    // ! Los que ya tiene no los tiene que guardar como allowed, los juegos que ya tiene los ignora
    // ! Quiero que la respuesta de este método una vez se haga no la vuelva a hacer durante la misma ejecución
    // ! Tiene que validar por juegos de hace menos de tantos años url para ver -> https://store.steampowered.com/api/appdetails?appids=2672570
    const allowedGames = shuffle(
      await this.requestAllowedGames(
        mysteryBox.getType(),
        categories,
        region ?? "",
        euroAmount
      )
    );

    // Filter the games that have at least one category in common with the reference games
    const matchedWithReference = shuffle(
      allowedGames.filter((game) => {
        const gameCategories = game.categories;
        return gameCategories.some((category: Category) =>
          referenceGamesCategories.includes(category)
        );
      })
    );
  }

  async getMysteryBoxRollOption(
    mysteryBox: MysteryBox,
    gameProviderGames: GameProviderGame[],
    euroAmount: number
  ): Promise<MysteryBoxRoll> {

    // If the amount of games that match with the reference games is less than the 40% of the total amount of games requested
    // get the 20 games at least without matching with the reference games
    const minimumGames = 20;
    const minimumPercentage = 40;
    const requiredGamesCount = Math.max(
      minimumGames,
      Math.ceil(allowedGames.length * (minimumPercentage / 100))
    );

    const finalGames =
      matchedWithReference.length >= requiredGamesCount
        ? matchedWithReference.slice(0, requiredGamesCount)
        : allowedGames.slice(0, requiredGamesCount);

    const mysteryBoxRollId = Uuid.create();

    // Get a random game or 2 games from the final games
    const randomGame =
      finalGames[Math.floor(Math.random() * finalGames.length)];
    const gamePrice = randomGame.gameData.price;

    const gameProciderGames = [
      new GameProviderGame(
        Uuid.create(),
        mysteryBoxRollId,
        randomGame.gameData.name,
        gamePrice,
        null,
        null,
        null,
        null
      ),
    ];
    // If the price of the game is less than the min of the euro amount, get a second game
    if (
      gamePrice <
      euroAmount * Number(process.env.MIN_AMOUNT_PERCENTAGE_FOR_1_GAME)
    ) {
      const secondRandomGame = finalGames.find(
        (game) =>
          game.gameData.id !== randomGame.gameData.id &&
          game.gameData.price <= euroAmount - gamePrice
      );
      if (secondRandomGame) {
        gameProciderGames.push(
          new GameProviderGame(
            Uuid.create(),
            mysteryBoxRollId,
            secondRandomGame.gameData.name,
            secondRandomGame.gameData.price,
            null,
            null,
            null,
            null
          )
        );
      }
    }

    return new MysteryBoxRoll(
      mysteryBoxRollId,
      mysteryBox.getId(),
      false,
      false,
      false,
      null,
      gameProciderGames
    );
  }


  // ---------------------------- PRIVATE METHODS ----------------------------

  private async requestAllowedGames(
    mysteryBoxType: MysteryBoxType | null,
    categories: Category[] | null,
    region: string,
    euroAmount: number
  ): Promise<
    {
      gameData: {
        id: number;
        name: string;
        price: number;
      };
      categories: Category[];
    }[]
  > {
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
          country_code: region ?? "ES",
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

          const amountToGet2Games = Number(process.env.AMOUNT_TO_GET_2_GAMES);

          const isPriceValid =
            price <= euroAmount &&
            ((euroAmount < amountToGet2Games &&
              price >=
                (Number(process.env.MIN_AMOUNT_PERCENTAGE_FOR_1_GAME) / 100) *
                  euroAmount) ||
              (euroAmount >= amountToGet2Games &&
                price >=
                  (Number(process.env.MIN_AMOUNT_PERCENTAGE_FOR_1_GAME) / 100) *
                    euroAmount));

          //!OIJSDOIAS
              const data = response.data;
              const minOwners = Number(
                response.data.owners.split(" .. ")[0] ?? 0
              );
              // Check if at least the 80% of the reviews are positive and if has more than 50000 downloads
              return (
                data.positive > 0.8 * (data.positive + data.negative) &&
                minOwners > Number(process.env.MIN_GAME_OWNERS)
                //!OIJSDOIAS
                
          return (
            isValidName && isPriceValid && this.checkGameValorations(item.id)
          );
        });

        // Add the new items to the items array
        items = items.concat(
          await Promise.all(
            newItems.map(async (item: any, index: number) => {
              await this.delay(1000 * index);
              
              //!OIJSDOIAS
              const data = response.data;
              const minOwners = Number(
                response.data.owners.split(" .. ")[0] ?? 0
              );
              // Check if at least the 80% of the reviews are positive and if has more than 50000 downloads
              return (
                data.positive > 0.8 * (data.positive + data.negative) &&
                minOwners > Number(process.env.MIN_GAME_OWNERS)
                //!OIJSDOIAS
                

              return {
              gameData: {
                id: item.id,
                name: item.name,
                price: item.best_purchase_option.original_price_in_cents / 100,
              },
              categories: await this.getGameCategories(item.id),
            }})
          )
        );

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

  private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
}
