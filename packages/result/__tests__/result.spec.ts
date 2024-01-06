import { Ok, Error, Result } from '../src/result';
import { getErrorClass } from '../src/custom-error';

enum TestErrorCode {
  Test = 'Test',
}

const TestError = getErrorClass<TestErrorCode>();

describe('result wrapper', () => {
  it('can call unwrap on ok value', () => {
    const ok = Ok('test');
    expect(ok.unwrap()).toEqual('test');
  });

  it('will throw custom error when call unwrap on error', () => {
    const error = Error('test', TestErrorCode.Test);
    expect(() => error.unwrap()).toThrow(
      'Cannot unwrap Ok value of Result.Error'
    );
  });

  it('will return original value when call unwrapOr on ok value', () => {
    const ok = Ok('test1');
    expect(ok.unwrapOr('test2')).toEqual('test1');
  });

  it('will return fallback value when call unwrapOr on error', () => {
    const error = Error('test', TestErrorCode.Test);
    expect(error.unwrapOr('fallback')).toEqual('fallback');
  });

  it('will unwrap custom error when call unwrapErr on error', () => {
    const error = Error('test', TestErrorCode.Test).unwrapError();
    expect(error.code).toEqual(TestErrorCode.Test);
    expect(error.message).toEqual('test');
  });

  it('will throw error when call unwrapError on ok', () => {
    expect(() => Ok('').unwrapError()).toThrow();
  });

  it('will return original value when call expect on ok value', () => {
    const ok = Ok('test1');
    expect(ok.expect({ msg: 'test2', code: TestErrorCode.Test })).toEqual(
      'test1'
    );
  });

  it('will throw custom error when call expect on error', () => {
    const error = Error('test1', TestErrorCode.Test);
    expect(() =>
      error.expect({ msg: 'test2', code: TestErrorCode.Test })
    ).toThrow('test2');
  });

  it('can partial override custom error by calling expect', () => {
    const error = Error('test1', TestErrorCode.Test);
    expect(() => error.expect({ msg: 'test2' })).toThrow('test2');
  });

  it('will re-use custom error by calling expect without new params', () => {
    const error = Error('test1', TestErrorCode.Test);
    expect(() => error.expect()).toThrow('test1');
  });

  it('can use match to handle ok value and error', () => {
    const ok = Ok('test');
    expect(
      ok.match({
        ok: val => val + '1',
        err: err => err.message,
      })
    ).toEqual('test1');

    const err = Error('test', TestErrorCode.Test);
    expect(
      err.match({
        ok: val => val,
        err: err => err.code.toString(),
      })
    ).toEqual(TestErrorCode.Test);
  });

  it('can check type', () => {
    const ok = Ok('test');
    expect(ok.isOk()).toBe(true);
    expect(ok.isError()).toBe(false);

    const err = Error('test', TestErrorCode.Test);
    expect(err.isOk()).toBe(false);
    expect(err.isError()).toBe(true);
  });

  it('can use map to transform result', () => {
    const ok = Ok('test');
    expect(ok.map(val => val.length).unwrap()).toEqual(4);
  });

  it('will return original Error when map on Error', () => {
    const err = Error('test', TestErrorCode.Test);
    expect(err.map(val => val).isOk()).toBe(false);
  });

  it('can use mapError to transform error', () => {
    const err = Error('test', TestErrorCode.Test);
    const transformedErr = err.mapError(
      () => new TestError({ msg: 'test1', code: TestErrorCode.Test })
    );
    transformedErr.match({
      ok: val => val,
      err: err => {
        expect(err.message).toEqual('test1');
        expect(err.code).toEqual(TestErrorCode.Test);
        return err;
      },
    });
  });

  it('will return Ok when mapError on Ok', () => {
    const ok = Ok('test');
    expect(
      ok
        .mapError(
          () => new TestError({ msg: 'test1', code: TestErrorCode.Test })
        )
        .unwrap()
    ).toEqual('test');
  });

  it('is invalid to pass unknown error without error code', () => {
    expect(() => {
      // this is impossible in typescrpit world, just a runtime check for safety
      Error('foo' as any);
    }).toThrow('a');
  });

  it('chainable', () => {
    function getResult(): Result<string, TestErrorCode> {
      return Ok('1');
    }

    function loader(): Result<number, TestErrorCode> {
      const result = getResult();
      return result
        .map(val => parseInt(val))
        .mapError(
          error => new TestError({ code: TestErrorCode.Test, msg: error })
        );
    }

    function loader2(): Result<number, TestErrorCode> {
      const result = getResult();
      if (result.isError()) {
        return result.mapError(
          error => new TestError({ code: TestErrorCode.Test, msg: error })
        );
      }
      return result.map(val => parseInt(val));
    }

    expect(loader().unwrap()).toEqual(1);
    expect(loader2().unwrap()).toEqual(1);
  });
});
