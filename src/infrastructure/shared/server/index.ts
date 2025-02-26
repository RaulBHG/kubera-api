import express, { Express } from "express";
import { createServer, Server } from "http";
import { WebSocketServer } from "../websocket/WebSocketServer";
import { AwilixContainer } from "awilix";

export class ServerInstance {
  private static instance: ServerInstance;
  private app: Express;
  private httpServer: Server;
  private wsServer: WebSocketServer;
  private diContainer: AwilixContainer;

  private constructor(container: AwilixContainer) {
    this.diContainer = container;
    this.app = express();
    this.httpServer = createServer(this.app);
    this.wsServer = this.diContainer.resolve("webSocketServer");
    this.wsServer.initialize(this.httpServer);
  }

  public static initialize(container: AwilixContainer): ServerInstance {
    if (!ServerInstance.instance) {
      ServerInstance.instance = new ServerInstance(container);
    }
    return ServerInstance.instance;
  }

  public static getInstance(): ServerInstance {
    if (!ServerInstance.instance) {
      throw new Error(
        "ServerInstance has not been initialized. Call initialize() first."
      );
    }
    return ServerInstance.instance;
  }

  getExpressApp(): Express {
    return this.app;
  }

  getHttpServer(): Server {
    return this.httpServer;
  }

  getWebSocketServer(): WebSocketServer {
    return this.wsServer;
  }

  getDiContainer(): AwilixContainer {
    return this.diContainer;
  }

  startServer(port: number): void {
    this.httpServer.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  }
}
