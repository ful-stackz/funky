export const isUndefined = (value: any): value is undefined => {
  return typeof value === "undefined";
};

export const isNull = (value: any): value is null => {
  return value === null;
};

export const isFunction = (value: any): value is Function => {
  return typeof value === "function";
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
