import { isMissing, isFunction, isObject, isOneOf } from "../utils/utils.ts";

enum OptionType {
  Some,
  None,
}

interface OptionMatch<T, U> {
  some(value: T): U;
  none(): U;
}

/**
 * Represents a runtime-safe value which is _optional_. An optional value is a value which might or might not be
 * present. The `Option` type allows you to write safe code around that value, without unexpected runtime exceptions.
 */
export interface Option<T> {
  readonly _type: OptionType;

  /**
   * Indicates whether the option is an `OptionSome` instance.
   */
  readonly isSome: boolean;

  /**
   * Indicates whether the option is an `OptionNone` instance.
   */
  readonly isNone: boolean;

  /**
   * If the option is an `OptionSome` instance invokes the `@handler` function, providing the wrapped value as the
   * argument and returns the result as an `Option`. Otherwise, returns an `OptionNone` instance.
   */
  map<U>(handler: (value: T) => U): Option<U>;

  /**
   * If the option is an `OptionSome` instance invokes the `@handler.some` function, providing the wrapped value as the
   * argument and returns the result.
   *
   * Otherwise, invokes the `@handler.none` function and returns the result.
   */
  match<U>(handler: OptionMatch<T, U>): U;

  /**
   * If the option is an `OptionSome` instance invokes the `@handler` function, providing the wrapped value as the
   * argument.
   */
  matchSome(handler: (value: T) => void): void;

  /**
   * If the option is an `OptionSome` instance invokes the `@handler` function. Otherwise, the `@handler` function is
   * _not_ invoked.
   */
  matchNone(handler: () => void): void;

  /**
   * If the option is an `OptionNone` instance returns the specified `@other` option. Otherwise, returns the original
   * `OptionSome` instance.
   */
  or<U>(other: Option<U>): Option<T | U>;

  /**
   * If the option is an `OptionSome` instance returns the specfied `@other` option. Otherwise, returns an `OptionNone`
   * instance.
   */
  and<U>(other: Option<U>): Option<U>;

  /**
   * If the option is an `OptionSome` instance invokes the `@handler` function, providing the wrapped value as the
   * argument and returns the result. Otherwise, returns an `OptionNone` instance.
   */
  andThen<U>(handler: (value: T) => Option<U>): Option<U>;

  /**
   * If the option is an `OptionSome` instance returns the wrapped value. Otherwise, throws an `Error`.
   */
  unwrap(): T | never;

  /**
   * If the option is an `OptionNone` instance returns the specified `@def` value. Otherwise, returns the original
   * wrapped value.
   */
  unwrapOr(def: T): T;
}

interface OptionSome<T> extends Option<T> {
  map<U>(handler: (value: T) => U): OptionSome<U>;
  matchSome(handler: (value: T) => void): void;
  matchNone(handler: () => void): void;
  or<U>(other: Option<U>): Option<T>;
  and<U>(other: Option<U>): Option<U>;
  andThen<U>(handler: (value: T) => Option<U>): Option<U>;
  unwrap(): T;
}

interface OptionNone<T = never> extends Option<T> {
  map<U>(handler: (value: T) => U): OptionNone<U>;
  matchSome(handler: (value: T) => void): void;
  matchNone(handler: () => void): void;
  or<U>(other: Option<U>): Option<U>;
  and<U>(other: Option<U>): OptionNone<U>;
  andThen<U>(handler: (value: T) => Option<U>): OptionNone<U>;
  unwrap(): never;
}

/**
 * Creates a new `OptionSome<T>` instance, wrapping the specified `@value`.
 */
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
    map: <U>(handler: (value: T) => U): OptionSome<U> => {
      if (!isFunction(handler)) {
        throw new Error(
          "OptionSome.map(handler) expected @handler to be a function."
        );
      }
      return some(handler(value));
    },
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
    or: (): Option<T> => some(value),
    and: <U>(other: Option<U>) => other,
    andThen: <U>(handler: (value: T) => Option<U>): Option<U> => {
      if (!isFunction(handler)) {
        throw new Error(
          "OptionSome.andThen(handler) expected @handler to be a function."
        );
      }
      return handler(value);
    },
    unwrap: (): T => value,
    unwrapOr: (): T => value,
  };
};

/**
 * Creates a new `OptionNone<T>` instance.
 */
export const none = <T = never>(): OptionNone<T> => {
  return {
    _type: OptionType.None,
    isSome: false,
    isNone: true,
    map: <U>(): OptionNone<U> => {
      return none<U>();
    },
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
    or: <U>(other: Option<U>): Option<U> => other,
    and: <U>(): OptionNone<U> => none<U>(),
    andThen: <U>(): OptionNone<U> => none<U>(),
    unwrap: (): never => {
      throw new Error(
        "Cannot execute unwrap() on type OptionNone."
      );
    },
    unwrapOr: (def: T): T => def,
  };
};

/**
 * Type-safe check whether `@value` is of type `Option<T>`.
 */
export const isOption = <T>(value: Option<T> | any): value is Option<T> => {
  return (
    isObject(value) &&
    isOneOf(value._type, [OptionType.Some, OptionType.None])
  );
};

/**
 * Type-safe check whether `@option` is of type `OptionSome<T>`.
 *
 * If `@option` is neither `OptionSome` nor `OptionNone` an `Error` is thrown.
 */
export const isSome = <T>(option: Option<T>): option is OptionSome<T> => {
  if (!isOption(option)) {
    throw new Error(
      "isSome(value) expected @value to be of type Option<T>."
    );
  }
  return option._type === OptionType.Some;
};

/**
 * Type-safe check whether `@option` is of type `OptionNone<T>`.
 *
 * If `@option` is neither `OptionSome` nor `OptionNone` an `Error` is thrown.
 */
export const isNone = <T>(option: Option<T>): option is OptionNone<T> => {
  if (!isOption(option)) {
    throw new Error(
      "isNone(value) expected @value to be of type Option<T>."
    );
  }
  return option._type === OptionType.None;
};
