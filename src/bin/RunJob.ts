#!/usr/bin/env node
import { ScrapSteamDbTags } from "../application/jobs/ScrapSteamDbTags";
import { JobRunner } from "../infrastructure/jobs/JobRunner";
import { setupCommands } from "../infrastructure/cli/commands";
import dotenv from "dotenv";

dotenv.config();

const jobRunner = new JobRunner();
jobRunner.registerJob(new ScrapSteamDbTags());

const program = setupCommands(jobRunner);
program.parse(process.argv);
