import { LoggerContract } from "../../../domain/contracts/LoggerContract";
import { LogMessage } from "../../../domain/entities/LogMessage";
import { LogLevel } from "../../../domain/value-objects/LogLevel";
import pino from "pino";
import path from "path";

export class PinoLoggerAdapter implements LoggerContract {
  private readonly logger: pino.Logger;

  constructor(logFilePath: string = "logs/app.log") {
    const logDir = path.dirname(logFilePath);
    if (!require("fs").existsSync(logDir)) {
      require("fs").mkdirSync(logDir, { recursive: true });
    }

    this.logger = pino(
      {
        level: "trace",
        formatters: {
          level: (label) => ({ level: label }),
        },
      },
      pino.destination({
        dest: logFilePath,
        sync: true,
      })
    );
  }

  async log(
    message: string,
    options: {
      name?: string;
      level?: LogLevel;
      context?: string;
      parentId?: string;
      attributes?: Record<string, unknown>;
    } = {}
  ): Promise<LogMessage> {
    const logMessage = new LogMessage(
      message,
      options.name,
      options.level,
      options.context,
      options.parentId,
      options.attributes
    );

    this.logger[logMessage.level](
      {
        name: logMessage.name,
        context: logMessage.context,
        parentId: logMessage.parentId,
        attributes: logMessage.attributes,
        timestamp: logMessage.timestamp,
      },
      logMessage.message
    );

    console.log(logMessage);

    return logMessage;
  }
}
