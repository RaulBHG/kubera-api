import express, { Express } from "express";

const app: Express = express();

app.use("/webhook", require("./webhook/router"));

module.exports = app;