import { Controller } from "../Controller";
import { WebsocketConnectionPublisher } from "../../publishers/websocket/WebsocketConnectionPublisher";
import { WebSocketServer } from "../../shared/websocket/server";
import { MockedTxnServiceContract } from "../../../domain/contracts/MockedTxnServiceContract";

export class MockedHandleTxnWebsocketController extends Controller {
  constructor(
    private mockedTxnService: MockedTxnServiceContract,
    private wsServer: WebSocketServer
  ) {
    super();
  }

  async handleStore({
    connectionId,
    data,
  }: {
    connectionId: string;
    data: {
      // TODO: validar un esquema de datos
      [key: string]: any;
    };
  }): Promise<void> {
    try {
      const newTxnId = this.mockedTxnService.store(connectionId, data);
    } catch (error) {
      console.log(error);
    }
  }

  async handleGetStatusByTxnId(
    connectionId: string,
    txnId: string
  ): Promise<void> {
    try {
      const txnStatus = this.mockedTxnService.getStatusByTxnId(txnId);
      if (txnStatus) {
        const websocketPublisher = new WebsocketConnectionPublisher(
          this.wsServer
        );
        const published = websocketPublisher.toConnectionId(connectionId, {
          namespace: "txns",
          type: "status_update",
          payload: txnStatus,
        });
        console.log(`Published status update: ${published}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
