import { MysteryBox } from "../entities/MysteryBox";
import { Uuid } from "../value-objects/Uuid";

export interface MysteryBoxRepositoryContract {
  create(mysteryBox: MysteryBox): Promise<MysteryBox>;
  getActiveByUserId(userId: Uuid): Promise<MysteryBox | null>;
}