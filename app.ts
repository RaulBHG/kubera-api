import express, { Express } from "express";
import dotenv from "dotenv";
const config = require("./config/config.js");

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT || 3000;
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

app.use(require("./src/infrastructure/web/routes/api"));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
