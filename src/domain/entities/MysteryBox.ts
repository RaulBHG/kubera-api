import { Uuid } from "../value-objects/Uuid";
import { Category } from "./Category";
import { MysteryBoxType } from "./MysteryBoxType";
import { Platform } from "./Platform";
import { MysteryBoxRoll } from './MysteryBoxRoll';

export class MysteryBox {
  constructor(
    private readonly id: Uuid | null,
    private readonly userId: Uuid | null,
    private readonly type: MysteryBoxType | null,
    private readonly mysteryBoxRolls: MysteryBoxRoll[] | null,
    private readonly expiration: Date,
    private readonly region: string | null,
    private readonly categories: Category[] | null,
    private readonly platforms: Platform[] | null
  ) {}

  getId(): Uuid | null {
    return this.id;
  }

  getUserId(): Uuid | null {
    return this.userId;
  }

  getType(): MysteryBoxType | null {
    return this.type;
  }

  getMysteryBoxRolls(): MysteryBoxRoll[] | null {
    return this.mysteryBoxRolls;
  }

  getExpirationDate(): Date {
    return this.expiration;
  }

  getRegion(): string | null {
    return this.region;
  }

  getCategories(): Category[] | null {
    return this.categories;
  }

  getPlatforms(): Platform[] | null {
    return this.platforms;
  }
}
