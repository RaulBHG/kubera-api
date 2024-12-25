export class GamePlatformAccountGame {
  constructor(
    private readonly id: string,
    private readonly platformAccountId: string,
    private readonly platformGameId: number,
    private readonly name: string,
    private readonly playtime2Weeks: number | null,
    private readonly playtimeForever: number
  ) {}

  getId(): string {
    return this.id;
  }

  getPlatformAccountId(): string {
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
