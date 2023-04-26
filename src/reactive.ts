import { track, trigger } from "./effect";
import { Target } from "./types";

export const IS_REACTIVE = "__isReactive";
export const TO_RAW = "__toRaw";

export function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target, key) {
      if (key === IS_REACTIVE) return true;

      if (key === TO_RAW) return target;

      track(target, key);

      return target[key];
    },
    set(target, key, value) {
      target[key] = value;

      trigger(target, key);

      return true;
    },
  });
}

export function isReactive(target: Target) {
  return target[IS_REACTIVE];
}

export function toRaw<T>(reactivated: T): T {
  return reactivated[TO_RAW];
}
