import { Uuid } from "../value-objects/Uuid";

export class GamePlatformAccountGame {
  constructor(
    public readonly id: Uuid | null,
    public readonly platformAccountId: Uuid,
    public readonly platformGameId: number,
    public readonly name: string,
    public readonly playtime2Weeks: number | null,
    public readonly playtimeForever: number
  ) {}

}
