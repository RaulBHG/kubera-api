import { WebSocket, WebSocketServer as WSServer } from "ws";
import { Server, IncomingMessage } from "http";
import { parse } from "url";
import { WebSocketRouter } from "./router";
import { WebSocketMessage } from "./types";

export class WebSocketServer {
  private wss: WSServer | null = null;
  private connections: Map<string, WebSocket> = new Map();
  private transactionHandlers: Map<string, any> = new Map();
  private readonly TRANSACTION_TIMEOUT = 30000;
  private router: WebSocketRouter;

  constructor() {
    this.router = new WebSocketRouter();
  }

  private handleMessage(
    connectionId: string,
    namespace: string,
    message: string
  ): void {
    try {
      const parsedMessage: WebSocketMessage & { namespace?: string } =
        JSON.parse(message.toString());
      const { route, data } = parsedMessage;

      if (!namespace || !route) {
        console.log("Missing namespace or route in websocket");
        return;
      }

      const handler = this.router.getHandler(namespace, route);
      if (handler) {
        handler.handler(connectionId, data);
      } else {
        console.log(
          `No handler found for namespace: ${namespace}, route: ${route}`
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
    this.wss = new WSServer({ server });

    this.wss.on("connection", (ws, req: IncomingMessage) => {
      const routeNamespace = String(parse(req.url || "", true).query.n);

      if (!routeNamespace) {
        // TODO: controlar validaciones
        ws.close();
        return;
      }

      const connectionId = crypto.randomUUID();
      this.connections.set(connectionId, ws);

      ws.on("message", (message: string) => {
        this.handleMessage(connectionId, routeNamespace, message);
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
