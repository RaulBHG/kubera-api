
export class Uuid {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  static create(): Uuid {
    return new Uuid("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0; // random number between 0 and 15
        const v = c === "x" ? r : (r & 0x3) | 0x8; // modified bits to comply with v4 UUID standard
        return v.toString(16); // convert to hexadecimal
      }
    ));
  }

  getValue(): string {
    return this.value;
  }
}