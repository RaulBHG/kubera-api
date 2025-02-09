import { Uuid } from "../value-objects/Uuid";
import { Category } from "./Category";
import { Platform } from "./Platform";

export class GameProviderGame {
  constructor(
    private readonly id: Uuid | null,
    private readonly mysteryBoxRollId: Uuid,
    private readonly name: string,
    private readonly imgUrl: string | null,
    private readonly region: string | null,
    private readonly platform: Platform | null,
    private readonly externalData: object | null,
    private readonly gamePlatformPrice: number | null = null,
    private readonly categories: Category[] = []
  ) {}

  getId(): Uuid | null {
    return this.id;
  }

  getMysteryBoxRollId(): Uuid {
    return this.mysteryBoxRollId;
  }

  getName(): string {
    return this.name;
  }

  getImgUrl(): string | null {
    return this.imgUrl;
  }

  getRegion(): string | null {
    return this.region;
  }
  
  getPlatform(): Platform | null {
    return this.platform;
  }
  
  getExternalData(): object | null {
    return this.externalData;
  }

  getGamePlatformPrice(): number | null {
    return this.gamePlatformPrice;
  }

  getCategories(): Category[] {
    return this.categories;
  }
}
