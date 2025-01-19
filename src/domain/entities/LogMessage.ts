import { LogLevel } from "../value-objects/LogLevel";

export class LogMessage {
  constructor(
    private readonly message: string,
    private readonly name: string = "default",
    private readonly level: LogLevel = LogLevel.INFO,
    private readonly context: string = "",
    private readonly parentId: string = "",
    private readonly attributes: Record<string, unknown> = {},
    private readonly timestamp: string = new Date().toISOString()
  ) {}

  getName(): string {
    return this.name;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  getLevelName(): string {
    return this.level.toString();
  }

  getContext(): string {
    return this.context;
  }

  getParentId(): string {
    return this.parentId;
  }

  getAttributes(): Record<string, unknown> {
    return this.attributes;
  }

  getMessage(): string {
    return this.message;
  }

  getTimestamp(): string {
    return this.timestamp;
  }

  toJSON(): Record<string, unknown> {
    return {
      message: this.message,
      name: this.name,
      level: this.level,
      context: this.context,
      parentId: this.parentId,
      attributes: this.attributes,
      timestamp: this.timestamp,
    };
  }
}
