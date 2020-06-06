# `funky/result`

This directory contains the `Result<T, E>` type along with some related utilities.

- [`Result<T, E>`](#resultte)
  - [`isOk`](#isok)
  - [`isErr`](#iserr)
  - [`map()`](#map)
  - [`match()`](#match)
  - [`matchOk()`](#matchok)
  - [`matchErr()`](#matcherr)
  - [`unwrap()`](#unwrap)
  - [`unwrapOr()`](#unwrapor)
  - [`unwrapErr()`](#unwraperr)
- [Utilties](#utilities)
  - [`isResult()`](#isresult)
  - [`isOk()`](#isok-1)
  - [`isErr()`](#iserr-1)

## `Result<T, E>`

The `Result<T, E>` type represents the result of an operation, where a value of
type `T` is returned on success and an error of type `E` on failure.
Somemtimes an operation might fail and you want to give an indication about what
failed to the consumer. The result type allows you to do that without throwing
exceptions, but rather write safe code around results which might succeed or fail.

`Result<T, E>` is the base interface which represents a result type. It is
further split into `ResultOk<T, E>` and `ResultErr<T, E>`.

- `ResultOk<T, E>` represents a result which contains a valid value.
- `ResultErr<T, E>` represents a result which contains an error.

### `isOk`

> `Result<T, E>.isOk: boolean`

Indicates whether the result is a `ResultOk` instance.

#### Examples

```typescript
const result = ok(42);
console.log(result.isOk); // true
```

```typescript
const result = err("error");
console.log(result.isOk); // false
```

### `isErr`

> `Result<T, E>.isErr: boolean`

Indicates whether the result is a `ResultErr` instance.

#### Examples

```typescript
const result = ok(42);
console.log(result.isErr); // false
```

```typescript
const result = err("error");
console.log(result.isErr); // true
```

### `map()`

> `Result<T, E>.map<U>(handler: (value: T) => U): Result<U, E>`

If the result is a `ResultOk` instance invokes the `@handler`, providing the
wrapped value as the argument. Returns the result of the `@handler` as a
`Result`.
Otherwise, when the result is a `ResultErr`instance returns `ResultErr`.

#### Examples

```typescript
const result = ok(42);
const mapped = result.map((value) => `The answer is ${value}`);
console.log(mapped.unwrap()); // "The answer is 42"
```

```typescript
const result = err("Could not find an answer");
const mapped = result.map((value) => `The answer is ${value}`);
console.log(mapped.unwrap()); // throws Error
console.log(mapped.unwrapErr()); // "Could not find an answer"
```

### `match()`

> `Result<T, E>.match<U>(handler: ResultMatch<T, E, U>): U`

```typescript
interface ResultMatch<T, E, U> {
  ok: (value: T) => U;
  err: (error: E) => U;
}
```

If the result is a `ResultOk` instance then the `@handler.ok` function will be
invoked, providing the wrapped value as the argument. Otherwise, the `@handler.err`
function will be invoked, providing the wrapped error as the argument.

#### Examples

```typescript
const result = ok(42);
result.match({
  ok: (value) => {
    console.log("The result is", value);
  },
  err: (error) => {
    console.log("An error occurred", error);
  }
});
// outputs > "The result is 42"
```

```typescript
const result = err("not found");
result.match({
  ok: (value) => {
    console.log("The result is", value);
  },
  err: (error) => {
    console.log("An error occurred:", error);
  }
});
// outputs > "An error occurred: not found"
```

### `matchOk()`

> `Result<T, E>.matchOk(handler: (value: T) => void): void`

If the result is a `ResultOk` instance then the `@handler` function will be
invoked, providing the wrapped value as the argument.

#### Examples

```typescript
const result = ok(42);
result.matchOk((value) => {
  console.log("The result is", value);
});
// outputs > "The result is 42"
```

```typescript
const result = err("not found");
result.matchOk((value) => {
  console.log("The result is", value);
});
// outputs > nothing
```

### `matchErr()`

> `Result<T, E>.matchErr(handler: (error: E) => void): void`

If the result is a `ResultErr` instance then the `@handler` function will be
invoked, providing the wrapped error as the argument.

#### Examples

```typescript
const result = ok(42);
result.matchErr(error) => {
  console.log("An error occurred", error);
});
// outputs > nothing
```

```typescript
const result = err("not found");
result.matchErr((error) => {
  console.log("An error occurred:", error);
});
// outputs > "An error occurred: not found"
```

### `unwrap()`

> `Result<T, E>.unwrap(): T | never`

If the result is a `ResultOk` instance then the wrapped value will be returned.
Otherwise, an `Error` is thrown.

#### Examples

```typescript
const result = ok(42);
console.log(result.unwrap()); // "42"
```

```typescript
const result = err("error");
console.log(result.unwrap()); // throws Error
```

## `unwrapOr()`

> `Result<T, E>.unwrapOr(def: T): T`

If the result is a `ResultOk` instance then the wrapped value will be returned.
Otherwise, the `@def` value will be returned.

#### Examples

```typescript
const result = ok(42);
console.log(result.unwrapOr(142)); // "42"
```

```typescript
const result = err("error");
console.log(result.unwrapOr(142)); // "142"
```

### `unwrapErr()`

> `Result<T, E>.unwrapErr(): E | never`

If the result is a `ResultErr` instance then the wrapped error will be returned.
Otherwise, an `Error` is thrown.

#### Examples

```typescript
const result = ok(42);
console.log(result.unwrapErr()); // throws Error
```

```typescript
const result = err("error");
console.log(result.unwrapErr()); // "error"
```

## Utilities

### `isResult()`

> `isResult<T, E>(value: any): value is Result<T, E>`

Provides a type-safe indication of wheter `@value` is a `Result<T, E>`.

#### Examples

```typescript
const result = ok(42);
console.log(isResult(result)); // true
```

```typescript
const result = err("not found");
console.log(isResult(result)); // true
```

```typescript
const number = 42;
console.log(isResult(number)); // false
```

### `isOk()`

> `isOk<T, E>(result: Result<T, E>): result is ResultOk<T, E>`

Provides a type-safe indication of whether `@result` is `ResultOk<T, E>`.

If `@result` is not of type `Result<T, E>`, an `Error` is thrown.

#### Examples

```typescript
const result = some(42);
console.log(isOk(result)); // true
```

```typescript
const result = none();
console.log(isOk(result)); // false
```

```typescript
const number = 42;
console.log(isOk(number)); // throws Error
```

### `isErr()`

> `isErr<T, E>(result: Result<T, E>): option is ResultErr<T, E>`

Provides a type-safe indication of whether `@result` is `ResultErr<T, E>`.

If `@result` is not of type `Result<T, E>`, an `Error` is thrown.

#### Examples

```typescript
const result = some(42);
console.log(isErr(result)); // false
```

```typescript
const result = none();
console.log(isErr(result)); // true
```

```typescript
const number = 42;
console.log(isErr(number)); // throws Error
