import { isMissing, isFunction, isObject, isOneOf } from "../utils/utils.ts";

type ResultType = "ok" | "err";

export interface ResultMatch<T, E, U> {
  ok: (value: T) => U;
  err: (error: E) => U;
}

export interface Result<T, E> {
  _type: ResultType;
  isOk: boolean;
  isErr: boolean,
  match: <U>(handler: ResultMatch<T, E, U>) => U;
  matchOk: (handler: (value: T) => void) => void | never;
  matchErr: (handler: (error: E) => void) => void | never;
  unwrap: () => T | never;
  unwrapOr: (def: T) => T;
  unwrapErr: () => E | never;
}

interface ResultOk<T, E> extends Result<T, E> {
  matchOk: (handler: (value: T) => void) => void;
  matchErr: (handler: (error: E) => void) => never;
  unwrap: () => T;
  unwrapErr: () => never;
}

interface ResultErr<T, E> extends Result<T, E> {
  matchOk: (handler: (value: T) => void) => never;
  matchErr: (handler: (error: E) => void) => void;
  unwrap: () => never;
  unwrapErr: () => E;
}

export const ok = <T, E>(value: T): ResultOk<T, E> => {
  if (isMissing(value)) {
    throw new Error(
      "ok(value) expected @value to be present, but it was missing."
    );
  }

  return {
    _type: "ok",
    isOk: true,
    isErr: false,
    match: <U>(handler: ResultMatch<T, E, U>): U => {
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
    matchErr: (): never => {
      throw new Error(
        "Cannot execute matchErr() on type ResultOk."
      );
    },
    unwrap: (): T => value,
    unwrapOr: (def: T): T => value,
    unwrapErr: (): never => {
      throw new Error(
        "Cannot execute unwrapErr() on type ResultOk."
      );
    },
  };
};

export const err = <T, E>(error: E): ResultErr<T, E> => {
  return {
    _type: "err",
    isOk: false,
    isErr: true,
    match: <U>(handler: ResultMatch<T, E, U>): U => {
      if (!isFunction(handler.err)) {
        throw new Error(
          "ResultErr.match(handler) expected @handler.err to be a function."
        );
      }
      return handler.err(error);
    },
    matchOk: (): never => {
      throw new Error(
        "Cannot execute matchOk() on type ResultErr."
      );
    },
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
  };
};

export const isResult = <T, E>(value: Result<T, E> | any): value is Result<T, E> => {
  return isObject(value) && isOneOf(value._type, ["ok", "err"]);
};

export const isOk = <T, E>(value: Result<T, E>): value is ResultOk<T, E> => {
  if (!isResult(value)) {
    throw new Error(
      "isOk(value) expected @value to be of type Result<T, E>."
    );
  }
  return value._type === "ok";
};

export const isErr = <T, E>(value: Result<T, E>): value is Result<T, E> => {
  if (!isResult(value)) {
    throw new Error(
      "isNone(value) expected @value to be type Result<T, E>."
    );
  }
  return value._type === "err";
};
