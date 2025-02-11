import axios, { all } from "axios";
import { ExternalGamePlatformRepositoryContract } from "../../domain/contracts/game-platform/ExternalGamePlatformRepositoryContract";
import { GamePlatformAccount } from "../../domain/entities/GamePlatformAccount";
import { GamePlatformAccountGame } from "../../domain/entities/GamePlatformAccountGame";
import { PinoLoggerAdapter } from "../adapters/log/PinoLoggerAdapter";
import { LogLevel } from "../../domain/value-objects/LogLevel";
import { MysteryBox } from "../../domain/entities/MysteryBox";
import { MysteryBoxRoll } from "../../domain/entities/MysteryBoxRoll";
import { Category } from "../../domain/entities/Category";
import { Uuid } from "../../domain/value-objects/Uuid";
import { GameProviderGame } from "../../domain/entities/GameProviderGame";
import { CategorySequelizeRepository } from "./CategorySequelizeRepository";
import { SteamAccountSequelizeRepository } from "./SteamAccountSequelizeRepository";

export class SteamGamePlatformRepository
  implements ExternalGamePlatformRepositoryContract
{
  constructor(
    private categoryRepository: CategorySequelizeRepository,
    private platformAccountReporitory: SteamAccountSequelizeRepository,
    private logger: PinoLoggerAdapter
  ) {}

  async getAccountBySteamUserId(
    userId: string
  ): Promise<GamePlatformAccount | null> {
    const accountGamesResponse = await this.requestAccountGames(userId, false);

    if (accountGamesResponse.status === 200)
      return new GamePlatformAccount(null, null, null, userId);

    this.logger.log("unexpected status code", {
      level: LogLevel.ERROR,
      context: "getAccountBySteamUserId",
      attributes: {
        status: accountGamesResponse.status,
      },
    });
    return null;
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

    if (userId && (await this.getAccountBySteamUserId(userId))) {
      return new GamePlatformAccount(null, null, userName, userId);
    } else {
      return null;
    }
  }

  async getAccountReferenceGamesByAccount(
    account: GamePlatformAccount,
    limit: number
  ): Promise<GamePlatformAccountGame[] | null> {
    const accountGamesResponse = await this.requestAccountGames(
      account.getPlatformUserId(),
      true
    );

    if (accountGamesResponse.status === 200) {
      return accountGamesResponse.data.response.games
        .sort((gameA: any, gameB: any) => {
          if ((gameB.playtime_2weeks ?? 0) !== (gameA.playtime_2weeks ?? 0)) {
            return (gameB.playtime_2weeks ?? 0) - (gameA.playtime_2weeks ?? 0);
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
    }

    this.logger.log("unexpected satus code", {
      level: LogLevel.ERROR,
      context: "getAccountReferenceGamesByAccount",
      attributes: {
        status: accountGamesResponse.status,
      },
    });

    return null;
  }

  async getAvailableGameProviderGames(
    userId: Uuid,
    mysteryBox: MysteryBox,
    referenceGames: GamePlatformAccountGame[],
    euroAmount: number
  ): Promise<{
    allowedGames: GameProviderGame[];
    matchedWithReferenceGames: GameProviderGame[];
  }> {
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

    const referenceGamesSteamCategoriesIds = [
      ...new Set(
        (
          await Promise.all(
            referenceGames.flatMap(async (game, index: number) => {
              // TODO: No tener que añadir delay
              await this.delay(333 * index); // 3 requests per second
              const steamCategoriesIds = await this.getGameSteamCategoriesIds(
                game.getPlatformGameId()
              );
              return steamCategoriesIds.flat();
            })
          )
        ).flat()
      ),
    ];

    const allowedGames = shuffle(
      await this.requestAllowedGames(
        await this.requestAccountGameIds(userId),
        categories,
        region ?? "",
        euroAmount
      )
    );

    // Filter the games that have at least one category in common with the reference games
    const matchedWithReferenceGames = shuffle(
      allowedGames.filter((game) => {
        const steamCategories: string[] = game.gameSteamCategories;
        let minMatchNumber = Number(
          process.env.ON_CATEGORIES_NUMBER_TO_MATCH_STEAM ?? 1
        );
        if (!categories || !categories.length) {
          minMatchNumber = Number(
            process.env.ON_EMPTY_CATEGORIES_NUMBER_TO_MATCH_STEAM ?? 1
          );
        }

        return (
          steamCategories.filter((category: string) =>
            referenceGamesSteamCategoriesIds.includes(category)
          ).length >=
          Number(process.env.ON_EMPTY_CATEGORIES_NUMBER_TO_MATCH_STEAM)
        );
      })
    );

    // Remove matchedWithReferenceGames from allowedGames
    const filteredAllowedGames = allowedGames.filter(
      (game) => !matchedWithReferenceGames.includes(game)
    );

    return {
      allowedGames: filteredAllowedGames.map((game) => game.gameProviderGame),
      matchedWithReferenceGames:
        matchedWithReferenceGames.length > 50
          ? matchedWithReferenceGames.map((game) => game.gameProviderGame)
          : [], // At least 100 games
    };
  }

  async getMysteryBoxRollOption(
    mysteryBox: MysteryBox,
    games: GameProviderGame[],
    matchedWithReferenceGames: GameProviderGame[],
    euroAmount: number
  ): Promise<MysteryBoxRoll> {
    // If the amount of games that match with the reference games is less than the 40% of the total amount of games requested
    // get the 20 games at least without matching with the reference games
    const minimumGames = 50;
    const maxGames = 700;
    const minimumPercentage = 40;
    const calculatedGames = Math.ceil(games.length * (minimumPercentage / 100));
    const requiredGamesCount = Math.max(
      minimumGames,
      Math.min(calculatedGames, maxGames)
    );

    let finalGames = matchedWithReferenceGames.slice(0, maxGames);

    // If the amount of games that match with the reference games is less than the 40% of the total amount of games requested
    if (finalGames.length < requiredGamesCount) {
      // Get the games that don't match with the reference games
      const additionalGames = games.filter(
        (game) =>
          !finalGames.some((finalGame) => finalGame.getId() === game.getId())
      );
      // Concat the games that don't match with the reference games to the final games
      finalGames = finalGames.concat(
        additionalGames.slice(0, requiredGamesCount - finalGames.length)
      );
    }

    const mysteryBoxRollId = Uuid.create();
    let totalPrice = 0;
    let gameProviderGames: GameProviderGame[] = [];
    let totalLoops = 0;

    while (
      totalPrice <
      euroAmount * (Number(process.env.MIN_AMOUNT_PERCENTAGE ?? 90) / 100) &&
      totalLoops < 500
    ) {
      totalLoops++;
      // Get a random game or 2 games from the final games
      const randomGame =
        finalGames[Math.floor(Math.random() * finalGames.length)];
      if (!randomGame || !randomGame.getGamePlatformPrice()) {
        throw new Error("No games found");
      }

      const gamePrice = randomGame.getGamePlatformPrice() ?? 0;
      
      if (
        totalPrice + gamePrice >= euroAmount ||
        gameProviderGames.some((game) => game.getName() === randomGame.getName())
      ) {
        break;
      }

      gameProviderGames.push(
        new GameProviderGame(
          Uuid.create(), // id
          mysteryBoxRollId, // mysteryBoxRollId
          randomGame.getName(), // name
          randomGame.getImgUrl(), // imgUrl
          randomGame.getRegion(), // region
          randomGame.getPlatform(), // platform
          randomGame.getExternalData(), // externalData
          gamePrice, // gamePlatformPrice
          randomGame.getCategories() // categories
        ),
      );

      totalPrice += gamePrice;
      

      // Try to get a second game
      /*const secondRandomGame = finalGames.find(
        (game) =>
          game.getId() !== randomGame.getId() &&
          (game.getGamePlatformPrice() ?? 0) <= euroAmount - gamePrice &&
          (game.getGamePlatformPrice() ?? 0) >=
            (euroAmount - gamePrice) * (Number(process.env.MIN_AMOUNT_PERCENTAGE ?? 93) / 100) // 93% of the remaining amount
      );
      if (secondRandomGame) {
        gameProviderGames.push(
          new GameProviderGame(
            Uuid.create(), // id
            mysteryBoxRollId, // mysteryBoxRollId
            secondRandomGame.getName(), // name
            secondRandomGame.getImgUrl(), // imgUrl
            secondRandomGame.getRegion(), // region
            secondRandomGame.getPlatform(), // platform
            secondRandomGame.getExternalData(), // externalData
            secondRandomGame.getGamePlatformPrice(), // gamePlatformPrice
            secondRandomGame.getCategories() // categories
          )
        );
      }*/
    }

    return new MysteryBoxRoll(
      mysteryBoxRollId, // id
      mysteryBox.getId(), // mysteryBoxId
      false, // viewed
      false, // rejected
      false, // selected
      null, // optionNumber
      gameProviderGames // gameProviderGames
    );
  }

  // ---------------------------- PRIVATE METHODS ----------------------------

  private async getGameSteamCategoriesIds(
    steamGameId: number
  ): Promise<string[]> {
    return await axios
      .get(`${process.env.STEAM_API_WEB_URL}/api/appdetails`, {
        params: {
          appids: steamGameId,
        },
      })
      .then((response) => {
        this.logger.log("requested", {
          context: "getGameSteamCategoriesIds",
          attributes: {
            status: response.status,
          },
        });
        if (response.status === 200) {
          return Object.values(response.data).map((gameData: any) =>
            gameData.data.categories.map(
              (category: any) => category.id
            )
          );
        } else {
          this.logger.log("unexpected status code", {
            level: LogLevel.ERROR,
            context: "getGameSteamCategoriesIds",
            attributes: {
              status: response.status,
            },
          });
          return [];
        }
      })
      .catch((error) => {
        this.logger.log("fatal error", {
          level: LogLevel.FATAL,
          context: "getGameSteamCategoriesIds",
          attributes: {
            message: error.message,
            stack: error.stack,
          },
        });
        return [];
      });
  }

  private async requestAllowedGames(
    accountGameIds: number[],
    categories: Category[] | null,
    region: string,
    euroAmount: number
  ): Promise<
    {
      gameSteamCategories: string[];
      gameProviderGame: GameProviderGame;
    }[]
  > {
    // The maximum amount of games to request is 10000
    const maxGamesToRequest = Number(process.env.MAX_GAMES_TO_REQUEST ?? 10000);
    // The start index to request the games
    let start = 0;
    let items: any[] = [];
    let totalMatchingRecords = 1000000000;

    const categoryExternalIds = categories?.map((category) => category.getExternalId()) ?? [];

    // Request games until the items array has the maxGamesToRequest length
    while (items.length < maxGamesToRequest) {

      const query = {
        query: {
          start: start.toString(),
          count: (maxGamesToRequest - items.length).toString(),
          filters: {
            //regional_top_n_sellers:
            //process.env.STEAM_REGIONAL_TOP_N_SELLERS?.toString() ?? "30000",
            global_top_n_sellers:
              process.env.STEAM_GLOBAL_TOP_N_SELLERS?.toString() ?? "10000000",
            released_only: true,
            price_filters: { only_free_items: "", exclude_free_items: true },
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
            tagids_must_match: [] as { tagids: Number[] }[],
          },
        },
        context: {
          country_code: region || "ES",
        },
        data_request: {
          include_assets: "",
          include_release: true,
          include_platforms: "",
          include_all_purchase_options: "",
          include_screenshots: "",
          include_trailers: "",
          include_ratings: "",
          include_tag_count: "20",
          include_reviews: true,
          include_basic_info: "",
          include_supported_languages: "",
          include_full_description: "",
          include_included_items: "",
          include_assets_without_overrides: "",
          apply_user_filters: "",
          include_links: "",
        },
      };
      if(categoryExternalIds.length > 0) {
        query.query.filters.tagids_must_match.push({
            tagids: categoryExternalIds,
        });
      }
      if (totalMatchingRecords < 1450){
        query.query.filters.global_top_n_sellers = ""; // No limit
      }

      const formattedQuery = JSON.stringify(query);

      const response = await axios.get(
        `${process.env.STEAM_API_URL}/IStoreQueryService/Query/v1`,
        {
          params: {
            key: process.env.STEAM_API_KEY,
            input_json: formattedQuery,
          },
        }
      );

      this.logger.log("requested", {
        context: "requestGames",
        attributes: {
          status: response.status,
        },
      });

      if (response.status === 200 && response.data?.response?.store_items) {

        // Steam Pagination
        totalMatchingRecords =
          response.data.response.metadata.total_matching_records;
        const currentCount = response.data.response.metadata.count;

        const storeItems = response.data.response.store_items;
        // Filter the steam response to get only the games that match the criteria
        const newItems = storeItems.filter((item: any) => {

          // If is free, skip
          if (item?.is_free || !item?.best_purchase_option) return false;

          // A valid name is only composed by letters and spaces and doesn't end with a number
          const itemName = item.name;
          const isValidName =
            /^[a-zA-Z\s]+$/.test(itemName) &&
            !/\s\d$/.test(itemName) &&
            !/\s[Vv][Rr]$/.test(itemName);

          // Check if the price is valid
          const price =
            Number(
              item.best_purchase_option?.original_price_in_cents ??
              item.best_purchase_option.final_price_in_cents
            ) / 100;

          const amountToGet2Games = Number(process.env.AMOUNT_TO_GET_2_GAMES);

          const isPriceValid =
            price <= euroAmount &&
            ((euroAmount < amountToGet2Games &&
              price >=
                (Number(process.env.MIN_AMOUNT_PERCENTAGE_FOR_1_GAME) / 100) *
                  euroAmount) ||
              (euroAmount >= amountToGet2Games &&
                price >=
                  (Number(process.env.MIN_AMOUNT_PERCENTAGE_FOR_1_GAME) /
                    100) *
                    euroAmount) ||
              price >=
                ((100 -
                  Number(process.env.MAX_AMOUNT_PERCENTAGE_FOR_SECOND_GAME)) /
                  100) *
                  euroAmount);

          // More than 100 reviews and at least 80% of the reviews are positive
          const reviewData = item.reviews.summary_filtered ?? null;
          const hasValidValorations =
            (reviewData?.review_count ?? 0) >
              Number(process.env.MIN_GAME_REVIEWS ?? 700) &&
            reviewData?.review_score >=
              Number(process.env.STEAM_MIN_REVIEW_SCORE ?? 7);
          const alreadyHasGame = accountGameIds.includes(item.appid);

          // Games from the last 8 years
          const releases = item.release;
          const releaseYear = new Date(
            ((releases?.original_release_date ||
              releases?.original_steam_release_date ||
              releases?.steam_release_date) ??
              0) * 1000 // Convert to milliseconds
          ).getFullYear();
          const validReleaseDate =
            releaseYear >=
            new Date().getFullYear() -
              Number(process.env.MAX_GAME_RELEASE_YEARS_AGO);

            const hasAtLeastOneCategory =
              categoryExternalIds && categoryExternalIds.length
                ? item.tagids?.some((tagId: Number) =>
                    categoryExternalIds.includes(tagId)
                  )
                : true;

          return (
            isValidName &&
            isPriceValid &&
            hasValidValorations &&
            validReleaseDate &&
            hasAtLeastOneCategory &&
            !alreadyHasGame
          );
        });
        

        // Add the new items to the items array
        items = items.concat(
          await Promise.all(
            newItems.map(async (item: any) => ({
              gameSteamCategories: item?.categories?.feature_categoryids ?? [],
              gameProviderGame: new GameProviderGame(
                Uuid.create(), // id
                null, // mysteryBoxRollId
                item.name, // name
                null, // imgUrl
                null, // region
                null, // platform
                null, // externalData
                Number(
                  item.best_purchase_option?.original_price_in_cents ??
                  item.best_purchase_option.final_price_in_cents
                ) / 100, // gamePlatformPrice
                await this.categoryRepository.getByIds(
                  item.tagids ?? []
                ) // categories
              ),
            }))
          )
        );

        // If the total of items requested is greater than the total of items available, break the loop        
        if (start + storeItems.length >= totalMatchingRecords) break;
        start += currentCount;

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

  private async requestAccountGameIds(userId: Uuid): Promise<number[]> {
    const account = await this.platformAccountReporitory.getByUserId(userId);
    if (!account) {
      return [];
    }
    const accountGamesResponse = await this.requestAccountGames(
      account.getPlatformUserId(),
      false
    );

    if (accountGamesResponse.status === 200) {
      return accountGamesResponse.data.response.games.map(
        (game: any) => game.appid
      );
    }

    this.logger.log("unexpected status code", {
      level: LogLevel.ERROR,
      context: "requestAccountGameIds",
      attributes: {
        status: accountGamesResponse.status,
      },
    });
    return [];
  }

  private async requestAccountGames(
    steamId: string | null,
    includeAppInfo: boolean
  ): Promise<any> {
    if (!steamId) return [];

    return await axios
      .get(`${process.env.STEAM_API_URL}/IPlayerService/GetOwnedGames/v1`, {
        params: {
          key: process.env.STEAM_API_KEY,
          steamid: steamId,
          include_appinfo: includeAppInfo,
          include_played_free_games: true,
        },
      })
      .then((response) => {
        this.logger.log("requested", {
          context: "requestAccountGames",
          attributes: {
            status: response.status,
          },
        });
        return response;
      })
      .catch((error) => {
        this.logger.log("fatal error", {
          level: LogLevel.FATAL,
          context: "requestAccountGames",
          attributes: {
            message: error.message,
            stack: error.stack,
          },
        });
        return [];
      });
  }

  private delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
}
