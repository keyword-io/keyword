import { getErrorClass } from '../src/custom-error';

enum MyErrorCode {
  Foo,
  Bar,
}

const MyError = getErrorClass<MyErrorCode>();

describe('custom error', () => {
  it('can get a custom error with specific error code', () => {
    const myError = new MyError({ code: MyErrorCode.Foo, msg: '' });
    expect(myError.code).toBe(MyErrorCode.Foo);
  });

  it('can use an Error as message', () => {
    const error = new Error('original');
    const myError = new MyError({ code: MyErrorCode.Foo, msg: error });
    expect(myError.message).toEqual('original');
  });

  it('can use a string as message', () => {
    const myError = new MyError({ code: MyErrorCode.Foo, msg: 'string' });
    expect(myError.message).toEqual('string');
  });

  it('can use a serializable object as message', () => {
    const myError = new MyError({ code: MyErrorCode.Foo, msg: { a: 1 } });
    expect(myError.message).toEqual('{"a":1}');
  });

  it("can use an object's toString method if possible", () => {
    const obj: any = {
      toString() {
        return 'test';
      },
    };
    obj['a'] = obj;
    const myError = new MyError({ code: MyErrorCode.Foo, msg: obj });
    expect(myError.message).toEqual('test');
  });

  it('will fallback to a limit error message', () => {
    const myError = new MyError({ code: MyErrorCode.Foo, msg: 100 });
    expect(myError.message).toEqual("Unknown error '100'");
  });

  it('will collect original error stack', () => {
    const error = new Error('original');
    const myError = new MyError({ code: MyErrorCode.Foo, msg: error });
    expect(error.stack).toEqual(myError.stack);
  });
});
