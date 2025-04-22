import { ExternalGameProviderRepositoryContract } from "../../../domain/contracts/ExternalGameProviderRepositoryContract";
import { MysteryBoxRoll } from "../../../domain/entities/MysteryBoxRoll";
import { GameProviderGame } from "../../../domain/entities/GameProviderGame";
import { HttpClientAdapter } from "../../adapters/http/HttpClientAdapter";
import { Uuid } from "../../../domain/value-objects/Uuid";

export abstract class BaseGameProviderRepository implements ExternalGameProviderRepositoryContract {
  protected nextProvider: ExternalGameProviderRepositoryContract | null = null;
  protected httpClient: HttpClientAdapter;
  protected abstract providerName: string;

  constructor() {
    this.httpClient = new HttpClientAdapter();
  }

  setNext(provider: ExternalGameProviderRepositoryContract): ExternalGameProviderRepositoryContract {
    this.nextProvider = provider;
    return provider;
  }

  async validateAndReturnMysteryBoxRoll(
    mysteryBoxRoll: MysteryBoxRoll
  ): Promise<MysteryBoxRoll | null> {
    try {
      const validatedRoll = await this.searchGames(mysteryBoxRoll);
      
      if (validatedRoll) {
        return validatedRoll;
      }
      
      if (this.nextProvider) {
        return this.nextProvider.validateAndReturnMysteryBoxRoll(mysteryBoxRoll);
      }
      
      return null;
    } catch (error) {
      if (this.nextProvider) {
        return this.nextProvider.validateAndReturnMysteryBoxRoll(mysteryBoxRoll);
      }
      return null;
    }
  }

  protected abstract searchGames(mysteryBoxRoll: MysteryBoxRoll): Promise<MysteryBoxRoll | null>;
  
  protected createGameProviderGame(
    gameData: any,
    mysteryBoxRollId: Uuid | null,
    platform: any | null,
    categories: any[] = []
  ): GameProviderGame {
    return new GameProviderGame(
      null,
      mysteryBoxRollId ? mysteryBoxRollId : null,
      gameData.name,
      gameData.imageUrl || null,
      gameData.region || null,
      platform,
      gameData,
      gameData.price || null,
      categories
    );
  }
}
