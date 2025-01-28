import { Uuid } from "../value-objects/Uuid";

export class PiggyBank {
  constructor(
    private readonly id: Uuid | null,
    private readonly euroAmount: number,
    private readonly percentageFromBenefits: number
  ) {}

  getId(): Uuid | null {
    return this.id;
  }

  getEuroAmount(): number {
    return this.euroAmount;
  }

  getPercentageFromBenefits(): number {
    return this.percentageFromBenefits;
  }
}
