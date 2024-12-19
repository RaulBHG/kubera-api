import express, { Express, Router, Request, Response } from "express";
import { CategoryController } from "../../../controllers/CategoryController";
import { PlatformController } from "../../../controllers/PlatformController";

const mysteryBoxRouter = Router();
const app: Express = express();

mysteryBoxRouter.get("/category", (req: Request, res: Response) => {
  new CategoryController().getAll(res);
});
mysteryBoxRouter.get("/platform", (req: Request, res: Response) => {
  new PlatformController().getAll(res);
});
app.use("/mystery-box", mysteryBoxRouter);

module.exports = app;
