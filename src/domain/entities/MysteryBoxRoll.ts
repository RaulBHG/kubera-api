import { Uuid } from "../value-objects/Uuid";
import { GameProviderGame } from "./GameProviderGame";

export class MysteryBoxRoll {
  constructor(
    public readonly id: Uuid | null,
    public readonly mysteryBoxId: Uuid | null,
    public readonly viewed: boolean,
    public readonly rejected: boolean,
    public readonly selected: boolean,
    public readonly optionNumber: number | null,
    public readonly gameProviderGames: GameProviderGame[] | null
  ) {}

}
