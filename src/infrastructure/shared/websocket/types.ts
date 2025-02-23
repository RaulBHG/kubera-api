export interface WebSocketMessage {
  namespace: string;
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
