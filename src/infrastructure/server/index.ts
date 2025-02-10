import express, { Express } from "express";
import { createServer, Server } from "http";
import { container } from "../websocket/container";
import { WebSocketServer } from "../websocket/server";

class ServerInstance {
  private static instance: ServerInstance;
  private app: Express;
  private server: Server;
  private wsServer: WebSocketServer;

  private constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.wsServer = container.get<WebSocketServer>(WebSocketServer);
    this.wsServer.initialize(this.server);
  }

  public static getInstance(): ServerInstance {
    if (!ServerInstance.instance) {
      ServerInstance.instance = new ServerInstance();
    }
    return ServerInstance.instance;
  }

  getExpressApp(): Express {
    return this.app;
  }

  getHttpServer(): Server {
    return this.server;
  }

  getWebSocketServer(): WebSocketServer {
    return this.wsServer;
  }

  startServer(port: number): void {
    this.server.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  }
}

export const serverInstance = ServerInstance.getInstance();
