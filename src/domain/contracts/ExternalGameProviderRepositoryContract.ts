import { MysteryBoxRoll } from "../entities/MysteryBoxRoll";

export interface ExternalGameProviderRepositoryContract {
  validateAndReturnMysteryBoxRoll(
    mysteryBoxRoll: MysteryBoxRoll
  ): Promise<MysteryBoxRoll | null>;
  
  setNext(provider: ExternalGameProviderRepositoryContract): ExternalGameProviderRepositoryContract;
}
