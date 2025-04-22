import { MysteryBoxRoll } from "../../../domain/entities/MysteryBoxRoll";
import { BaseGameProviderRepository } from "./BaseGameProviderRepository";

export class KinguinGameProviderRepository extends BaseGameProviderRepository {
  protected providerName: string = "kinguin";
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    super();
    this.baseUrl = process.env.KINGUIN_API_URL || "https://gateway.sandbox.kinguin.net";
    this.headers = {
      "Content-Type": "application/json",
      "X-Api-Key": `${process.env.KINGUIN_API_KEY || "e48500efea0eab96a3c0c38226552bf2"}`
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
        const searchUrl = `${this.baseUrl}/esa/api/v1/products?name=${encodeURIComponent(gameName)}`;
        
        const response = await this.httpClient.httpRequest(
          "GET",
          searchUrl,
          this.headers
        );
        
        const products = response.data.results;
        
        if (products && products.length > 0) {
          const bestMatch = products[0];

          const gameProviderGame = this.createGameProviderGame(
            {
              name: bestMatch.name,
              imageUrl: bestMatch.images?.cover?.url,
              region: `kinguing:regionId:${bestMatch.regionId}`,
              price: bestMatch.price,
              externalId: bestMatch.productId,
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
      products: [
        {
          id: `kinguin-${Math.floor(Math.random() * 10000)}`,
          name: gameName,
          imageUrl: `https://cdn.kinguin.net/media/catalog/product/${gameName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          region: "Global",
          price: Math.floor(Math.random() * 50) + 10,
          description: `This is a mock description for ${gameName}`,
          stock: Math.floor(Math.random() * 100) + 1
        }
      ]
    };
  }
}
