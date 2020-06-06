import {
  assert,
  assertEquals,
  assertThrows,
  fail,
} from "https://deno.land/std/testing/asserts.ts";
import { ok, err } from "../mod.ts";

const verifyResultOk = (value: any): void => {
  const result = ok(value);

  assert(result.isOk);
  assertEquals(result.isErr, false);

  (() => {
    const mapped = result.map(() => "mapped");
    assertEquals(mapped.unwrap(), "mapped");
    // @ts-ignore
    assertThrows(() => result.map());
  })();

  result.match({
    ok: (val) => {
      assertEquals(val, value);
    },
    err: () => {
      fail();
    }
  });

  result.matchOk((val) => {
    assertEquals(val, value);
  });

  result.matchErr(() => {
    fail();
  });

  assertEquals(result.unwrap(), value);
  assertEquals(result.unwrapOr({} as any), value);
  assertThrows(() => result.unwrapErr());
};

const verifyResultErr = (error: any): void => {
  const result = err(error);

  assert(result.isErr);
  assertEquals(result.isOk, false);

  (() => {
    const mapped = result.map(() => "mapped");
    assert(mapped.isErr);
  })();

  result.match({
    ok: () => {
      fail();
    },
    err: (err) => {
      assertEquals(err, error);
    }
  });

  result.matchOk(() => {
    fail();
  });

  result.matchErr((err) => {
    assertEquals(err, error);
  });

  assertThrows(() => result.unwrap());
  assertEquals(result.unwrapOr(42), 42);
  assertEquals(result.unwrapErr(), error);
};

Deno.test({
  name: "Result<number, never>",
  fn: () => {
    const someNumbers = [
      42,
      0,
      -1,
      Math.PI,
      Math.E,
    ];
    someNumbers.forEach(verifyResultOk);
  },
});

Deno.test({
  name: "Result<string, never>",
  fn: () => {
    const someStrings = [
      "",
      "-1",
      "false",
      "undefined",
    ];
    someStrings.forEach(verifyResultOk);
  }
});

Deno.test({
  name: "Result<boolean, never>",
  fn: () => {
    verifyResultOk(true);
    verifyResultOk(false);
  }
});

Deno.test({
  name: "Result<array, never>",
  fn: () => {
    verifyResultOk([]);
    verifyResultOk([-1]);
  }
});

Deno.test({
  name: "Result<object, never>",
  fn: () => {
    verifyResultOk({
      name: "funky",
      descr: "Option, Result and more functional stuff"
    });
    verifyResultOk({});
  }
});

Deno.test({
  name: "Result<never, number>",
  fn: () => {
    const someNumbers = [
      42,
      0,
      -1,
      Math.PI,
      Math.E,
    ];
    someNumbers.forEach(verifyResultErr);
  }
});

Deno.test({
  name: "Result<never, string>",
  fn: () => {
    const someStringErrors = [
      "",
      "-1",
      "stringly error",
    ];
    someStringErrors.forEach(verifyResultErr);
  }
});

Deno.test({
  name: "Result<never, boolean>",
  fn: () => {
    verifyResultErr(true);
    verifyResultErr(false);
  }
});

Deno.test({
  name: "Result<never, array>",
  fn: () => {
    verifyResultErr([]);
    verifyResultErr([-1]);
  }
});

Deno.test({
  name: "Result<never, object>",
  fn: () => {
    verifyResultErr({
      name: "error",
      message: "Big bad error"
    });
    verifyResultErr({});
  }
});
