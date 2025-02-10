export interface WebSocketMessage {
  namespace: string;
  type: string;
  payload: any;
  transaction_id?: string;
}

export interface TransactionStatus {
  transaction_id: string;
  status: "processing" | "completed" | "failed";
  timestamp: number;
  details?: any;
}
