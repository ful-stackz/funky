# `funky/option`

This directory contains the `Option<T>` type along with some related utilities.

- [`Option<T>`](#optiont)
  - [`isSome`](#issome)
  - [`isNone`](#isnone)
  - [`map()`](#map)
  - [`match()`](#match)
  - [`matchSome()`](#matchsome)
  - [`matchNone()`](#matchnone)
  - [`or()`](#or)
  - [`and()`](#and)
  - [`andThen()`](#andthen)
  - [`unwrap()`](#unwrap)
  - [`unwrapOr()`](#unwrapor)
- [Utilties](#utilities)
  - [`isOption()`](#isoption)
  - [`isSome()`](#issome-1)
  - [`isNone()`](#isnone-1)

## `Option<T>`

The `Option<T>` type represents an _optional_ value of type `T`. A value which
is optional means that it might be there, but it also might not. The option type
allows you to write safe code around that value, without unexpected exceptions.

`Option<T>` is the base interface which represents an option type. It is further
split into `OptionSome<T>` and `OptionNone<T>`.

- `OptionSome<T>` represents an option which contains a value.
- `OptionNone<T>` represents an option which does not contain a value.

### `isSome`

> `Option<T>.isSome: boolean`

Indicates whether the option is an `OptionSome` instance, meaning that is a value.

#### Examples

```typescript
const option = some(42);
console.log(option.isSome); // true
```

```typescript
const option = none();
console.log(option.isSome); // false
```

### `isNone`

> `Option<T>.isNone: boolean`

Indicates whether the option is an `OptionNone` instance, meaning that it has no value.

#### Examples

```typescript
const option = some(42);
console.log(option.isNone); // false
```

```typescript
const option = none();
console.log(option.isNone); // true
```

### `map()`

> `Option<T>.map(handler: (value: T) => U): Option<U>`

If the option is an `OptionSome` instance invokes the `@handler` function,
providing the wrapped value as the argument. Returns the result of the
`@handler` as an `Option`.
Otherwise, when the option is an `OptionNone` instance returns `OptionNone`.

#### Examples

```typescript
const option = some("42");
const mapped = option.map(parseInt);
console.log(typeof option.unwrap()); // string
console.log(typeof mapped.unwrap()); // number
```

```typescript
const option = none();
const mapped = option.map(() => "value");
console.log(option.isNone); // true
console.log(mapped.isNone); // true
```

### `match()`

> `Option<T>.match<U>(handler: OptionMatch<T, U>): U`

```typescript
interface OptionMatch<T, U> {
  some: (value: T) => U;
  none: () => U;
}
```

If the option is an `OptionSome` instance invokes the `@handler.some` function,
providing the wrapped value as the argument.
Otherwise, invokes the `@handler.none` function.

#### Examples

```typescript
const answer = some(42);
answer.match({
  some: (value) => {
    console.log("The answer is", value);
  },
  none: () => {
    console.log("Try again in 7.5 million years :(");
  }
});
// outputs > "The answer is 42"
```

```typescript
const answer = none();
answer.match({
  some: (value) => {
    console.log("The answer is", value);
  },
  none: () => {
    console.log("Try again in 7.5 million years :(");
  }
});
// outputs > "Try again in 7.5 million years :("
```

### `matchSome()`

> `Option<T>.matchSome(handler: (value: T) => void): void`

If the option is an `OptionSome` instance invokes the `@handler` function,
providing the wrapped value as the argument.

#### Examples

```typescript
const answer = some(42);
answer.matchSome((value) => {
  console.log("The answer is", value);
});
// outputs > "The answer is 42"
```

```typescript
const answer = none();
answer.matchSome((value) => {
  console.log("The answer is", value);
});
// outputs > nothing
```

### `matchNone()`

> `Option<T>.matchNone(handler: () => void): void`

If the option is an `OptionNone` instance invokes the `@handler` function.

#### Examples

```typescript
const answer = some(42);
answer.matchNone(() => {
  console.log("No answer");
});
// outputs > nothing
```

```typescript
const answer = none();
answer.matchNone(() => {
  console.log("No answer");
});
// outputs > "No answer"
```

### `or()`

> `Option<T>.or<U>(other: Option<U>): Option<T | U>`

If the option is an `OptionNone` returns `@other`. Otherwise keeps the original.

#### Examples

```typescript
const option = some(42);
const other = some("default");
const result = option.or(other);
console.log(result.unwrap()); // 42
```

```typescript
const option = none();
const other = some("default");
const result = option.or(other);
console.log(result.unwrap()); // "default"
```

### `and()`

> `Option<T>.and<U>(other: Option<U>): Option<U>`

If the option is an `OptionSome` instance returns `@other`. Otherwise returns
`OptionNone`.

#### Examples

```typescript
const a = some(42);
const b = some("more");
const result = a.and(b);
console.log(result.isSome); // true
```

```typescript
const a = some(42);
const b = none();
const result = a.and(b);
console.log(result.isSome); // false
```

```typescript
const a = none();
const b = none();
const result = a.and(b);
console.log(result.isSome); // false
```

```typescript
const a = none();
const b = some(42);
const result = a.and(b);
console.log(result.isSome); // false
```

### `andThen()`

> `Option<T>.andThen<U>(handler: (value: T) => Option<U>): Option<U>`

If the option is an `OptionSome` instance invokes the `@handler` function,
providing the wrapped value as the argument. Returns the result of the
`@handler`.
Otherwise, when the option is `OptionNone` returns `OptionNone`.

This function is also known as `flatMap` in other languages.

#### Examples

```typescript
const userId = 5;
const findPersonById: Option<User> = (id) => { ... }
const getFavoriteNumber: Option<number> = (user) => 42;
console.log(some(userId).andThen(findPersonById).andThen(getFavoriteNumber).unwrap()); // 42
```

```typescript
const findPersonById: Option<User> = (id) => { ... }
const getFavoriteNumber: Option<number> = (user) => 42;
console.log(none().andThen(findPersonById).andThen(getFavoriteNumber).isNone); // true
```

### `unwrap()`

> `Option<T>.unwrap(): T | never`

If the option is an `OptionSome` instance returns the wrapped value. Otherwise,
an `Error` is thrown.

#### Examples

```typescript
const answer = some(42);
console.log(answer.unwrap()); // "42"
```

```typescript
const answer = none();
console.log(answer.unwrap()); // throws Error
```

### `unwrapOr()`

> `Option<T>.unwrapOr(def: T): T`

If the option is an `OptionSome` instance returns the wrapped value, otherwise
returns the `@def` value.

#### Examples

```typescript
const answer = some(42);
console.log(answer.unwrapOr(142)); // "42"
```

```typescript
const answer = none();
console.log(answer.unwrapOr(142)); // "142"
```

## Utilities

### `isOption()`

> `isOption<T>(value: any): value is Option<T>`

Provides a type-safe indication of wheter `@value` is an `Option<T>`.

#### Examples

```typescript
const option = some(42);
console.log(isOption(option)); // true
```

```typescript
const option = none();
console.log(isOption(option)); // true
```

```typescript
const number = 42;
console.log(isOption(number)); // false
```

### `isSome()`

> `isSome<T>(option: Option<T>): option is OptionSome<T>`

Provides a type-safe indication of whether `@option` is `OptionSomeT>`.

If `@option` is not of type `Option<T>`, an `Error` is thrown.

#### Examples

```typescript
const option = some(42);
console.log(isSome(option)); // true
```

```typescript
const option = none();
console.log(isSome(option)); // false
```

```typescript
const number = 42;
console.log(isSome(number)); // throws Error
```

### `isNone()`

> `isNone<T>(option: Option<T>): option is OptionNone<T>`

Provides a type-safe indication of whether `@option` is `OptionNone<T>`.

If `@option` is not of type `Option<T>`, an `Error` is thrown.

#### Examples

```typescript
const option = some(42);
console.log(isNone(option)); // false
```

```typescript
const option = none();
console.log(isNone(option)); // true
```

```typescript
const number = 42;
console.log(isNone(number)); // throws Error
