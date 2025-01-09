import { GamePlatformAccountGamesRepositoryContract } from '../domain/contracts/GamePlatform/GamePlatformAccountGamesRepositoryContract';
import { GamePlatformAccountRepositoryContract } from '../domain/contracts/GamePlatform/GamePlatformAccountRepositoryContract';
import { UserRepositoryContract } from '../domain/contracts/UserRepositoryContract';
import { GamePlatformAccount } from '../domain/entities/GamePlatformAccount';
import { User } from '../domain/entities/User';
import { Uuid } from '../domain/value-objects/Uuid';
import { ExternalGamePlatformRepositoryContract } from './../domain/contracts/GamePlatform/ExternalGamePlatformRepositoryContract';

export class StoreExternalGamePlatformAccountUseCase {
  constructor(
    private readonly externalGamePlatformRepository: ExternalGamePlatformRepositoryContract,
    private readonly userRepository: UserRepositoryContract,
    private readonly gamePlatformRepository: GamePlatformAccountRepositoryContract,
    private readonly gamePlatformAccountGamesRepository: GamePlatformAccountGamesRepositoryContract
  ) {}

  async storeAccountData(userIdName: string, userIp: string): Promise<boolean> {
    let account = await this.externalGamePlatformRepository.getAccountByUserId(
      userIdName
    );
    if (!account) {
      console.log("Account not found with userId: ", userIdName);
      account = await this.externalGamePlatformRepository.getAccountByUserName(
        userIdName
      );
      if (!account) {
        console.log("Account not found with userName: ", userIdName);
        return false;
      }
    }
    console.log("Account found: ", account);
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

    const externalGames = await this.externalGamePlatformRepository.getAccountReferenceGamesByAccount(
      userAccount,
      10
    );
    if (!externalGames) {
      console.log("No games found for account: ", userAccount);
      return false;
    }

    const gamesSaved = await this.gamePlatformAccountGamesRepository.createMultiple(externalGames);
    if (!gamesSaved) {
      console.log("Games not saved: ", externalGames);
      return false;
    }

    return true;
  }
}
