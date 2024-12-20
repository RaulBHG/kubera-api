import express, { Express } from "express";
import dotenv from "dotenv";
const config = require("./config/config.js");
import { JobRunner } from "./src/infrastructure/jobs/JobRunner";
import { ScrapingHttpClientAdapter } from "./src/infrastructure/adapters/http/ScrapingHttpClientAdapter";
import { ScrapSteamDbTags } from "./src/application/jobs/ScrapSteamDbTags";

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT || 3000;
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const jobRunner = new JobRunner();
jobRunner.registerJob(new ScrapSteamDbTags());

app.post("/api/jobs/:jobName/run", async (req, res) => {
  try {
    if (req.headers["user-agent"] !== "Kubera-jobs-API-client") {
      throw new Error("Unauthorized");
    }

    const jobResult = await jobRunner.runJob(req.params.jobName);
    res.json({
      success: true,
      data: jobResult,
      error_message: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      error_message: JSON.stringify(error),
    });
  }
});

app.get("/api/jobs", (req, res) => {
  if (req.headers["user-agent"] !== "Kubera-jobs-API-client") {
    throw new Error("Unauthorized");
  }

  const jobs = jobRunner.getRegisteredJobs();
  res.json({
    success: true,
    data: jobs,
    error_message: null,
  });
});

app.use(require("./src/infrastructure/web/routes/api"));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
