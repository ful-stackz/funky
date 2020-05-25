import { isMissing, isFunction, isObject, isOneOf } from "../utils/utils.ts";

enum OptionType {
  Some,
  None,
};

interface OptionMatch<T, U> {
  some: (value: T) => U;
  none: () => U;
}

export interface Option<T> {
  _type: OptionType;
  isSome: boolean;
  isNone: boolean;
  match: <U>(handler: OptionMatch<T, U>) => U;
  matchSome: (handler: (value: T) => void) => void | never;
  matchNone: (handler: () => void) => void | never;
  unwrap: () => T | never;
  unwrapOr: (def: T) => T;
}

interface OptionSome<T> extends Option<T> {
  matchSome: (handler: (value: T) => void) => void;
  matchNone: (handler: () => void) => never;
  unwrap: () => T;
}

interface OptionNone<T> extends Option<T> {
  matchSome: (handler: (value: T) => void) => never;
  matchNone: (handler: () => void) => void;
  unwrap: () => never;
}

export const some = <T>(value: T): OptionSome<T> => {
  if (isMissing(value)) {
    throw new Error(
      "some(value) expected @value to be present, but it was missing."
    );
  }

  return {
    _type: OptionType.Some,
    isSome: true,
    isNone: false,
    match: <U>(handler: OptionMatch<T, U>): U => {
      if (!isFunction(handler.some)) {
        throw new Error(
          "OptionSome.match(handler) expected @handler.some to be a function."
        );
      }
      return handler.some(value);
    },
    matchSome: (handler: (value: T) => void): void => {
      if (!isFunction(handler)) {
        throw new Error(
          "OptionSome.matchSome(handler) expected @handler to be a function."
        );
      }
      handler(value);
    },
    matchNone: (): never => {
      throw new Error(
        "Cannot execute matchNone() on type OptionSome."
      );
    },
    unwrap: (): T => value,
    unwrapOr: (def: T): T => value,
  };
};

export const none = <T>(): OptionNone<T> => {
  return {
    _type: OptionType.None,
    isSome: false,
    isNone: true,
    match: <U>(handler: OptionMatch<T, U>): U => {
      if (!isFunction(handler.none)) {
        throw new Error(
          "OptionNone.match(handler) expected @handler.none to be a function."
        );
      }
      return handler.none();
    },
    matchSome: (): never => {
      throw new Error(
        "Cannot execute matchSome() on type OptionNone."
      );
    },
    matchNone: (handler: () => void): void => {
      if (!isFunction(handler)) {
        throw new Error(
          "OptionNone.matchNone(handler) expected @handler to be a function."
        );
      }
      handler();
    },
    unwrap: (): never => {
      throw new Error(
        "Cannot execute unwrap() on type OptionNone."
      );
    },
    unwrapOr: (def: T): T => def,
  };
};

export const isOption = <T>(value: Option<T> | any): value is Option<T> => {
  return (
    isObject(value) &&
    isOneOf(value._type, [OptionType.Some, OptionType.None])
  );
};

export const isSome = <T>(value: Option<T>): value is OptionSome<T> => {
  if (!isOption(value)) {
    throw new Error(
      "isSome(value) expected @value to be of type Option<T>."
    );
  }
  return value._type === OptionType.Some;
};

export const isNone = <T>(value: Option<T>): value is OptionNone<T> => {
  if (!isOption(value)) {
    throw new Error(
      "isNone(value) expected @value to be of type Option<T>."
    );
  }
  return value._type === OptionType.None;
};
