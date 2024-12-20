import { Command } from "commander";
import { JobRunner } from "../jobs/JobRunner";

export function setupCommands(jobRunner: JobRunner): Command {
  const program = new Command();

  program
    .command("run <jobName>")
    .description("Run a specific job")
    .action(async (jobName: string) => {
      try {
        await jobRunner.runJob(jobName);
        process.exit(0);
      } catch (error) {
        console.error(`[job][${jobName}] failed:`, error);
        process.exit(1);
      }
    });

  program
    .command("list")
    .description("List all available jobs")
    .action(() => {
      const jobs = jobRunner.getRegisteredJobs();
      console.log("Available jobs:");
      jobs.forEach((job) => console.log(`- ${job}`));
      process.exit(0);
    });

  return program;
}
