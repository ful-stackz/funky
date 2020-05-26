import {
  assert,
  assertEquals,
  assertThrows,
  fail,
} from "https://deno.land/std/testing/asserts.ts";
import { Option, some, none } from "../mod.ts";

const verifyOptionSome = <T>(value: T): void => {
  const option: Option<T> = some(value);

  assert(option.isSome);
  assertEquals(option.isNone, false);

  option.match({
    some: (val) => {
      assertEquals(val, value);
    },
    none: () => {
      fail();
    }
  });

  option.matchSome((val) => {
    assertEquals(val, value);
  });

  option.matchNone(() => {
    fail();
  });

  assertEquals(option.unwrap(), value);
  assertEquals(option.unwrapOr({} as any), value);
};

const verifyOptionNone = <T>(): void => {
  const option: Option<T> = none();

  assert(option.isNone);
  assertEquals(option.isSome, false);

  option.match({
    some: () => {
      fail();
    },
    none: () => {
      assert(true);
    }
  });

  option.matchSome(() => {
    fail();
  });

  option.matchNone(() => {
    assert(true);
  });

  assertThrows(() => option.unwrap());
  assertEquals(option.unwrapOr(42 as any), 42);
};

Deno.test({
  name: "Option<number>",
  fn: () => {
    const someNumbers = [
      42,
      0,
      -1,
      Math.PI,
      Math.E,
    ];
    someNumbers.forEach(verifyOptionSome);
  },
});

Deno.test({
  name: "Option<string>",
  fn: () => {
    const someStrings = [
      "",
      "-1",
      "false",
      "undefined",
    ];
    someStrings.forEach(verifyOptionSome);
  }
});

Deno.test({
  name: "Option<boolean>",
  fn: () => {
    verifyOptionSome(true);
    verifyOptionSome(false);
  }
});

Deno.test({
  name: "Option<array>",
  fn: () => {
    verifyOptionSome([]);
    verifyOptionSome([-1]);
  }
});

Deno.test({
  name: "Option<object>",
  fn: () => {
    verifyOptionSome({
      name: "funky",
      descr: "Option, Result and more functional stuff"
    });
    verifyOptionSome({});
  }
});

Deno.test({
  name: "Option.none()",
  fn: () => {
    verifyOptionNone();
  }
});
