
import { MysteryBoxRepositoryContract } from '../domain/contracts/MysteryBoxRepositoryContract';
import { MysteryBox } from '../domain/entities/MysteryBox';
import { Uuid } from '../domain/value-objects/Uuid';
import { UserRepositoryContract } from './../domain/contracts/UserRepositoryContract';
import { MysteryBoxTypeRepositoryContract } from '../domain/contracts/MysteryBoxTypeRepositoryContract';
import { GameProviderRepositoryContract } from '../domain/contracts/GameProviderRepositoryContract';
import { PlatformRepositoryContract } from '../domain/contracts/PlatformRepositoryContract';
import { GamePlatformAccountGamesRepositoryContract } from '../domain/contracts/game-platform/GamePlatformAccountGamesRepositoryContract';
import { ExternalGamePlatformRepositoryContract } from '../domain/contracts/game-platform/ExternalGamePlatformRepositoryContract';
import { MysteryBoxRoll } from '../domain/entities/MysteryBoxRoll';
import { CategoryRepositoryContract } from '../domain/contracts/repositories/CategoryRepositoryContract';
export class SearchMysteryBoxMatchesUseCase {
  constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly mysteryBoxRepository: MysteryBoxRepositoryContract,
    private readonly mysteryBoxTypeRepository: MysteryBoxTypeRepositoryContract,
    private readonly gameProviderRepository: GameProviderRepositoryContract,
    private readonly categoryRepository: CategoryRepositoryContract,
    private readonly platformRepository: PlatformRepositoryContract,
    private readonly gamePlatformAccountGamesRepository: GamePlatformAccountGamesRepositoryContract,
    private readonly externalGamePlatformRepository: ExternalGamePlatformRepositoryContract
  ) {}

  async searchMatches(
    userId: string,
    rerollOption: number,
    categoryIds: string[] | null,
    platformIds: string[] | null,
    countryCode: string | null
  ): Promise<IBoxMatch | null> {
    const userIdUuid = new Uuid(userId);
    const userExists = await this.userRepository.exists(userIdUuid);
    if (!userExists) throw new Error(`User does not exists with id ${userId}`);

    // TODO: Preparar rollback en caso de cualquier error
    // TODO: Validates payment
    // TODO: Validates payment

    const activeMysteryBox = await this.mysteryBoxRepository.getActiveByUserId(
      userIdUuid
    );

    // TODO Si ya existe un rerollOption lo usamos
    if (!activeMysteryBox) {
      // TODO: AMOUNT NOT HARDCODED
      const type = await this.mysteryBoxTypeRepository.getTypeForAmount(30);
      const expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + Number(process.env.MYSTERY_BOX_EXPIRATION_TIME));
      const getNonNullResults = async (promises: Promise<any>[]) => {
        const results = await Promise.all(promises);
        return results.filter((result) => result !== null);
      };

      const categoryPromises =
        categoryIds?.map((id) => this.categoryRepository.getById(id)) || [];
      const platformPromises =
        platformIds?.map((id) => this.platformRepository.getById(id)) || [];

      const [categories, platforms] = await Promise.all([
        getNonNullResults(categoryPromises),
        getNonNullResults(platformPromises),
      ]);

      const mysteryBoxNoRolls = new MysteryBox(
        Uuid.create(),
        userIdUuid,
        type,
        null,
        expiration,
        countryCode,
        categories,
        platforms
      );

      const rolls = await this.getThreeUniqueMysteryBoxRolls(
        mysteryBoxNoRolls,
        userIdUuid,
      );

      if (!rolls)
        throw new Error(
          `Could not get rolls for mystery box with id ${mysteryBoxNoRolls.getId()}`
        );

      this.mysteryBoxRepository.create(mysteryBoxNoRolls);

      const finalMysteryBox = await this.mysteryBoxRepository.assignRolls(
        mysteryBoxNoRolls,
        rolls
      );

      return null;
      // If has been rejected bock on canjeo
      //return await this.formatResult(finalMysteryBox, rerollOption);
    } else {

      // TODO: Implementar cuando ya existe un mystery box activo

      return null;
      //return await this.formatResult(activeMysteryBox, rerollOption);
    }
  }

  private async getThreeUniqueMysteryBoxRolls(
    mysteryBox: MysteryBox,
    userUuid: Uuid
  ): Promise<MysteryBoxRoll[]> {
    const accountGames =
      await this.gamePlatformAccountGamesRepository.getAccountGamesByUserId(
        userUuid
      );

    // TODO: AMOUNT NOT HARDCODED
    const euroAmount = 30 * (mysteryBox.getType()?.getMultiplier() ?? 1); // Get the price of the mystery box

    const games =
      await this.externalGamePlatformRepository.getAvailableGameProviderGames(
        userUuid,
        mysteryBox,
        accountGames,
        euroAmount
      );

    const uniqueRolls: MysteryBoxRoll[] = [];
    while (uniqueRolls.length < Number(process.env.MYSTERY_BOX_MAX_ROLLS)) {
      const rollOption =
        await this.externalGamePlatformRepository.getMysteryBoxRollOption(
          mysteryBox,
          games.allowedGames,
          games.matchedWithReferenceGames,
          euroAmount
        );

      if (this.isDuplicateRoll(rollOption, uniqueRolls)) continue;

      // TODO: Set as constant and implement chain of responsibility
      let validatedRoll =
        await this.gameProviderRepository.validateAndReturnMysteryBoxRoll(
          rollOption
        );

      // TODO: This is mocked
      if (!validatedRoll) {
        validatedRoll = rollOption;
      }

      if (validatedRoll) {
        uniqueRolls.push(validatedRoll);
        if (uniqueRolls.length === 3) break;
      }
    }

    return uniqueRolls;
  }

  private isDuplicateRoll(
    newRoll: MysteryBoxRoll,
    existingRolls: MysteryBoxRoll[]
  ): boolean {
    return existingRolls.some((roll) =>
      roll
        .getGameProviderGames()
        ?.some(
          (game, index) =>
            newRoll.getGameProviderGames()?.[index]?.getName() ===
            game.getName()
        )
    );
  }

  /*private async formatResult(
    mysteryBox: MysteryBox,
    rerollOption: number
  ): Promise<IBoxMatch> {
    const roll = mysteryBox
      .getMysteryBoxRolls()
      ?.find((roll) => roll.getOptionNumber() == rerollOption);
    if (!roll)
      throw new Error(
        `Roll does not exists for mystery box with id ${mysteryBox.getId()} and for option number ${rerollOption}`
      );

    const result: IBoxMatch = {
      id: mysteryBox?.getId()?.getValue() || null,
      reroll_option: roll.getOptionNumber(),
      rejected: roll.getRejected(),
      games:
        roll.getGameProviderGames()?.map((game) => {
          const platform = game.getPlatform();
          return {
            id: game.getId()?.getValue() || null,
            name: game.getName(),
            region: game.getRegion(),
            img_url: game.getImgUrl(),
            platform: platform
              ? {
                  id: platform.getId() || null,
                  slug: platform.getSlug(),
                  name: platform.getName(),
                  visible: platform.isVisible() || false,
                }
              : null,
          };
        }) || null,
    };

    return result;
  }*/
}

interface IBoxMatch {
  id: string | null;
  reroll_option: number | null;
  rejected: boolean;
  games: {
    id: string | null;
    name: string;
    region: string | null;
    img_url: string | null;
    platform: {
      id: string | null;
      slug: string;
      name: string | null;
      visible: boolean;
    } | null;
  }[] | null;
}
