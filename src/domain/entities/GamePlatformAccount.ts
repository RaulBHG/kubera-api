import { Uuid } from "../value-objects/Uuid";

export class GamePlatformAccount {
  constructor(
    private readonly id: Uuid | null,
    private readonly userId: string | null,
    private readonly platformUsername: string,
    private readonly platformUserId: string
  ) {}

  getId(): Uuid | null {
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
