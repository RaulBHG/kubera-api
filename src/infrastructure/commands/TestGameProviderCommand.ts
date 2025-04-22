import { GameProviderFactory } from "../factories/GameProviderFactory";
import { MysteryBoxRoll } from "../../domain/entities/MysteryBoxRoll";
import { GameProviderGame } from "../../domain/entities/GameProviderGame";
import { Uuid } from "../../domain/value-objects/Uuid";

async function run() {
  try {
    const gameProviderChain = GameProviderFactory.createGameProviderChain();
    
    const gameProviderGames = [
      new GameProviderGame(
        null,
        null,
        "Elden Ring",
        null,
        null,
        null,
        null,
        null,
        []
      ),
      new GameProviderGame(
        null,
        null,
        "Cyberpunk 2077",
        null,
        null,
        null,
        null,
        null,
        []
      ),
      new GameProviderGame(
        null,
        null,
        "Red Dead Redemption 2",
        null,
        null,
        null,
        null,
        null,
        []
      )
    ];
    
    const mysteryBoxRoll = new MysteryBoxRoll(
      new Uuid("test-roll-id"),
      new Uuid("test-box-id"),
      false,
      false,
      false,
      1,
      gameProviderGames
    );
    
    console.log("Searching for games across providers...");
    
    const result = await gameProviderChain.validateAndReturnMysteryBoxRoll(mysteryBoxRoll);
    
    if (result && result.gameProviderGames) {
      console.log("Found games from providers:");
      
      result.gameProviderGames.forEach(game => {
        console.log(`\nGame: ${game.name}`);
        console.log(`Provider: ${(game.externalData as any)?.provider || 'Unknown'}`);
        console.log(`Price: $${(game.gamePlatformPrice || 0).toFixed(2)}`);
        console.log(`External ID: ${(game.externalData as any)?.externalId || 'Unknown'}`);
        console.log(`Image URL: ${game.imgUrl || 'No image'}`);
      });
    } else {
      console.log("No games found from any provider");
    }
  } catch (error) {
    console.error("Error testing game providers:", error);
  }
}

run();
