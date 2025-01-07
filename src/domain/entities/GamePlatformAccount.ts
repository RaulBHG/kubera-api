import { Uuid } from "../value-objects/Uuid";

export class GamePlatformAccount {
  constructor(
    private readonly id: Uuid | null,
    private readonly userId: string | null,
    private readonly platformUsername: string | null,
    private readonly platformUserId: string | null
  ) {}

  getId(): Uuid | null {
    return this.id;
  }

  getUserId(): string | null {
    return this.userId;
  }

  getPlatformUsername(): string | null {
    return this.platformUsername;
  }

  getPlatformUserId(): string | null {
    return this.platformUserId;
  }
}
