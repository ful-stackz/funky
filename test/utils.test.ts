import { assert } from "https://deno.land/std/testing/asserts.ts";
import {
  isArray,
  isFunction,
  isMissing,
  isNull,
  isObject,
  isOneOf,
  isPresent,
  isUndefined,
} from "../mod.ts";

Deno.test({
  name: "isArray",
  fn: () => {
    const numbersArray = [1, 2, 3];

    assert(isArray(numbersArray));
    assert(isArray([]), "Expected isArray([]) to be true.");

    assert(!isArray(null), "Expected isArray(null) to be false.");
    assert(!isArray(undefined), "Expected isArray(undefined) to be false.");
    assert(!isArray("stringy"), "Expected isArray('stringy') to be false.");
  },
});

Deno.test({
  name: "isFunction",
  fn: () => {
    const localFn = () => {};
    function localFn2() { }

    assert(isFunction(localFn));
    assert(isFunction(localFn2));

    assert(!isFunction(null));
    assert(!isFunction(undefined));
    assert(!isFunction({}));
    assert(!isFunction([]));
  },
});

Deno.test({
  name: "isMissing",
  fn: () => {
    assert(isMissing(null));
    assert(isMissing(undefined));

    assert(!isMissing(true));
    assert(!isMissing({}));
    assert(!isMissing(""));
    assert(!isMissing(0));
  },
});

Deno.test({
  name: "isNull",
  fn: () => {
    const nullConst: string | null = null;

    assert(isNull(null));
    assert(isNull(nullConst));

    assert(!isNull(0));
    assert(!isNull(""));
    assert(!isNull({}));
    assert(!isNull(false));
    assert(!isNull(undefined));
  },
});

Deno.test({
  name: "isObject",
  fn: () => {
    const obj = {};

    assert(isObject({}));
    assert(isObject(obj));

    assert(!isObject([]));
    assert(!isObject(() => {}));
    assert(!isObject(true));
    assert(!isObject(1));
    assert(!isObject("object"));
    assert(!isObject(undefined));
    assert(!isObject(null));
  },
});

Deno.test({
  name: "isOneOf",
  fn: () => {
    const needle = "THIS";
    const haystack = ["not this", "mmm, no", "THIS", "another filler"];

    assert(isOneOf(needle, haystack));

    assert(isOneOf(1, [1]));
    assert(isOneOf(42, [1, 2, 3, 42, 43]));
    assert(isOneOf("string", [42, "string", true]));
    assert(isOneOf(true, [42, "string", true]));
    assert(isOneOf(false, [42, "string", false]));
    
    assert(!isOneOf(1, []));
    assert(!isOneOf(42, [1, 2, 3, 43]));
    assert(!isOneOf("string", [42, "_string_", true]));
    assert(!isOneOf(true, [42, "string", false]));
    assert(!isOneOf(false, [42, "string", true]));
  },
});

Deno.test({
  name: "isPresent",
  fn: () => {
    assert(isPresent(true));
    assert(isPresent({}));
    assert(isPresent(""));
    assert(isPresent(0));
    assert(isPresent(() => {}));

    assert(!isPresent(null));
    assert(!isPresent(undefined));
  },
});

Deno.test({
  name: "isUndefined",
  fn: () => {
    const undefinedConst: string | undefined = undefined;

    assert(isUndefined(undefined));
    assert(isUndefined(undefinedConst));

    assert(!isUndefined(0));
    assert(!isUndefined(""));
    assert(!isUndefined({}));
    assert(!isUndefined(false));
    assert(!isUndefined(null));
  },
});
