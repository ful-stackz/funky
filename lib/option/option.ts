import { isMissing, isFunction, isObject, isOneOf } from "../utils/utils.ts";

enum OptionType {
  Some,
  None,
}

interface OptionMatch<T, U> {
  some(value: T): U;
  none(): U;
}

export interface Option<T> {
  readonly _type: OptionType;
  readonly isSome: boolean;
  readonly isNone: boolean;
  match<U>(handler: OptionMatch<T, U>): U;
  matchSome(handler: (value: T) => void): void;
  matchNone(handler: () => void): void;
  unwrap(): T | never;
  unwrapOr(def: T): T;
}

interface OptionSome<T> extends Option<T> {
  matchSome(handler: (value: T) => void): void;
  matchNone(handler: () => void): void;
  unwrap(): T;
}

interface OptionNone<T = never> extends Option<T> {
  matchSome(handler: (value: T) => void): void;
  matchNone(handler: () => void): void;
  unwrap(): never;
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
    matchNone: (): void => {},
    unwrap: (): T => value,
    unwrapOr: (): T => value,
  };
};

export const none = <T = never>(): OptionNone<T> => {
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
    matchSome: (): void => {},
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

export const isSome = <T>(option: Option<T>): option is OptionSome<T> => {
  if (!isOption(option)) {
    throw new Error(
      "isSome(value) expected @value to be of type Option<T>."
    );
  }
  return option._type === OptionType.Some;
};

export const isNone = <T>(option: Option<T>): option is OptionNone<T> => {
  if (!isOption(option)) {
    throw new Error(
      "isNone(value) expected @value to be of type Option<T>."
    );
  }
  return option._type === OptionType.None;
};
