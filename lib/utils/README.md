# `funky/utils`

The utils module is a collection of useful functional utilities.

- [`isArray()`](#isarray)
- [`isArrayEmpty()`](#isarrayempty)
- [`isArrayOf()`](#isarrayof)
- [`isFunction()`](#isfunction)
- [`isMissing()`](#ismissing)
- [`isNull()`](#isnull)
- [`isNumber()`](#isnumber)
- [`isObject()`](#isobject)
- [`isOneOf()`](#isoneof)
- [`isPresent()`](#ispresent)
- [`isString()`](#isstring)
- [`isUndefined()`](#isundefined)

## `isArray()`

> `isArray(value: any): value is any[]`

Provides a type-safe indication of whether the `value` argument is an array.

## `isArrayEmpty()`

> `isArrayEmpty(array: any[]): boolean`

Indicates whether the `array` argument is an empty array.

## `isArrayOf()`

> `isArrayOf<T>(array: any[], checkType: (value: any): value is T): array is T[]`

Provides a type-safe indication of whether the `array` argument is an array
where every item is of type `T`. This is done by invoking the specified `checkType`
function on every item of the `array`.

## `isFunction()`

> `isFunction(value: any): value is Function`

Provides a type-safe indication of whether the `value` argument is a function.

## `isMissing()`

> `isMissing(value: any): boolean`

Indicates whether the `value` argument is _missing_. A missing value is a value
that is either `null` or `undefined`.

## `isNull()`

> `isNull(value: any): value is null`

Provides a type-safe indication of whether the `value` argument is `null`.

## `isNumber()`

> `isNumber(value: any): value is number`

Provides a type-safe indication of wheter the `value` argument is a number.

## `isOneOf()`

> `isOneOf(value: any, options: any[]): boolean`

Indicates whether `value` is one of the items on the `options` array.

## `isPresent()`

> `isPresent(value: any): boolean`

Indicates whether the `value` argument is _present_. A present value is a value
that is neither `null` nor `undefined`.

## `isString()`

> `isString(value: any): value is string`

Provides a type-safe indication of whether the `value` argument is a string.

## `isUndefined()`

> `isUndefined(value: any): value is undefined`

Provides a type-safe indication of whether the `value` argument is `undefined`.
