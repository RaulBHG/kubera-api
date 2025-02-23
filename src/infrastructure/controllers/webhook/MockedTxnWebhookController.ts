import { MockedTxnServiceContract } from "../../../domain/contracts/MockedTxnServiceContract";
import { MockedHandleTxnWebhookUseCase } from "../../../application/MockedHandleTxnWebhookUseCase";
import { Request, Response } from "express";
import { Controller } from "../Controller";
import Joi from "joi";

export class MockedHandleTxnWebhookController extends Controller {
  constructor(private mockedTxnService: MockedTxnServiceContract) {
    super();
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const schema = Joi.object({
        txn_id: Joi.string().required().messages({
          "any.required": "The txn_id field is required.",
        }),
        txn_status: Joi.string().required().messages({
          "any.required": "The txn_status field is required.",
        }),
      });
      if (!this.validateRequest(req, res, schema)) return;

      const txnId = req.body.txn_id;
      const txnStatus = req.body.txn_status;

      const useCase = new MockedHandleTxnWebhookUseCase(this.mockedTxnService);
      const result = await useCase.handle(txnId, txnStatus);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing mocked txn webhook",
      });
    }
  }
}
