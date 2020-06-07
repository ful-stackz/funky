/**
 * Type-safe check whether `@value` is `undefined`.
 */
export const isUndefined = (value: any): value is undefined => {
  return typeof value === "undefined";
};

/**
 * Type-safe check whether `@value` is `null`.
 */
export const isNull = (value: any): value is null => {
  return value === null;
};

/**
 * Type-safe check whether `@value` is a `Function`.
 */
export const isFunction = (value: any): value is Function => {
  return typeof value === "function";
};

/**
 * Type-safe check whether `@value` is a `string`.
 */
export const isString = (value: any): value is string => {
  return typeof value === "string";
};

/**
 * Type-safe check whether `@value` is a `number`.
 */
export const isNumber = (value: any): value is number => {
  return typeof value === "number";
};

/**
 * Type-safe check whether `@value` is _missing_. `@value` is considered missing when it is either `null` or
 * `undefined`.
 */
export const isMissing = (value: any): value is null | undefined => {
  return (
    value === null ||
    typeof value === "undefined"
  );
};

/**
 * Checks whether `@value` is _present_. `@value` is considered present when it is neither `null` nor `undefined`.
 */
export const isPresent = (value: any): boolean => {
  return (
    value !== null &&
    typeof value !== "undefined"
  );
};

/**
 * Type-safe check whether `@value` is an array.
 */
export const isArray = (value: any): value is any[] => {
  return Array.isArray(value);
};

/**
 * Type-safe check whether the specified `@array` contains only elements of type `T`. The specified `@checkType`
 * function is invoked on every item in the `@array` to determine whether it is of the expected type.
 */
export const isArrayOf = <T>(
  array: any,
  checkType: (value: any) => value is T
): array is T[] => {
  return Array.isArray(array) && array.every(checkType);
};

/**
 * Checks whether the specified `@array` is empty. Returns `true` when there are no items in the `@array`.
 */
export const isArrayEmpty = (array: any[]): boolean => {
  return array.length === 0;
};

/**
 * Type-safe check whether `@value` is of type `Object`.
 */
export const isObject = (value: any): value is Object => {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
};

/**
 * Checks whether `@value` is one of the specified `@options`. Returns `true` when one of the `@options` is _strictly_
 * equal to `@value`.
 */
export const isOneOf = (value: any, options: any[]): boolean => {
  return options.some((item) => item === value);
};
