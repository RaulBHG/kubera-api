import { GamePlatformAccountGamesRepositoryContract } from "../domain/contracts/game-platform/GamePlatformAccountGamesRepositoryContract";
import { GamePlatformAccountRepositoryContract } from "../domain/contracts/game-platform/GamePlatformAccountRepositoryContract";
import { LoggerContract } from "../domain/contracts/LoggerContract";
import { UserRepositoryContract } from "../domain/contracts/UserRepositoryContract";
import { GamePlatformAccount } from "../domain/entities/GamePlatformAccount";
import { User } from "../domain/entities/User";
import { LogLevel } from "../domain/value-objects/LogLevel";
import { Uuid } from "../domain/value-objects/Uuid";
import { ExternalGamePlatformRepositoryContract } from "../domain/contracts/game-platform/ExternalGamePlatformRepositoryContract";

export class StoreExternalGamePlatformAccountUseCase {
  constructor(
    private readonly externalGamePlatformRepository: ExternalGamePlatformRepositoryContract,
    private readonly userRepository: UserRepositoryContract,
    private readonly gamePlatformRepository: GamePlatformAccountRepositoryContract,
    private readonly gamePlatformAccountGamesRepository: GamePlatformAccountGamesRepositoryContract,
    private readonly logger: LoggerContract
  ) {}

  async storeAccountData(userIdName: string, userIp: string): Promise<boolean> {
    let account = await this.externalGamePlatformRepository.getAccountBySteamUserId(
      userIdName
    );
    if (!account) {
      this.logger.log("Account not found with userId", {
        level: LogLevel.ERROR,
        context: "StoreExternalGamePlatformAccountUseCase",
        attributes: {
          userIdName,
        },
      });

      account = await this.externalGamePlatformRepository.getAccountByUserName(
        userIdName
      );
      if (!account) {
        this.logger.log("Account not found with userName", {
          level: LogLevel.ERROR,
          context: "StoreExternalGamePlatformAccountUseCase",
          attributes: {
            userIdName,
          },
        });
        return false;
      }
    }

    this.logger.log("Account found", {
      context: "StoreExternalGamePlatformAccountUseCase",
      attributes: {
        account,
      },
    });

    const user = await this.userRepository.create(
      new User(Uuid.create(), userIp, null)
    );
    const userAccount = await this.gamePlatformRepository.create(
      new GamePlatformAccount(
        null,
        user.getId().getValue(),
        account.getPlatformUsername(),
        account.getPlatformUserId()
      )
    );

    const externalGames =
      await this.externalGamePlatformRepository.getAccountReferenceGamesByAccount(
        userAccount,
        10
      );
    if (!externalGames) {
      this.logger.log("No games found for account", {
        level: LogLevel.ERROR,
        context: "StoreExternalGamePlatformAccountUseCase",
        attributes: {
          userAccount,
        },
      });
      return false;
    }

    const gamesSaved =
      await this.gamePlatformAccountGamesRepository.createMultiple(
        externalGames
      );
    if (!gamesSaved) {
      this.logger.log("Games not saved", {
        level: LogLevel.ERROR,
        context: "StoreExternalGamePlatformAccountUseCase",
        attributes: {
          externalGames,
        },
      });
      return false;
    }

    return true;
  }
}
