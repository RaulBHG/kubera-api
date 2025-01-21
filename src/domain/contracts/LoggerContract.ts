import { LogMessage } from "../entities/LogMessage";
import { LogLevel } from "../value-objects/LogLevel";

export interface LoggerContract {
  log(
    message: string,
    options?: {
      name?: string;
      level?: LogLevel;
      context?: string;
      parentId?: string;
      attributes?: Record<string, unknown>;
    }
  ): Promise<LogMessage>;
}
