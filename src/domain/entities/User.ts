import { Uuid } from "../value-objects/Uuid";

export class User {
  constructor(
    private readonly id: Uuid,
    private readonly ip: string,
    private readonly email: string | null
  ) {}

  getId(): Uuid {
    return this.id;
  }

  getIp(): string {
    return this.ip;
  }

  getEmail(): string | null {
    return this.email;
  }
}
