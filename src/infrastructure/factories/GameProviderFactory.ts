import { ExternalGameProviderRepositoryContract } from "../../domain/contracts/ExternalGameProviderRepositoryContract";
import { KinguinGameProviderRepository } from "../repositories/game-providers/KinguinGameProviderRepository";
import { G2AGameProviderRepository } from "../repositories/game-providers/G2AGameProviderRepository";

export class GameProviderFactory {
  static createGameProviderChain(): ExternalGameProviderRepositoryContract {
    const kinguinProvider = new KinguinGameProviderRepository();
    const g2aProvider = new G2AGameProviderRepository();
    
    kinguinProvider.setNext(g2aProvider);
    
    return kinguinProvider;
  }
}
