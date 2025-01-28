import { Uuid } from "../value-objects/Uuid";
import { Category } from "./Category";
import { MisteryBoxType } from "./MisteryBoxType";
import { Platform } from "./Platform";
import { MisteryBoxRoll } from './MisteryBoxRoll';

export class MisteryBox {
  constructor(
    private readonly id: Uuid | null,
    private readonly userId: string | null,
    private readonly type: MisteryBoxType | null,
    private readonly misteryBoxRolls: MisteryBoxRoll[] | null,
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

  getType(): MisteryBoxType | null {
    return this.type;
  }

  getMisteryBoxRolls(): MisteryBoxRoll[] | null {
    return this.misteryBoxRolls;
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
