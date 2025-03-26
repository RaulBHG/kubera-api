import { WebSocketMessage } from "../../shared/websocket/WebsocketContracts";
import { WebSocketServer } from "../../shared/websocket/WebSocketServer";

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
