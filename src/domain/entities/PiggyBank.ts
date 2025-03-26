import { Uuid } from "../value-objects/Uuid";

export class PiggyBank {
  constructor(
    public readonly id: Uuid | null,
    public readonly euroAmount: number,
    public readonly percentageFromBenefits: number
  ) {}

}
