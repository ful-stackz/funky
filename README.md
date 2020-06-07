# funky

> Getting `funky` with Deno!

![CI](https://github.com/ful-stackz/funky/workflows/CI/badge.svg?branch=master)
[![deno.land status](https://img.shields.io/badge/deno.land%2Fx%2Ffunky-v0.3.2-green?style=flat&logo=deno)](https://deno.land/x/funky@v0.3.2)
[![deno.land docs](https://img.shields.io/badge/deno.land-docs-green?style=flat&logo=deno)](https://doc.deno.land/https/deno.land/x/funky@v0.3.2/mod.ts)

`funky` brings the beloved `Option<T>`, `Result<T, E>` and other functional 
utilities into your next **Deno** masterpiece!

This library is heavily inspired by the awesome
[@hqoss/monads](https://github.com/hqoss/monads).

## API

- [Option type](./lib/option)
- [Result type](./lib/result)
- [Utility functions](./lib/utils)
  - [`isArray()`](./lib/utils#isarray)
  - [`isArrayEmpty()`](./lib/utils#isarrayempty)
  - [`isArrayOf()`](./lib/utils#isarrayof)
  - [`isFunction()`](./lib/utils#isfunction)
  - [`isMissing()`](./lib/utils#ismissing)
  - [`isNull()`](./lib/utils#isnull)
  - [`isNumber()`](./lib/utils#isnumber)
  - [`isObject()`](./lib/utils#isobject)
  - [`isOneOf()`](./lib/utils#isoneof)
  - [`isPresent()`](./lib/utils#ispresent)
  - [`isString()`](./lib/utils#isstring)
  - [`isUndefined()`](./lib/utils#isundefined)

## Usage

### `Option<T>`

[Go to full `Option<T>` documentation](./lib/option).

```typescript
import { Option, some, none } from "https://deno.land/x/funky/mod.ts";
import { isUndefined } from "https://deno.land/x/funky/mod.ts";

const getEnvVar = (key: string): Option<string> => {
  const value = Deno.env.get(key);
  return isUndefined(value) ? none() : some(value);
};

const getHome = getEnvVar("HOME");
const home = getHome.match({
  some: (value: string) => value,
  none: () => "Could not retrieve HOME path from env."
});
console.log(home); // "/home/alice"

const getMadeUpVar = getEnvVar("MADE_UP_VAR");
const madeUpVar = getMadeUpVar.match({
  some: (value: string) => value,
  none: () => "Could not retrieve MADE_UP_VAR"
});
console.log(madeUpVar); // "Could not retrieve MADE_UP_VAR"
```

### `Result<T, E>`

[Go to full `Result<T, E>` documentation](./lib/result)

```typescript
import { Result, ok, err } from "https://deno.land/x/funky/mod.ts";

const fetchUser = async (id: number): Promise<Result<User, string>> => {
  const url = `api.com/users/${id}`;
  const response = await fetch(url);

  if (response.status === 404) {
    return err(`User with id ${id} does not exist.`);
  }

  try {
    const user = await response.json();
    return Ok(user as User);
  } catch (error) {
    return err("Parsing the response failed.");
  }
};

console.log(await fetchUser(42)); // ResultOk(user: { id: 42 })
console.log(await fetchUser(-1)); // ResultErr("User with id -1 does not exist.")
```

## Contributing

**Any and all contributions are welcome!**

If you decide to contribute, first of all **thank you!** Second, please open
an issue first to make sure you are not wasting your time working on something
that is already in progress.

When you are ready to deliver your awesome input please open a pull request.
No pull request will be ignored!

## Author and contact

The author of this project is [Ivan Stoyanov](https://github.com/ful-stackz).

Contact me on Discord fulstackz#1258.

## License

This project is under the ISC license. Feel free to clone, extend and customize,
and possibly add a mention to the original 😇

See the [LICENSE](./LICENSE) file for more information.
