import { MysteryBoxRoll } from "../../../domain/entities/MysteryBoxRoll";
import { BaseGameProviderRepository } from "./BaseGameProviderRepository";

export class G2AGameProviderRepository extends BaseGameProviderRepository {
  protected providerName: string = "g2a";
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    super();
    this.baseUrl = process.env.G2A_API_URL || "https://api.g2a.com/v1";
    this.headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.G2A_API_KEY || "mock-api-key"}`
    };
  }

  protected async searchGames(mysteryBoxRoll: MysteryBoxRoll): Promise<MysteryBoxRoll | null> {
    try {
      const gameNames = mysteryBoxRoll.gameProviderGames?.map(game => game.name) || [];
      
      if (gameNames.length === 0) {
        return null;
      }

      const gameProviderGames = [];
      
      for (const gameName of gameNames) {
        const searchUrl = `${this.baseUrl}/products?query=${encodeURIComponent(gameName)}`;
                
        const mockResponse = this.createMockResponse(gameName);
        
        const items = mockResponse.items;
        
        if (items && items.length > 0) {
          const bestMatch = items[0];
          
          const gameProviderGame = this.createGameProviderGame(
            {
              name: bestMatch.name,
              imageUrl: bestMatch.image,
              region: bestMatch.region,
              price: bestMatch.price,
              externalId: bestMatch.id,
              provider: this.providerName
            },
            mysteryBoxRoll.id,
            null,
            []
          );
          
          gameProviderGames.push(gameProviderGame);
        }
      }
      
      if (gameProviderGames.length > 0) {
        return new MysteryBoxRoll(
          mysteryBoxRoll.id,
          mysteryBoxRoll.mysteryBoxId,
          mysteryBoxRoll.viewed,
          mysteryBoxRoll.rejected,
          mysteryBoxRoll.selected,
          mysteryBoxRoll.optionNumber,
          gameProviderGames
        );
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  private createMockResponse(gameName: string): any {
    return {
      items: [
        {
          id: `g2a-${Math.floor(Math.random() * 10000)}`,
          name: gameName,
          image: `https://images.g2a.com/images/${gameName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          region: "Global",
          price: Math.floor(Math.random() * 40) + 15,
          currency: "USD",
          seller_rating: 4.8,
          seller_name: "TopGameSeller"
        }
      ]
    };
  }
}
