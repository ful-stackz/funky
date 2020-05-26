import {
  assert,
  fail,
  assertThrows,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { Option, some, none,  } from "../mod.ts";

const tryParseDate = (value: string): Option<Date> => {
  const date = new Date(value);
  return (Number.isInteger(date.getTime())) ? some(date) : none();
};

(() => {
  const goodStringifiedDate = "2020-05-25T02:01:20.799Z";
  const parsedDate = tryParseDate(goodStringifiedDate);

  assert(parsedDate.isSome);
  assert(!parsedDate.isNone);

  parsedDate.match({
    some: (date: Date) => {
      assertEquals(date.getFullYear(), 2020);
    },
    none: () => {
      fail();
    },
  });

  parsedDate.matchSome((value: Date) => {
    assertEquals(value.getDate(), 25);
  });
  parsedDate.matchNone(() => {
    fail();
  });

  assertEquals(parsedDate.unwrap().getMonth(), 4);
  assertNotEquals(parsedDate.unwrapOr(new Date(0)).getTime(), 0);
})();

(() => {
  const badStringifiedDate = "blah-blah-blah";
  const parsedDate = tryParseDate(badStringifiedDate);

  assert(parsedDate.isNone);
  assert(!parsedDate.isSome);

  parsedDate.match({
    some: () => {
      fail();
    },
    none: () => {
      assert(true);
    },
  });

  parsedDate.matchSome(() => {
    fail();
  });
  parsedDate.matchNone(() => {
    assert(true);
  });
  
  assertThrows(() => parsedDate.unwrap(), Error);
  assertEquals(parsedDate.unwrapOr(new Date(0)).getTime(), 0);
})();
