import express, { Express, Router, Request, Response } from "express";
import { CategoryController } from "../../../controllers/CategoryController";
import { SteamController } from "../../../controllers/SteamController";
import { PlatformController } from "../../../controllers/PlatformController";

const mysteryBoxRouter = Router();
const app: Express = express();

// Middleware to parse JSON bodies
app.use(express.json());

mysteryBoxRouter.get("/category", (req: Request, res: Response) => {
  new CategoryController().getAll(res);
});
mysteryBoxRouter.post("/steam/user", (req: Request, res: Response) => {
  new SteamController().storeAccountData(req, res);
});
mysteryBoxRouter.get("/platform", (req: Request, res: Response) => {
  new PlatformController().getAll(res);
});
app.use("/mystery-box", mysteryBoxRouter);

module.exports = app;
