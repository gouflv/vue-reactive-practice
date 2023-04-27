import { describe, expect, it, vi } from "vitest";
import {
  effect,
  getDepFromReactive,
  isReactive,
  reactive,
  toRaw,
  watch,
} from "../src";

describe("reactive", () => {
  it("should return a proxy object", () => {
    const target = { a: 1 };
    const obj = reactive(target);
    expect(obj).not.toBe(target);
    expect(isReactive(obj)).toBeTruthy();
    expect(obj.a).toBe(1);
  });

  it("should toRaw works", () => {
    const target = { a: 1 };
    const obj = reactive(target);
    expect(obj).not.toBe(target);
    expect(toRaw(obj)).toBe(target);
  });
});

describe("shared", () => {
  it("should isReactive works", () => {
    expect(isReactive(reactive({}))).toBeTruthy();
    expect(isReactive({})).toBeFalsy();
  });
});

describe("effect", () => {
  it("basic deps tracking", () => {
    const spy = vi.fn();
    const target = { a: 1 };
    const obj = reactive(target);

    const fn = () => spy(`obj.a eq ${obj.a}`);
    effect(fn);

    expect(spy).toHaveBeenCalledWith("obj.a eq 1");

    /**
     * Inner structure of tracked:
     *
     * obj                 //target
     *   |- a              //key
     *     |- fn           //effect
     */
    const keyToDep = getDepFromReactive(obj, "a");
    expect(keyToDep).toBeInstanceOf(Set);
    expect(keyToDep!.size).toBe(1);
    // expect(keyToDep!.has(fn)).toBeTruthy();
  });

  it("should effect trigger when reactive object changed", () => {
    const spy = vi.fn();
    const target = { a: 1 };
    const obj = reactive(target);

    const fn = () => spy(`obj.a eq ${obj.a}`);
    effect(fn);

    expect(spy).toHaveBeenCalledWith("obj.a eq 1");

    obj.a = 2;

    expect(spy).toHaveBeenCalledWith("obj.a eq 2");
  });

  it("should effect trigger with tracked props", () => {
    const spy = vi.fn();
    const target = { a: 1, b: 1 };
    const obj = reactive(target);

    const fn = () => spy(`obj.a eq ${obj.a}`);
    effect(fn);

    expect(spy).toHaveBeenNthCalledWith(1, "obj.a eq 1");

    obj.a = 2;
    expect(spy).toHaveBeenNthCalledWith(2, "obj.a eq 2");
    expect(spy).toHaveBeenCalledTimes(2);

    obj.b = 2;
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("multiple effects trigger", () => {
    const spyA = vi.fn();
    const spyB = vi.fn();

    const target = { a: 1, b: 1 };
    const obj = reactive(target);

    effect(() => spyA(`obj.a eq ${obj.a}`));
    effect(() => spyB(`obj.b eq ${obj.b}`));

    expect(spyA).toHaveBeenNthCalledWith(1, "obj.a eq 1");
    obj.a = 2;
    expect(spyA).toHaveBeenNthCalledWith(2, "obj.a eq 2");

    expect(spyB).toHaveBeenNthCalledWith(1, "obj.b eq 1");
    obj.b = 2;
    expect(spyB).toHaveBeenNthCalledWith(2, "obj.b eq 2");
  });
});

describe("watch", () => {
  it("should watch works", () => {
    const spy = vi.fn();
    const target = { a: 1 };
    const obj = reactive(target);

    watch(() => obj.a, spy);

    obj.a = 2;

    expect(spy).toHaveBeenCalled();
  });
});
