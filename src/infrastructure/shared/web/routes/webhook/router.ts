import express, { Express, Router, Request, Response } from "express";
import { MockedHandleTxnWebhookController } from "../../../../controllers/webhook/MockedTxnWebhookController";
import { PinoLoggerAdapter } from "../../../../adapters/log/PinoLoggerAdapter";

const diContainer = require("../../../../../infrastructure/shared/DIContainer");

const mockedWebhookRoutes = Router();
const app: Express = express();

app.use(express.json());

mockedWebhookRoutes.post("/txn-webhook", (req: Request, res: Response) => {
  new MockedHandleTxnWebhookController(
    diContainer.resolve("mockedTxnService")
  ).handleWebhook(req, res);
});

app.use("/mock", mockedWebhookRoutes);

module.exports = app;
