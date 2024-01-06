import { CustomError, ErrorParams } from './custom-error';

export enum ResultType {
  Ok = 'Ok',
  Error = 'Error',
}

export const enum ResultErrorCode {
  UNWRAP_FAILED = 'UNWRAP_FAILED',
  UNWRAP_ERR_FAILED = 'UNWRAP_ERR_FAILED',
  INVALID_ERR = 'INVALID_ERR',
}

export interface Matcher<T, ErrorCode, U> {
  ok: (val: T) => U;
  err: (val: CustomError<ErrorCode>) => U;
}

export interface Result<T, ErrorCode> {
  type: ResultType;
  unwrap(): T | never;
  unwrapOr(optb: T): T;
  unwrapError(): CustomError<ErrorCode> | never;
  expect(params?: Partial<ErrorParams<ErrorCode>>): T | never;
  match<U>(matcher: Matcher<T, ErrorCode, U>): U;
  /**
   * ResOk does not care about error code type because
   * it will never have the error part.
   * Similarly, ResError does not care about result payload
   * becase it will never have the payload part too.
   */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  isOk(): this is ResOk<T, any>;
  isError(): this is ResError<any, ErrorCode>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  map<U>(fn: (t: T) => U): Result<U, ErrorCode>;
  mapError<FailedCode>(
    fn: (e: CustomError<ErrorCode>) => CustomError<FailedCode>
  ): Result<T, FailedCode>;
}

export interface ResOk<T, ErrorCode> extends Result<T, ErrorCode> {
  unwrap(): T;
  unwrapOr(optb: T): T;
  unwrapError(): never;
  expect(params?: Partial<ErrorParams<ErrorCode>>): T;
  match<U>(fn: Matcher<T, ErrorCode, U>): U;
  isOk(): true;
  isError(): false;
  map<U>(fn: (t: T) => U): ResOk<U, ErrorCode>;
  mapError<FailedCode>(
    fn: (e: CustomError<ErrorCode>) => CustomError<FailedCode>
  ): ResOk<T, FailedCode>;
}

export interface ResError<T, ErrorCode> extends Result<T, ErrorCode> {
  unwrap(): never;
  unwrapOr(optb: T): T;
  unwrapError(): CustomError<ErrorCode>;
  expect(params?: Partial<ErrorParams<ErrorCode>>): never;
  match<U>(fn: Matcher<never, ErrorCode, U>): U;
  isOk(): false;
  isError(): true;
  map<U>(fn: (t: T) => U): ResError<U, ErrorCode>;
  mapError<FailedCode>(
    fn: (e: CustomError<ErrorCode>) => CustomError<FailedCode>
  ): ResError<T, FailedCode>;
}

export function Ok<T, ErrorCode>(val: T): ResOk<T, ErrorCode> {
  return {
    type: ResultType.Ok,
    unwrap(): T {
      return val;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unwrapOr(_optb: T): T {
      return val;
    },
    unwrapError(): never {
      throw new CustomError({
        code: ResultErrorCode.UNWRAP_ERR_FAILED,
        msg: 'Cannot unwrap Err value of Result.Ok.',
      });
    },
    expect(): T {
      return val;
    },
    match<U>(fn: Matcher<T, ErrorCode, U>): U {
      return fn.ok(val);
    },
    isOk(): true {
      return true;
    },
    isError(): false {
      return false;
    },
    map<U>(fn: (t: T) => U): ResOk<U, ErrorCode> {
      return Ok(fn(val));
    },
    mapError<FailedCode>(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _fn: (e: CustomError<ErrorCode>) => CustomError<FailedCode>
    ): ResOk<T, FailedCode> {
      return Ok(val);
    },
  };
}

export function Error<T, ErrorCode>(
  err: CustomError<ErrorCode>
): ResError<T, ErrorCode>;
export function Error<T, ErrorCode, E = unknown>(
  err: E,
  code: ErrorCode
): ResError<T, ErrorCode>;
export function Error<T, ErrorCode, E = unknown>(
  err: E,
  code?: ErrorCode
): ResError<T, ErrorCode> {
  let _err: CustomError<ErrorCode>;

  if (err instanceof CustomError) {
    _err = err;
  } else if (code) {
    _err = new CustomError<ErrorCode>({ code, msg: err });
  } else {
    throw new CustomError({
      code: ResultErrorCode.INVALID_ERR,
      msg: 'invalid Error params',
    });
  }

  return {
    type: ResultType.Error,
    unwrap(): never {
      throw new CustomError({
        code: _err.code,
        msg:
          'Cannot unwrap Ok value of Result.Error.' +
          '\r\n' +
          `code: ${_err.code}` +
          '\r\n' +
          `message: ${_err.message}`,
      });
    },
    unwrapError(): CustomError<ErrorCode> {
      return _err;
    },
    unwrapOr(optb: T): T {
      return optb;
    },
    expect(params?: Partial<ErrorParams<ErrorCode>>): never {
      throw new CustomError({
        code: params?.code || _err.code,
        msg: params?.msg || _err.message,
      });
    },
    match<U>(fn: Matcher<never, ErrorCode, U>): U {
      return fn.err(_err);
    },
    isOk(): false {
      return false;
    },
    isError(): true {
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map<U>(_fn: (t: T) => U): ResError<U, ErrorCode> {
      return Error(_err);
    },
    mapError<FailedCode>(
      fn: (e: CustomError<ErrorCode>) => CustomError<FailedCode>
    ): ResError<T, FailedCode> {
      return Error(fn(_err));
    },
  };
}
