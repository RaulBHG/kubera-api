export class Platform {
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

  getSlug(): string {
    return this.slug;
  }

  getName(): string | null {
    return this.name;
  }

  getDescription(): string {
    return this.externalId;
  }

  isVisible(): boolean {
    return this.visible;
  }
}
