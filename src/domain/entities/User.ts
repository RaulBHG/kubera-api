import { Uuid } from "../value-objects/Uuid";

export class User {
  constructor(
    public readonly id: Uuid,
    public readonly ip: string,
    public readonly email: string | null
  ) {}

}
