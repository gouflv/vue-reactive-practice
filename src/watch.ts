import { effect } from "./effect";

export function watch(source: Function, cb: Function) {
  effect(() => source(), {
    schedule: cb,
  });
}
