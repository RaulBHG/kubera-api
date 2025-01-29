import { Uuid } from "../value-objects/Uuid";
import { Platform } from "./Platform";

export class GameProviderGame {
  constructor(
    private readonly id: Uuid | null,
    private readonly mysteryBoxRollId: Uuid,
    private readonly name: string,
    private readonly imgUrl: string | null,
    private readonly region: string | null,
    private readonly externalData: object | null,
    private readonly platform: Platform | null
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

  getExternalData(): object | null {
    return this.externalData;
  }

  getPlatform(): Platform | null {
    return this.platform;
  }
}
