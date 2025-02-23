import { WebSocketRouteNamespace } from "../router/types";
import { MockedHandleTxnWebsocketController } from "../../../controllers/websocket/MockedTxnWebsocketController";
import { ServerInstance } from "../../server";
import { MockedTxnService } from "../../../../application/services/MockedTxnService";
import { WebSocketServer } from "../server";

const diContainer = ServerInstance.getInstance().getDiContainer();

const mockedTxnWebsocketController = new MockedHandleTxnWebsocketController(
  diContainer.resolve("mockedTxnService") as MockedTxnService,
  diContainer.resolve("webSocketServer") as WebSocketServer
);

const txnRoutes: WebSocketRouteNamespace = {
  namespace: "txns",
  handlers: [
    /**
     * @desc Ruta websocket para iniciar una transaccion mystery box
     */
    {
      type: "store",
      // @ts-ignore
      handler: async (connectionId: string, payload: any) => {
        // TODO: anadir validacion sobre mensajes websocket
        mockedTxnWebsocketController.handleStore({
          connectionId,
          data: payload,
        });
      },
    },

    /**
     * @desc Ruta websocket para obtener el estado de una transaccion
     */
    {
      type: "getStatusByTxnId",
      handler: async (
        connectionId: string,
        payload: {
          txn_id: string;
        }
      ) => {
        // TODO: anadir validacion sobre mensajes websocket
        const { txn_id: txnId } = payload;
        mockedTxnWebsocketController.handleGetStatusByTxnId(
          connectionId,
          txnId
        );
      },
    },
  ],
};

export default txnRoutes;
