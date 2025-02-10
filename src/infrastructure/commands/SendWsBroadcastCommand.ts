import { BroadcastMessageUseCase } from "../../application/BroadcastMessageUseCase";
import { LogLevel } from "../../domain/value-objects/LogLevel";
import { PinoLoggerAdapter } from "../adapters/log/PinoLoggerAdapter";
import { serverInstance } from "../server";

async function runBroadcast() {
  const logger = new PinoLoggerAdapter();

  try {
    const wsServer = serverInstance.getWebSocketServer();

    const useCase = new BroadcastMessageUseCase(wsServer, logger);

    const message = {
      type: "notification",
      payload: {
        message: "System broadcast message",
        timestamp: new Date().toISOString(),
      },
    };

    await useCase.execute(message);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    process.exit(0);
  } catch (error) {
    logger.log("Command execution failed", {
      level: LogLevel.ERROR,
      context: "SendWsBroadcastCommand",
      attributes: {
        error,
      },
    });
    process.exit(1);
  }
}

runBroadcast();
