import pino from 'pino';

export enum LoggerLevel {
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Error = 'error',
}

export enum LoggerType {
  Resolver = 'RESOLVER',
  Default = 'DEFAULT',
  Orm = 'ORM',
}

class Logger {
  private logger = pino({
    timestamp: () => `, "time": "${new Date(Date.now()).toUTCString()}"`,
  });

  constructor(private type: LoggerType = LoggerType.Default) {}

  public warn(message: string) {
    this.logger.warn({ level: LoggerLevel.Warn, type: this.type, message });
  }

  public info(message: string) {
    this.logger.info({ level: LoggerLevel.Info, type: this.type, message });
  }

  public debug(message: string) {
    this.logger.debug({ level: LoggerLevel.Debug, type: this.type, message });
  }

  public error(message: string) {
    this.logger.error({ level: LoggerLevel.Info, type: this.type, message });
  }
}

export const ResolverLogger = new Logger(LoggerType.Resolver);
export const ServerLogger = new Logger();
export const OrmLogger = new Logger(LoggerType.Orm);

export default Logger;
