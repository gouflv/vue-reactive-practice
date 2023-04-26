export type Target = object;

export type Deps = Set<Function>;

export type KeyToDepMap = Map<string, Deps>;

export type TargetMap = WeakMap<Target, KeyToDepMap>;
