export class User {
  constructor(
    private readonly id: string,
    private readonly ip: string,
    private readonly email: boolean|null
  ) {}

  getId(): string {
    return this.id;
  }

  getIp(): string {
    return this.ip;
  }

  getEmail(): boolean|null {
    return this.email;
  }

}
