import { JobContract } from "../../domain/contracts/JobContract";

export class JobRunner {
  private jobs: Map<string, JobContract> = new Map();

  registerJob(job: JobContract): void {
    this.jobs.set(job.getName(), job);
  }

  async runJob(jobName: string): Promise<void> {
    const job = this.jobs.get(jobName);
    if (!job) {
      throw new Error(`Job [${jobName}] not found`);
    }
    return await job.execute();
  }

  getRegisteredJobs(): string[] {
    return Array.from(this.jobs.keys());
  }
}
