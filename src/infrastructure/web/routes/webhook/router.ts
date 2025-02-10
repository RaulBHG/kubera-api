import express, { Express, Router, Request, Response } from "express";
import { MockedHandleTxnWebhookController } from "../../../controllers/webhook/MockedTxnWebhookController";

const mockedWebhookRoutes = Router();
const app: Express = express();

app.use(express.json());

mockedWebhookRoutes.post("/txn-webhook", (req: Request, res: Response) => {
  new MockedHandleTxnWebhookController().handleWebhook(req, res);
});

app.use("/mock", mockedWebhookRoutes);

module.exports = app;
