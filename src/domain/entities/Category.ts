export class Category {
  constructor(
    private readonly id: string,
    private readonly slug: string,
    private readonly name: string,
    private readonly externalId: string
  ) {}

  getId(): string {
    return this.id;
  }

  getSlug(): string | null {
    return this.slug;
  }

  getName(): string | null {
    return this.name;
  }

  getDescription(): string {
    return this.externalId;
  }
}
