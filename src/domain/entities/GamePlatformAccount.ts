import { Uuid } from "../value-objects/Uuid";

export class GamePlatformAccount {
  constructor(
    public readonly id: Uuid | null,
    public readonly userId: string | null,
    public readonly platformUsername: string | null,
    public readonly platformUserId: string | null
  ) {}

}
