import {
  assert,
  fail,
  assertThrows,
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { Result, ok, err } from "../mod.ts";

const parseJsonAs = <T>(text: string): Result<T, string> => {
  try {
    const parsed = JSON.parse(text) as T;
    return ok(parsed);
  } catch (error) {
    return err(error.message);
  }
};

(() => {
  interface JsonFunction {
    function: string;
    arguments: string[];
  }
  const goodJsonString = `{"function": "sayHello", "arguments": [ "world" ]}`;
  const parsed = parseJsonAs<JsonFunction>(goodJsonString);

  assert(parsed.isOk);
  assert(!parsed.isErr);

  parsed.match({
    ok: (value: JsonFunction) => {
      assertEquals(value.function, "sayHello");
    },
    err: () => {
      fail();
    }
  });

  parsed.matchOk((value) => {
    assertEquals(value.arguments[0], "world");
  });
  parsed.matchErr(() => {
    fail();
  });

  assertEquals(parsed.unwrap().function, "sayHello");
  assertThrows(() => parsed.unwrapErr(), Error);

  const defaultValue: JsonFunction = {
    function: "default",
    arguments: [],
  };
  assertEquals(parsed.unwrapOr(defaultValue).function, "sayHello");
})();

(() => {
  interface JsonProperty {
    name: string;
    type: string;
  }
  const badJsonString = `{name: "completed", "type": boolean}`;
  const parsed = parseJsonAs<JsonProperty>(badJsonString);

  assert(parsed.isErr);
  assert(!parsed.isOk);

  parsed.match({
    ok: (value: JsonProperty) => {
      fail();
    },
    err: (error: string) => {
      assertEquals(error, "Unexpected token n in JSON at position 1");
    }
  });

  parsed.matchOk(() => {
    fail();
  });
  parsed.matchErr((error: string) => {
    assertEquals(error, "Unexpected token n in JSON at position 1");
  });

  assertThrows(() => parsed.unwrap(), Error);
  assertEquals(parsed.unwrapErr(), "Unexpected token n in JSON at position 1");

  const defaultValue: JsonProperty = {
    name: "default",
    type: "undefined",
  };
  assertEquals(parsed.unwrapOr(defaultValue).name, "default");
})();
