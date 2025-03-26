import { Uuid } from "../value-objects/Uuid";
import { Category } from "./Category";
import { MysteryBoxType } from "./MysteryBoxType";
import { Platform } from "./Platform";
import { MysteryBoxRoll } from './MysteryBoxRoll';

export class MysteryBox {
  constructor(
    public readonly id: Uuid | null,
    public readonly userId: Uuid | null,
    public readonly type: MysteryBoxType | null,
    public readonly mysteryBoxRolls: MysteryBoxRoll[] | null,
    public readonly expiration: Date,
    public readonly region: string | null,
    public readonly categories: Category[] | null,
    public readonly platforms: Platform[] | null
  ) {}

}
