import { MysteryBoxRoll } from "../entities/MysteryBoxRoll";
import { MysteryBox } from "./../entities/MysteryBox";

export interface GameProviderRepositoryContract {
  findRollByMysteryBoxAndAmount(
    mysteryBox: MysteryBox,
    euroAmount: number
  ): Promise<MysteryBoxRoll[] | null>;
}
