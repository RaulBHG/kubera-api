import { LoggerContract } from "../domain/contracts/LoggerContract";
import { LogLevel } from "../domain/value-objects/LogLevel";

export class MockedHandleTxnWebhookUseCase {
  constructor(private readonly logger: LoggerContract) {}

  async process(txnId: string, txnStatus: string) {
    return new Promise(async (resolve, reject) => {
      await this.processTxnWebhook(txnId, txnStatus, resolve, reject);
    });
  }

  async processTxnWebhook(
    txnId: string,
    txnStatus: string,
    resolve: any,
    reject: any
  ) {
    this.logger.log("Txn webhook received", {
      level: LogLevel.INFO,
      context: "MockedHandleTxnWebhookUseCase",
      attributes: {
        txnId,
        txnStatus,
      },
    });

    resolve(txnId);
  }
}
