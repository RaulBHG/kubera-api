import { WebSocket, WebSocketServer as WS } from "ws";
import { Server } from "http";
import { injectable } from "inversify";
import { WebSocketRouter } from "./router";
import { setupWebSocketRoutes } from "./routes";
import { WebSocketMessage } from "./types";

@injectable()
export class WebSocketServer {
  private wss: WS | null = null;
  private connections: Map<string, WebSocket> = new Map();
  private transactionHandlers: Map<string, any> = new Map();
  private readonly TRANSACTION_TIMEOUT = 30000;
  private router: WebSocketRouter;

  constructor() {
    this.router = new WebSocketRouter();
    setupWebSocketRoutes(this.router);
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

  private handleTxn(connectionId: string, payload: any): void {
    console.log(`Client ${connectionId} subscribed to:`, payload);
  }

  public async sendWithResponse(message: WebSocketMessage): Promise<any> {
    const transaction_id = crypto.randomUUID();
    const messageWithTransaction = {
      ...message,
      transaction_id,
    };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.transactionHandlers.delete(transaction_id);
        reject(new Error("Transaction timeout"));
      }, this.TRANSACTION_TIMEOUT);

      this.transactionHandlers.set(transaction_id, {
        resolve,
        reject,
        timeout,
      });
      this.broadcast(messageWithTransaction);
    });
  }

  public broadcast(message: WebSocketMessage): void {
    this.connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  public sendToClient(connectionId: string, message: WebSocketMessage): void {
    const ws = this.connections.get(connectionId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
}
