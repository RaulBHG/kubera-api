import { WebSocketMessage } from "../../shared/websocket/router/types";
import { WebSocketServer } from "../../shared/websocket/server";

export class WebsocketConnectionPublisher {
  private wsServer: WebSocketServer;

  constructor(wsServer: WebSocketServer) {
    this.wsServer = wsServer;
  }

  public toConnectionId(connectionId: string, message: WebSocketMessage): void {
    const ws = this.wsServer.getConnectionById(connectionId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
}
