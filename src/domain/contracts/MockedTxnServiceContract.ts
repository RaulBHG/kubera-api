import { TransactionStatus } from "../../infrastructure/shared/websocket/types";

export interface MockedTxnServiceContract {
  store(wsConnectionId: string, data: { [key: string]: any }): Promise<string>;
  updateStatusByTxnId(txnId: string, status: string): Promise<void>;
  getStatusByTxnId(txnId: string): TransactionStatus | undefined;
}
