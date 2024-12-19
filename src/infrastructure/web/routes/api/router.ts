import express, { Express, Router, Request, Response } from "express";
import { CategoryController } from "../../../controllers/CategoryController";

const mysteryBoxRouter = Router();
const app: Express = express();

mysteryBoxRouter.get("/category", (req: Request, res: Response) => {
  new CategoryController().getAll(res);
});
app.use("/mystery-box", mysteryBoxRouter); 

module.exports = app;
