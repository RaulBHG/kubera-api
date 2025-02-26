export interface WebSocketMessage {
  namespace?: string;
  route: string;
  data: any;
  transaction_id?: string;
}

export interface TransactionStatus {
  transaction_id: string;
  status: "processing" | "completed" | "failed";
  timestamp: number;
  details?: any;
}

export interface WebSocketHandler {
  route: string;
  namespace: string;
  handle: (connectionId: string, data: any) => void | Promise<void>;
}

export interface WebSocketRouteNamespace {
  namespace: string;
  handlers: WebSocketHandler[];
}

