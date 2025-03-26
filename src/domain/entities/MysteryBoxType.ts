import { Uuid } from "../value-objects/Uuid";

export class MysteryBoxType {
  constructor(
    public readonly id: Uuid | null,
    public readonly slug: string,
    public readonly name: string | null,
    public readonly percentage: number,
    public readonly multiplier: number
  ) {}

}
