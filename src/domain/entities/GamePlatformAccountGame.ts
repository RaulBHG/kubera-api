import { Uuid } from "../value-objects/Uuid";

export class GamePlatformAccountGame {
  constructor(
    private readonly id: Uuid | null,
    private readonly platformAccountId: Uuid,
    private readonly platformGameId: number,
    private readonly name: string,
    private readonly playtime2Weeks: number | null,
    private readonly playtimeForever: number
  ) {}

  getId(): Uuid | null {
    return this.id;
  }

  getPlatformAccountId(): Uuid {
    return this.platformAccountId;
  }

  getPlatformGameId(): number {
    return this.platformGameId;
  }

  getName(): string {
    return this.name;
  }

  getPlaytime2Weeks(): number | null {
    return this.playtime2Weeks;
  }

  getPlaytimeForever(): number {
    return this.playtimeForever;
  }
}
