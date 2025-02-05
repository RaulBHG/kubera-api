import { MysteryBoxRoll } from "../entities/MysteryBoxRoll";

export interface GameProviderRepositoryContract {
  validateAndReturnMysteryBoxRoll(mysteryBoxRoll: MysteryBoxRoll): Promise<MysteryBoxRoll | null>;
}
