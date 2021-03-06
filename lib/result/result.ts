import { isMissing, isFunction, isObject, isOneOf } from "../utils/utils.ts";

enum ResultType {
  Ok,
  Err,
}

interface ResultMatch<T, E, U> {
  ok(value: T): U;
  err(error: E): U;
}

/**
 * Represents a runtime-safe result of an operation. The operation might be successful, in which case a `Result`
 * instance wrapping the produced value of type `T` is returned. Otherwise, when the operation fails a `Result`
 * instance wrapping the error of type `E` is returned.
 */
export interface Result<T, E> {
  readonly _type: ResultType;

  /**
   * Indicates whether the result is a `ResultOk` instance.
   */
  readonly isOk: boolean;

  /**
   * Indicates whether the result is a `ResultErr` instance.
   */
  readonly isErr: boolean,

  /**
   * If the result is a `ResultOk` instance invokes the `@handler` function, providing the wrapped value as the
   * argument and returns the result. Otherwise, returns the original `ResultErr` instance.
   */
  map<U>(handler: (value: T) => U): Result<U, E>;

  /**
   * If the result is a `ResultOk` instance invokes the `@handler.ok` function, providing the wrapped value as the
   * argument and returns the result.
   *
   * Otherwise, invokes the `@handler.err` function, providing the wrapped error as the argument and returns the result.
   */
  match<U>(handler: ResultMatch<T, E, U>): U;

  /**
   * If the result is a `ResultOk` instance invokes the `@handler` function, providing the wrapped value as the
   * argument.
   */
  matchOk(handler: (value: T) => void): void;

  /**
   * If the result is a `ResultErr` instance invokes the `@handler` function, providing the wrapped error as the
   * argument.
   */
  matchErr(handler: (error: E) => void): void;

  /**
   * If the result is a `ResultOk` instance returns the wrapped value. Otherwise, throws an `Error`.
   */
  unwrap(): T | never;

  /**
   * If the result is a `ResultErr` instance returns the specified `@def` value. Otherwise, returns the original
   * wrapped value.
   */
  unwrapOr(def: T): T;

  /**
   * If the result is a `ResultErr` instance returns the wrapped error. Otherwise, throws an `Error`.
   */
  unwrapErr(): E | never;

  /**
   * If the result is a `ResultOk` instance invokes the `@handler` function, providing the wrapped value as the
   * argument and returns the result. Otherwise, returns the original `ResultErr` instance.
   */
  andThen<U>(handler: (value: T) => Result<U, E>): Result<U, E>;

  /**
   * If the result is a `ResultErr` instance invokes the `@handler` function, providing the wrapped error as the
   * argument and returns the result. Otherwise, returns the original `ResultOk` instance.
   */
  orElse<U>(handler: (error: E) => Result<U, E>): Result<T | U, E>;
}

interface ResultOk<T, E = never> extends Result<T, E> {
  map<U>(handler: (value: T) => U): ResultOk<U, never>;
  match<U>(handler: ResultMatch<T, never, U>): U;
  matchOk(handler: (value: T) => void): void;
  matchErr(handler: (error: E) => void): void;
  unwrap(): T;
  unwrapErr(): never;
  orElse<U>(handler: (error: E) => Result<U, E>): ResultOk<T, E>;
}

interface ResultErr<T, E> extends Result<T, E> {
  map<U>(handler: (value: T) => U): ResultErr<never, E>;
  match<U>(handler: ResultMatch<never, E, U>): U;
  matchOk(handler: (value: T) => void): void;
  matchErr(handler: (error: E) => void): void;
  unwrap(): never;
  unwrapErr(): E;
  andThen<U>(handler: (value: T) => Result<U, E>): ResultErr<never, E>;
  orElse<U>(handler: (error: E) => Result<U, E>): Result<U, E>;
}

/**
 * Creates a new `ResultOk<T, E>` instance, wrapping the specified `@value`.
 */
