export const isUndefined = (value: any): value is undefined => {
  return typeof value === "undefined";
};

export const isNull = (value: any): value is null => {
  return value === null;
};

export const isFunction = (value: any): value is Function => {
  return typeof value === "function";
};

export const isString = (value: any): value is string => {
  return typeof value === "string";
};

export const isNumber = (value: any): value is number => {
  return typeof value === "number";
};

export const isMissing = (value: any): value is null | undefined => {
  return (
    value === null ||
    typeof value === "undefined"
  );
};

export const isPresent = (value: any): boolean => {
  return (
    value !== null &&
    typeof value !== "undefined"
  );
};

export const isArray = (value: any): value is any[] => {
  return Array.isArray(value);
};

export const isArrayOf = <T>(
  array: any,
  checkType: (value: any) => value is T
): array is T[] => {
  return Array.isArray(array) && array.every(checkType);
};

export const isArrayEmpty = (array: any[]): boolean => {
  return array.length === 0;
};

export const isObject = (value: any): value is Object => {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
};

export const isOneOf = (value: any, options: any[]): boolean => {
  return options.some((item) => item === value);
};
