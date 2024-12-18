import { Router, Request, Response } from "express";

const router = Router();

router.get("/hola", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

module.exports = router;
