import { WebSocketRoute } from "../router/types";
import { serverInstance } from "../../server/index";
import { mockedTxnService } from "../../../application/services/MockedTxnService";

const transactionHandlers: WebSocketRoute = {
  namespace: "txns",
  handlers: [
    {
      type: "initiate",
      // @ts-ignore
      handler: async (connectionId: string, payload: any) => {
        const txnId = await mockedTxnService().processTransaction(
          connectionId,
          payload
        );
        return txnId;
      },
    },
    {
      type: "query_status",
      handler: async (connectionId: string, payload: any) => {
        const { transaction_id } = payload;
        const status = mockedTxnService().getTransactionStatus(transaction_id);

        if (status) {
          serverInstance.getWebSocketServer().sendToClient(connectionId, {
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
