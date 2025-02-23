export interface WebSocketHandler {
  type: string;
  handler: (connectionId: string, payload: any) => void | Promise<void>;
}

export interface WebSocketRouteNamespace {
  namespace: string;
  handlers: WebSocketHandler[];
}
