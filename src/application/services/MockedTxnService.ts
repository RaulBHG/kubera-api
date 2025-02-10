import { WebSocketServer } from "../../infrastructure/websocket/server";
import {
  TransactionStatus,
  WebSocketMessage,
} from "../../infrastructure/websocket/types";
import { serverInstance } from "../../infrastructure/server/index";
import { LoggerContract } from "../../domain/contracts/LoggerContract";
import { PinoLoggerAdapter } from "../../infrastructure/adapters/log/PinoLoggerAdapter";

class MockedTxnService {
  private static instance: MockedTxnService;
  private transactions: Map<string, TransactionStatus> = new Map();
  private connectionMap: Map<string, string> = new Map(); // Maps txnId to connectionId
  private wsServer: WebSocketServer;
  private logger: LoggerContract;

  private constructor(wsServer: WebSocketServer) {
    this.wsServer = wsServer;
    this.logger = new PinoLoggerAdapter();
  }

  public static getInstance(wsServer: WebSocketServer): MockedTxnService {
    if (!MockedTxnService.instance) {
      MockedTxnService.instance = new MockedTxnService(wsServer);
    }
    return MockedTxnService.instance;
  }

  public async processTransaction(
    wsConnectionId: string,
    payload: any
  ): Promise<string> {
    const txnId = `txn-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)}`;

    // asociar Txn con Websocket connection
    this.connectionMap.set(txnId, wsConnectionId);

    // actualizar a un estasdo inicial "processing"
    const processingStatus: TransactionStatus = {
      transaction_id: txnId,
      status: "processing",
      timestamp: Date.now(),
      details: { message: "Transaction initiated" },
    };

    this.transactions.set(txnId, processingStatus);

    // enviar el estado inicial al cliente
    this.wsServer.sendToClient(wsConnectionId, {
      namespace: "txns",
      type: "status_update",
      payload: processingStatus,
    });

    this.logger.log("Transaction initiated", {
      context: "MockedTxnService",
      attributes: {
        txnId,
        payload,
      },
    });

    return txnId;
  }

  // se actualiza cuando el proveedor de pago confirme o no
  public async updateTransactionStatus(
    txnId: string,
    status: TransactionStatus["status"]
  ): Promise<void> {
    const connectionId = this.connectionMap.get(txnId);
    if (!connectionId) {
      throw new Error(`No connection found for transaction ${txnId}`);
    }

    const finalStatus: TransactionStatus = {
      transaction_id: txnId,
      status: status,
      timestamp: Date.now(),
      details: {
        message: `Transaction ${status}`,
      },
    };

    this.transactions.set(txnId, finalStatus);

    // enviar el estado final al cliente
    this.wsServer.sendToClient(connectionId, {
      namespace: "txns",
      type: "status_update",
      payload: finalStatus,
    });

    this.logger.log("Transaction status updated", {
      context: "MockedTxnService",
      attributes: {
        txnId,
        status,
      },
    });
  }

  public getTransactionStatus(txnId: string): TransactionStatus | undefined {
    return this.transactions.get(txnId);
  }
}

export const mockedTxnService = () =>
  MockedTxnService.getInstance(serverInstance.getWebSocketServer());
