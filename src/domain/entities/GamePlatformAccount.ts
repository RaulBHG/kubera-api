export class GamePlatformAccount {
  constructor(
    private readonly id: string,
    private readonly userId: string | null,
    private readonly platformUsername: string,
    private readonly platformUserId: string
  ) {}

  getId(): string {
    return this.id;
  }

  getUserId(): string | null {
    return this.userId;
  }

  getPlatformUsername(): string {
    return this.platformUsername;
  }

  getPlatformUserId(): string {
    return this.platformUserId;
  }
}
