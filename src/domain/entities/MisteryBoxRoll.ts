import { Uuid } from "../value-objects/Uuid";
import { GameProviderGame } from "./GameProviderGame";

export class MisteryBoxRoll {
  constructor(
    private readonly id: Uuid | null,
    private readonly misteryBoxId: Uuid | null,
    private readonly viewed: boolean,
    private readonly rejected: boolean,
    private readonly selected: boolean,
    private readonly optionNumber: number | null,
    private readonly gameProviderGames: GameProviderGame[] | null
  ) {}

  getId(): Uuid | null {
    return this.id;
  }
}
