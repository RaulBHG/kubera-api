import { GameProviderRepositoryContract } from "../../domain/contracts/ExternalGameProviderRepositoryContract";
import { GamePlatformAccountGame } from "../../domain/entities/GamePlatformAccountGame";
import { MysteryBox } from "../../domain/entities/MysteryBox";
import { MysteryBoxRoll } from "../../domain/entities/MysteryBoxRoll";
import { Uuid } from "../../domain/value-objects/Uuid";

const CategoryModel = require("../../../models").category;

export class KinguinRepository implements GameProviderRepositoryContract {
  
  async validateAndReturnMysteryBoxRoll(mysteryBoxRoll: MysteryBoxRoll): Promise<MysteryBoxRoll | null> {
    return null;
  }
  
}
