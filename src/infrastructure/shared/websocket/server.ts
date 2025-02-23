import { WebSocket, WebSocketServer as WS } from "ws";
import { Server } from "http";
import { WebSocketRouter } from "./router";
import { WebSocketMessage } from "./types";

export class WebSocketServer {
  private wss: WS | null = null;
  private connections: Map<string, WebSocket> = new Map();
  private transactionHandlers: Map<string, any> = new Map();
  private readonly TRANSACTION_TIMEOUT = 30000;
  private router: WebSocketRouter;

  constructor() {
    this.router = new WebSocketRouter();
  }

  private handleMessage(connectionId: string, message: string): void {
    try {
      const parsedMessage: WebSocketMessage & { namespace?: string } =
        JSON.parse(message.toString());
      const { namespace, type, payload } = parsedMessage;

      if (!namespace || !type) {
        console.log("Missing namespace or type in message");
        return;
      }

      const handler = this.router.getHandler(namespace, type);
      if (handler) {
        handler.handler(connectionId, payload);
      } else {
        console.log(
          `No handler found for namespace: ${namespace}, type: ${type}`
        );
      }
    } catch (error) {
      console.log("Error handling WebSocket message:", error);
    }
  }

  getRouter(): WebSocketRouter {
    return this.router;
  }

  initialize(server: Server): void {
    this.wss = new WS({ server });

    this.wss.on("connection", (ws: WebSocket) => {
      const connectionId = crypto.randomUUID();
      this.connections.set(connectionId, ws);

      ws.on("message", (message: string) => {
        this.handleMessage(connectionId, message);
      });

      ws.on("close", () => {
        this.connections.delete(connectionId);
      });
    });
  }

  getConnectionById(connectionId: string): WebSocket | undefined {
    return this.connections.get(connectionId);
  }
}
