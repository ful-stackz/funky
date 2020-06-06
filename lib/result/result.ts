import { isMissing, isFunction, isObject, isOneOf } from "../utils/utils.ts";

enum ResultType {
  Ok,
  Err,
}

export interface ResultMatch<T, E, U> {
  ok(value: T): U;
  err(error: E): U;
}

export interface Result<T, E> {
  readonly _type: ResultType;
  readonly isOk: boolean;
  readonly isErr: boolean,
  map<U>(handler: (value: T) => U): Result<U, E>;
  match<U>(handler: ResultMatch<T, E, U>): U;
  matchOk(handler: (value: T) => void): void;
  matchErr(handler: (error: E) => void): void;
  unwrap(): T | never;
  unwrapOr(def: T): T;
  unwrapErr(): E | never;
  andThen<U>(handler: (value: T) => Result<U, E>): Result<U, E>;
}

interface ResultOk<T, E = never> extends Result<T, E> {
  map<U>(handler: (value: T) => U): ResultOk<U, never>;
  match<U>(handler: ResultMatch<T, never, U>): U;
  matchOk(handler: (value: T) => void): void;
  matchErr(handler: (error: E) => void): void;
  unwrap(): T;
  unwrapErr(): never;
}

interface ResultErr<T, E> extends Result<T, E> {
  map<U>(handler: (value: T) => U): ResultErr<never, E>;
  match<U>(handler: ResultMatch<never, E, U>): U;
  matchOk(handler: (value: T) => void): void;
  matchErr(handler: (error: E) => void): void;
  unwrap(): never;
  unwrapErr(): E;
  andThen<U>(handler: (value: T) => Result<U, E>): ResultErr<never, E>;
}

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
  };
};

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
  };
};

export const isResult = <T, E>(value: Result<T, E> | any): value is Result<T, E> => {
  return (
    isObject(value) &&
    isOneOf(value._type, [ResultType.Ok, ResultType.Err])
  );
};

export const isOk = <T, E>(result: Result<T, E>): result is ResultOk<T, E> => {
  if (!isResult(result)) {
    throw new Error(
      "isOk(value) expected @value to be of type Result<T, E>."
    );
  }
  return result._type === ResultType.Ok;
};

export const isErr = <T, E>(result: Result<T, E>): result is Result<T, E> => {
  if (!isResult(result)) {
    throw new Error(
      "isNone(value) expected @value to be type Result<T, E>."
    );
  }
  return result._type === ResultType.Err;
};
