import { GameProviderGame } from "../entities/GameProviderGame";
import { MysteryBox } from "./../entities/MysteryBox";

export interface GameProviderRepositoryContract {
  findByMysteryBoxAndAmount(mysteryBox: MysteryBox, euroAmount: number): Promise<GameProviderGame[] | null>;
}
