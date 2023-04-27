import { toRaw } from "./reactive";
import { Target, TargetMap } from "./types";

const targetMap: TargetMap = new WeakMap();

let activeEffect: Function | null = null;

export function track(target: Target, key: any) {
  if (!activeEffect) return;

  let keyToDepMap = targetMap.get(target);
  if (!keyToDepMap) {
    targetMap.set(target, (keyToDepMap = new Map()));
  }

  let deps = keyToDepMap.get(key);
  if (!deps) {
    keyToDepMap.set(key, (deps = new Set()));
  }

  console.log("--> track", target, key);

  deps.add(activeEffect);

  activeEffect = null;
}

export function trigger(target: Target, key: any) {
  const keyToDepMap = targetMap.get(target);
  if (!keyToDepMap) return;

  const deps = keyToDepMap.get(key);
  if (!deps) return;

  console.log("----> trigger", target, key, deps);

  deps.forEach((dep) => dep());
}

export function effect(fn: Function) {
  activeEffect = fn;
  fn();
}

export function getDepFromReactive(reactivated: Target, key: string) {
  return targetMap.get(toRaw(reactivated))?.get(key);
}
