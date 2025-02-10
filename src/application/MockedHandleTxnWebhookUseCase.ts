import { LoggerContract } from "../domain/contracts/LoggerContract";
import { LogLevel } from "../domain/value-objects/LogLevel";
import { mockedTxnService } from "./services/MockedTxnService";
import { TransactionStatus } from "../infrastructure/websocket/types";

export class MockedHandleTxnWebhookUseCase {
  constructor(private readonly logger: LoggerContract) {}

  async process(txnId: string, txnStatus: TransactionStatus["status"]) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.processTxnWebhook(txnId, txnStatus);
        resolve(txnId);
      } catch (error) {
        reject(error);
      }
    });
  }

  async processTxnWebhook(
    txnId: string,
    txnStatus: TransactionStatus["status"]
  ) {
    this.logger.log("Txn webhook received", {
      level: LogLevel.INFO,
      context: "MockedHandleTxnWebhookUseCase",
      attributes: {
        txnId,
        txnStatus,
      },
    });

    await mockedTxnService().updateTransactionStatus(txnId, txnStatus);

    this.logger.log("Txn webhook processed", {
      level: LogLevel.INFO,
      context: "MockedHandleTxnWebhookUseCase",
      attributes: {
        txnId,
        txnStatus,
      },
    });
  }
}
