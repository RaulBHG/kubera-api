import { LogLevel } from "../value-objects/LogLevel";

export class LogMessage {
  constructor(
    public readonly message: string,
    public readonly name: string = "default",
    public readonly level: LogLevel = LogLevel.INFO,
    public readonly context: string = "",
    public readonly parentId: string = "",
    public readonly attributes: Record<string, unknown> = {},
    public readonly timestamp: string = new Date().toISOString()
  ) {}

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
