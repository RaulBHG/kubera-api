import { MockedTxnServiceContract } from "../domain/contracts/MockedTxnServiceContract";
import { TransactionStatus } from "../infrastructure/shared/websocket/types";

export class MockedHandleTxnWebhookUseCase {
  constructor(private mockedTxnService: MockedTxnServiceContract) {}

  async handle(txnId: string, newTxnStatus: TransactionStatus["status"]) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.mockedTxnService.updateStatusByTxnId(txnId, newTxnStatus);
        resolve(txnId);
      } catch (error) {
        reject(error);
      }
    });
  }
}
