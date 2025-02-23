import { MysteryBox } from "../entities/MysteryBox";
import { Uuid } from "../value-objects/Uuid";
import { MysteryBoxRoll } from './../entities/MysteryBoxRoll';

export interface MysteryBoxRepositoryContract {
  create(mysteryBox: MysteryBox): Promise<MysteryBox>;
  getActiveByUserId(userId: Uuid): Promise<MysteryBox | null>;
  assignRolls(mysteryBox: MysteryBox, mysteryBoxRolls: MysteryBoxRoll[]): Promise<MysteryBox>;
}