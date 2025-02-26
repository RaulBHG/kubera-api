import { WebSocketServer } from "../../infrastructure/shared/websocket/WebSocketServer";
import { TransactionStatus } from "../../infrastructure/shared/websocket/WebsocketContracts";
import { LoggerContract } from "../../domain/contracts/LoggerContract";
import { WebsocketConnectionPublisher } from "../../infrastructure/publishers/websocket/WebsocketConnectionPublisher";
import { MockedTxnServiceContract } from "../../domain/contracts/MockedTxnServiceContract";


// TODO: ESTO NO TIENE QUE ESTAR AQUÍ A FUTURO
export class MockedTxnService implements MockedTxnServiceContract {
  private transactions: Map<string, TransactionStatus> = new Map();
  private connectionMap: Map<string, string> = new Map();
  private wsServer: WebSocketServer;
  private logger: LoggerContract;

  constructor({
    webSocketServer,
    logger,
  }: {
    webSocketServer: WebSocketServer;
    logger: LoggerContract;
  }) {
    this.wsServer = webSocketServer;
    this.logger = logger;
  }

  public async store(
    wsConnectionId: string,
    data: {
      [key: string]: any;
    }
  ): Promise<string> {
    // TODO: Implementar la lógica de almacenamiento de la transacción
    const txnId = `txn-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)}`;

    this.connectionMap.set(txnId, wsConnectionId);

    const processingStatus: TransactionStatus = {
      transaction_id: txnId,
      status: "processing",
      timestamp: Date.now(),
      details: { message: "Transaction initiated" },
    };

    this.transactions.set(txnId, processingStatus);

    // const wsPublisher = new WebsocketConnectionPublisher(this.wsServer);
    // const wsPublished = wsPublisher.toConnectionId(wsConnectionId, {
    //   namespace: "txns",
    //   type: "status_update",
    //   payload: processingStatus,
    // });

    console.log("New txn detected", {
      context: "MockedTxnService",
      attributes: {
        // wsPublished,
        txnId,
        payload: data,
        processingStatus,
      },
    });

    // this.logger.log();

    return txnId;
  }

  public async updateStatusByTxnId(
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

    const wsPublisher = new WebsocketConnectionPublisher(this.wsServer);
    const wsPublished = wsPublisher.toConnectionId(connectionId, {
      namespace: "txns",
      route: "status_update",
      data: finalStatus,
    });

    this.logger.log("Txn update detected", {
      context: "MockedTxnService",
      attributes: {
        wsPublished,
        txnId,
        status,
      },
    });
  }

  public getStatusByTxnId(txnId: string): TransactionStatus | undefined {
    return this.transactions.get(txnId);
  }
}
