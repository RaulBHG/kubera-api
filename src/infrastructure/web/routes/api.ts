import express, { Express } from "express";

const app: Express = express();

app.use("/api", require("./api/router"));

module.exports = app;
