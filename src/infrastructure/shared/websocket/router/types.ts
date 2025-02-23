export interface WebSocketHandler {
  route: string;
  namespace: string;
  handler: (connectionId: string, data: any) => void | Promise<void>;
}

export interface WebSocketRouteNamespace {
  namespace: string;
  handlers: WebSocketHandler[];
}
