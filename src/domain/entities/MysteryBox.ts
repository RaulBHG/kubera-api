import { Uuid } from "../value-objects/Uuid";
import { Category } from "./Category";
import { MysteryBoxType } from "./MysteryBoxType";
import { Platform } from "./Platform";
import { MysteryBoxRoll } from './MysteryBoxRoll';

export class MysteryBox {
  constructor(
    private readonly id: Uuid | null,
    private readonly userId: string | null,
    private readonly type: MysteryBoxType | null,
    private readonly mysteryBoxRolls: MysteryBoxRoll[] | null,
    private readonly expirationDate: Date,
    private readonly categories: Category[] | null,
    private readonly platforms: Platform[] | null
  ) {}

  getId(): Uuid | null {
    return this.id;
  }

  getUserId(): string | null {
    return this.userId;
  }

  getType(): MysteryBoxType | null {
    return this.type;
  }

  getMysteryBoxRolls(): MysteryBoxRoll[] | null {
    return this.mysteryBoxRolls;
  }

  getExpirationDate(): Date {
    return this.expirationDate;
  }

  getCategories(): Category[] | null {
    return this.categories;
  }

  getPlatforms(): Platform[] | null {
    return this.platforms;
  }

}
