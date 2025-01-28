import { Uuid } from "../value-objects/Uuid";

export class MisteryBoxType {
  constructor(
    private readonly id: Uuid | null,
    private readonly slug: string,
    private readonly name: string | null,
    private readonly percentage: number,
    private readonly multiplier: number
  ) {}

  getId(): Uuid | null {
    return this.id;
  }

  getSlug(): string {
    return this.slug;
  }

  getName(): string | null {
    return this.name;
  }

  getPercentage(): number {
    return this.percentage;
  }

  getMultiplier(): number {
    return this.multiplier;
  }

}
