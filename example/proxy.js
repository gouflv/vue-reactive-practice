// Case1 - logging
let proxy1 = new Proxy(
  { a: 1 },
  {
    get(target, key) {
      console.log(`getting ${key} of ${JSON.stringify(target)}`);
      return target[key];
    },
  }
);
console.log("proxy1.a", proxy1.a);

// Case2 - default value
let proxy2 = new Proxy(
  { a: 1 },
  {
    get(target, key) {
      console.log(`getting ${key} of ${JSON.stringify(target)}`);

      // if key not in target, return 42
      if (!(key in target)) {
        return 42;
      }

      return target[key];
    },
  }
);

console.log("proxy2.a", proxy2.a);
console.log("proxy2.X", proxy2.X);

// Case3 - set validation
let proxy3 = new Proxy(
  { a: 1 },
  {
    set(target, key, value) {
      console.log(`setting ${key} of ${JSON.stringify(target)} to ${value}`);

      if (key === "a" && value > 100) {
        throw new Error("a cannot be greater than 100");
      }

      target[key] = value;
    },
  }
);

proxy3.a = 10;
console.log("proxy3.a", proxy3.a);
proxy3.a = 101;
console.log("proxy3.a", proxy3.a);
