# `funky/utils`

The utils module is a collection of useful functional utilities.

- [`isArray()`](#isarray)
- [`isFunction()`](#isfunction)
- [`isMissing()`](#ismissing)
- [`isNull()`](#isnull)
- [`isObject()`](#isobject)
- [`isOneOf()`](#isoneof)
- [`isPresent()`](#ispresent)
- [`isUndefined()`](#isundefined)

## `isArray()`

> `isArray(value: any): value is any[]`

Provides a type-safe indication of whether the `value` argument is an array.

## `isFunction()`

> `isFunction(value: any): value is Function`

Provides a type-safe indication of wheter the `value` argument is a function.

## `isMissing()`

> `isMissing(value: any): boolean`

Indicates whther the `value` argument is _missing_. A missing value is a value
that is either `null` or `undefined`.

## `isNull()`

> `isNull(value: any): boolean`

Indicates whether `value` is `null`.

## `isOneOf()`

> `isOneOf(value: any, options: any[]): boolean`

Indicates whether `value` is one of the items on the `options` array.

## `isPresent()`

> `isPresent(value: any): boolean`

Indicates whether the `value` argument is _present_. A present value is a value
that is neither `null` nor `undefined`.

## `isUndefined()`

> `isUndefined(value: any): value is undefined`

Provides a type-safe indication of whether the `value` argument is `undefined`.
