export interface JobContract {
  execute(): Promise<void>;
  getName(): string;
}
