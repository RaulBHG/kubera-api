import { MysteryBoxType } from "../entities/MysteryBoxType";

export interface MysteryBoxTypeRepositoryContract {
  getTypeForAmount(euroAmount: number): Promise<MysteryBoxType>;
}