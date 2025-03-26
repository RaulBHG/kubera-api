export class Category {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly name: string,
    public readonly externalId: Number,
    public readonly visible: boolean
  ) {}

}
