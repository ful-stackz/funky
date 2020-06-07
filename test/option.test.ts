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

  (() => {
    const mappedOption = option.map(() => "mapped");
    assert(mappedOption.isSome);
    assertEquals(mappedOption.isNone, false);
    assertEquals(mappedOption.unwrap(), "mapped");
  })();

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

  (() => {
    const otherOption = some("default");
    const orResult = option.or(otherOption);
    assertEquals(orResult.unwrap(), value);
  })();

  (() => {
    const otherOption = some("next");
    const result = option.and(otherOption);
    assertEquals(result.unwrap(), "next");
  })();

  (() => {
    const next = () => some("pass");
    const result = option.andThen(next);
    assertEquals(result.unwrap(), "pass");
  })();

  assertEquals(option.unwrap(), value);
  assertEquals(option.unwrapOr({} as any), value);
};

const verifyOptionNone = <T>(): void => {
  const option: Option<T> = none();

  assert(option.isNone);
  assertEquals(option.isSome, false);

  (() => {
    const mappedOption = option.map(() => "mapped");
    assert(mappedOption.isNone);
    assertEquals(mappedOption.isSome, false);
    assertThrows(() => mappedOption.unwrap());
  })();

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

  (() => {
    const otherOption = some("default");
    const orResult = option.or(otherOption);
    assertEquals(orResult.unwrap(), "default");
  })();

  (() => {
    const otherOption = some("next");
    const result = option.and(otherOption);
    assert(result.isNone);
  })();

  (() => {
    const next = (value: any) => some(value);
    const result = option.andThen(next);
    assert(result.isNone);
  })();

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
