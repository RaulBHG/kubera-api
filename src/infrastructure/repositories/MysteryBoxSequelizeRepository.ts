import { MysteryBoxRepositoryContract } from "../../domain/contracts/MysteryBoxRepositoryContract";
import { MysteryBox } from "../../domain/entities/MysteryBox";
import { Uuid } from '../../domain/value-objects/Uuid';
import { MysteryBoxType } from "../../domain/entities/MysteryBoxType";
import { Category } from "../../domain/entities/Category";
import { Platform } from "../../domain/entities/Platform";
import { MysteryBoxRoll } from "../../domain/entities/MysteryBoxRoll";
import { GameProviderGame } from "../../domain/entities/GameProviderGame";

const MysteryModel = require("../../../models").mystery_box;

export class MysteryBoxSequelizeRepository implements MysteryBoxRepositoryContract {
  async create(mysteryBox: MysteryBox): Promise<MysteryBox> {
    const newMysteryBox = await MysteryModel.create({
      id: mysteryBox?.getId()?.getValue() ?? Uuid.create().getValue(),
      user_id: mysteryBox?.getUserId()?.getValue(),
      type_id: mysteryBox?.getType()?.getId()?.getValue(),
      expiration: mysteryBox?.getExpiration(),
    });

    const categoryIds = mysteryBox
      ?.getCategories()
      ?.map((category) => category.getId());
    const platformIds = mysteryBox
      ?.getPlatforms()
      ?.map((platform) => platform.getId());

    await newMysteryBox.setCategories(categoryIds);
    await newMysteryBox.setPlatforms(platformIds);

    return await this.fromSequelizetoEntity(newMysteryBox);
  }

  async getActiveByUserId(userId: Uuid): Promise<MysteryBox | null> {
    const mysteryBox = await MysteryModel.findOne({
      where: {
        user_id: userId.getValue(),
      },
    });

    if (!mysteryBox) {
      return null;
    }

    return await this.fromSequelizetoEntity(mysteryBox);
  }

  async assignRolls(
    mysteryBox: MysteryBox,
    mysteryBoxRolls: MysteryBoxRoll[]
  ): Promise<MysteryBox> {
    const rolls = await Promise.all(
      mysteryBoxRolls.map(async (roll) => {
        const [assignedRoll, created] = await MysteryModel.rolls.findOrCreate({
          where: { id: roll?.getId()?.getValue() ?? Uuid.create().getValue() },
          defaults: {
            mystery_box_id: mysteryBox?.getId()?.getValue(),
            viewed: roll.getViewed(),
            rejected: roll.getRejected(),
            selected: roll.getSelected(),
            option_number: roll.getOptionNumber(),
          },
        });

        if (created) {
          const gameProviderGameIds = roll
            ?.getGameProviderGames()
            ?.map((game) => game?.getId()?.getValue());
          await assignedRoll.setGames(gameProviderGameIds);
        }

        return assignedRoll;
      })
    );

    return await this.fromSequelizetoEntity(
      MysteryModel.findByPk(mysteryBox?.getId()?.getValue())
    );
  }

  private async fromSequelizetoEntity(mysteryBox: any): Promise<MysteryBox> {
    const mysteryBoxType = (await mysteryBox.type) || null;
    const typeEntity = mysteryBoxType
      ? new MysteryBoxType(
          new Uuid(mysteryBoxType.id),
          mysteryBoxType.slug,
          mysteryBoxType.name,
          mysteryBoxType.percentage,
          mysteryBoxType.multiplier
        )
      : null;

    const categories = await mysteryBox.getCategories();
    const categoryEntities = categories.map(
      (category: any) =>
        new Category(
          category.id,
          category.slug,
          category.name,
          category.external_id,
          category.visible
        )
    );
    const platforms = await mysteryBox.getPlatforms();
    const platformEntities = platforms.map(
      (platform: any) =>
        new Platform(
          platform.id,
          platform.slug,
          platform.name,
          platform.external_id,
          platform.visible
        )
    );

    const rolls = await mysteryBox.rolls;
    const rollsEntities = rolls.map(
      (roll: any) =>
        new MysteryBoxRoll(
          new Uuid(roll.id),
          roll.mystery_box_id,
          roll.viewed,
          roll.rejected,
          roll.selected,
          roll.option_number,
          roll.games.map(
            (gameProviderGame: any) =>
              new GameProviderGame(
                new Uuid(gameProviderGame.id),
                gameProviderGame.mystery_box_roll_id,
                gameProviderGame.name,
                gameProviderGame.img_url,
                gameProviderGame.region,
                gameProviderGame.external_data,
                new Platform(
                  gameProviderGame.platform.id,
                  gameProviderGame.platform.slug,
                  gameProviderGame.platform.name,
                  gameProviderGame.platform.external_id,
                  gameProviderGame.platform.visible
                )
              )
          )
        )
    );

    return new MysteryBox(
      new Uuid(mysteryBox.id),
      new Uuid(mysteryBox.user_id),
      typeEntity,
      rollsEntities,
      mysteryBox.expiration,
      mysteryBox.region,
      categoryEntities,
      platformEntities
    );
  }
}