export const ok = <T, E = never>(value: T): ResultOk<T, E> => {
  if (isMissing(value)) {
    throw new Error(
      "ok(value) expected @value to be present, but it was missing."
    );
  }

  return {
    _type: ResultType.Ok,
    isOk: true,
    isErr: false,
    map: <U>(handler: (value: T) => U): ResultOk<U, never> => {
      if (!isFunction(handler)) {
        throw new Error(
          "ResultErr.map(handler) expected @handler to be a function."
        );
      }
      return ok(handler(value));
    },
    match: <U>(handler: ResultMatch<T, never, U>): U => {
      if (!isFunction(handler.ok)) {
        throw new Error(
          "ResulkOk.match(handler) expected @handler.ok to be a function."
        );
      }
      return handler.ok(value);
    },
    matchOk: (handler: (value: T) => void): void => {
      if (!isFunction(handler)) {
        throw new Error(
          "ResultOk.matchOk(handler) expected @handler to be a function."
        );
      }
      handler(value);
    },
    matchErr: (): void => {},
    unwrap: (): T => value,
    unwrapOr: (): T => value,
    unwrapErr: (): never => {
      throw new Error(
        "Cannot execute unwrapErr() on type ResultOk."
      );
    },
    andThen: <U>(handler: (value: T) => Result<U, E>): Result<U, E> => {
      if (!isFunction(handler)) {
        throw new Error(
          "ResultErr.andThen(handler) expected @handler to be a function."
        );
      }
      return handler(value);
    },
    orElse: (): ResultOk<T, E> => ok(value),
  };
};

/**
 * Creates a new `ResultErr<T, E>` instance, wrapping the specified `@error`.
 */
export const err = <T, E>(error: E): ResultErr<T, E> => {
  return {
    _type: ResultType.Err,
    isOk: false,
    isErr: true,
    map: (): ResultErr<never, E> => err(error),
    match: <U>(handler: ResultMatch<never, E, U>): U => {
      if (!isFunction(handler.err)) {
        throw new Error(
          "ResultErr.match(handler) expected @handler.err to be a function."
        );
      }
      return handler.err(error);
    },
    matchOk: (): void => {},
    matchErr: (handler: (error: E) => void): void => {
      if (!isFunction(handler)) {
        throw new Error(
          "ResultErr.matchErr(handler) expected @handler to be a function."
        );
      }
      handler(error);
    },
    unwrap: (): never => {
      throw new Error(
        "Cannot execute unwrap() on type ResultErr."
      );
    },
    unwrapOr: (def: T): T => def,
    unwrapErr: (): E => error,
    andThen: <U>(handler: (value: T) => Result<U, E>): ResultErr<never, E> => {
      return err(error);
    },
    orElse: <U>(handler: (error: E) => Result<U, E>): Result<U, E> => {
      if (!isFunction(handler)) {
        throw new Error(
          "ResultErr.orElse(handler) expected @handler.err to be a function."
        );
      }
      return handler(error);
    },
  };
};

/**
 * Type-safe check whether `@value` is of type `Result<T, E>`.
 */
export const isResult = <T, E>(value: Result<T, E> | any): value is Result<T, E> => {
  return (
    isObject(value) &&
    isOneOf(value._type, [ResultType.Ok, ResultType.Err])
  );
};

/**
 * Type-safe check whether `@result` is of type `ResultOk<T, E>`.
 *
 * If `@result` is neither `ResultOk` nor `ResultErr` an `Error` is thrown.
 */
export const isOk = <T, E>(result: Result<T, E>): result is ResultOk<T, E> => {
  if (!isResult(result)) {
    throw new Error(
      "isOk(value) expected @value to be of type Result<T, E>."
    );
  }
  return result._type === ResultType.Ok;
};

/**
 * Type-safe check whether `@result` is of type `ResultErr<T, E>`.
 *
 * If `@result` is neither `ResultOk` nor `ResultErr` an `Error` is thrown.
 */
export const isErr = <T, E>(result: Result<T, E>): result is Result<T, E> => {
  if (!isResult(result)) {
    throw new Error(
      "isNone(value) expected @value to be type Result<T, E>."
    );
  }
  return result._type === ResultType.Err;
};
