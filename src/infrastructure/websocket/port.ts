import { WebSocketMessage } from "./server";

export interface WebSocketPort {
  /**
   * Broadcast a message to all connected clients
   */
  broadcast(message: WebSocketMessage): void;

  /**
   * Send a message to a specific client
   */
  sendToClient(connectionId: string, message: WebSocketMessage): void;
}
