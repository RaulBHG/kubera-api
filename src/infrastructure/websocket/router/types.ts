export interface WebSocketHandler {
  type: string;
  handler: (connectionId: string, payload: any) => void | Promise<void>;
}

export interface WebSocketRoute {
  namespace: string;
  handlers: WebSocketHandler[];
}
