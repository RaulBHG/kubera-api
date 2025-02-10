import { WebSocketRoute } from "../router/types";
import { WebSocketServer } from "../server";
import { TransactionStatus, WebSocketMessage } from "../types";
import { serverInstance } from "../../server/index";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockedTransactionManager {
  private static instance: MockedTransactionManager;
  private transactions: Map<string, TransactionStatus> = new Map();
  private wsServer: WebSocketServer;

  private constructor(wsServer: WebSocketServer) {
    this.wsServer = wsServer;
  }

  public static getInstance(
    wsServer: WebSocketServer
  ): MockedTransactionManager {
    if (!MockedTransactionManager.instance) {
      MockedTransactionManager.instance = new MockedTransactionManager(
        wsServer
      );
    }
    return MockedTransactionManager.instance;
  }

  public async processTransaction(
    connectionId: string,
    payload: any
  ): Promise<void> {
    const txnId = `txn-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)}`;

    // Initial status
    const initialStatus: TransactionStatus = {
      transaction_id: txnId,
      status: "processing",
      timestamp: Date.now(),
      details: { message: "Transaction initiated" },
    };

    this.transactions.set(txnId, initialStatus);

    // Send initial status
    this.wsServer.sendToClient(connectionId, {
      namespace: "txns",
      type: "status_update",
      payload: initialStatus,
    });

    // Simulate processing delay
    await delay(10000);

    // Update status to completed
    const finalStatus: TransactionStatus = {
      transaction_id: txnId,
      status: "completed",
      timestamp: Date.now(),
      details: {
        message: "Transaction completed successfully",
        amount: payload.amount || 100,
        currency: payload.currency || "USD",
      },
    };

    this.transactions.set(txnId, finalStatus);

    // Send final status
    this.wsServer.sendToClient(connectionId, {
      namespace: "txns",
      type: "status_update",
      payload: finalStatus,
    });
  }

  public getTransactionStatus(txnId: string): TransactionStatus | undefined {
    return this.transactions.get(txnId);
  }
}

const transactionHandlers: WebSocketRoute = {
  namespace: "txns",
  handlers: [
    {
      type: "initiate",
      handler: async (connectionId: string, payload: any) => {
        console.log(`Client ${connectionId} initiated transaction:`, payload);
        const txnManager = MockedTransactionManager.getInstance(
          serverInstance.getWebSocketServer()
        );
        await txnManager.processTransaction(connectionId, payload);
      },
    },
    {
      type: "query_status",
      handler: async (connectionId: string, payload: any) => {
        const { transaction_id } = payload;
        const txnManager = MockedTransactionManager.getInstance(
          serverInstance.getWebSocketServer()
        );
        const status = txnManager.getTransactionStatus(transaction_id);

        if (status) {
          (global as any).wsServer.sendToClient(connectionId, {
            namespace: "txns",
            type: "status_update",
            payload: status,
          });
        }
      },
    },
  ],
};

export default transactionHandlers;
