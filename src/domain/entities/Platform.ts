export class Platform {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly name: string,
    public readonly externalId: string,
    public readonly visible: boolean
  ) {}

}
