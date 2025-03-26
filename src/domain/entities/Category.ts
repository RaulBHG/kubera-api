export class Category {
  constructor(
    private readonly id: string,
    private readonly slug: string,
    private readonly name: string,
    private readonly externalId: Number,
    private readonly visible: boolean
  ) {}

}
