export interface Logger {
  info(msg: any);
  debug(msg: any);
  error(msg: any);
  trace(msg: any);
}

export class ConsoleLogger implements Logger {
    error(msg: any): void {
      console.error(msg)
    }

    trace(msg: any): void {
      console.trace(msg)
    }

    info(msg: any) {
      console.info(msg)
    }

    debug(msg: any) {
      console.debug(msg)
    }
}

export const logger: Logger = new ConsoleLogger()