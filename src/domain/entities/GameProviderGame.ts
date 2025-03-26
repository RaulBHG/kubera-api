import { Uuid } from "../value-objects/Uuid";
import { Category } from "./Category";
import { Platform } from "./Platform";

export class GameProviderGame {
  constructor(
    public readonly id: Uuid | null,
    public readonly mysteryBoxRollId: Uuid | null,
    public readonly name: string,
    public readonly imgUrl: string | null,
    public readonly region: string | null,
    public readonly platform: Platform | null,
    public readonly externalData: object | null,
    public readonly gamePlatformPrice: number | null = null,
    public readonly categories: Category[] = []
  ) {}

}
