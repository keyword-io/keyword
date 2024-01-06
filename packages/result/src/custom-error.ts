export interface ErrorParams<TCode> {
  code: TCode;
  msg: unknown;
}

export interface CustomErrorType<TCode> extends Function {
  new (p: ErrorParams<TCode>): CustomError<TCode>;
}

export class CustomError<TCode> extends Error {
  public code: TCode;

  public constructor({ code, msg }: ErrorParams<TCode>) {
    let _msg: string;
    let stack: string | undefined;
    if (msg instanceof Error) {
      _msg = msg.message;
      stack = msg.stack;
    } else if (typeof msg === 'string') {
      _msg = msg;
    } else if (
      typeof msg === 'object' &&
      msg !== null &&
      typeof msg.toString === 'function'
    ) {
      // try to serialize msg object
      try {
        _msg = JSON.stringify(msg);
      } catch (error) {
        _msg = msg.toString();
      }
    } else {
      _msg = `Unknown error '${String(msg)}'`;
    }
    /* istanbul ignore next */
    super(_msg);
    // we are compiling this code into es5 target which need set the prototype explicitly
    Object.setPrototypeOf(this, CustomError.prototype);

    this.code = code;
    if (stack) {
      this.stack = stack;
    }
  }
}

export function getErrorClass<TCode>(): CustomErrorType<TCode> {
  return CustomError;
}
