export class Category {
  constructor(
    private readonly id: string,
    private readonly slug: string,
    private readonly name: string,
    private readonly externalId: string,
    private readonly visible: boolean
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

  getExternalId(): string {
    return this.externalId;
  }

  isVisible(): boolean {
    return this.visible;
  }
}
