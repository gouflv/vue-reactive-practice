// @vitest-environment jsdom

import { expect, it } from "vitest";
import { effect, reactive } from "../src";

it("should render with reactive object", () => {
  const target = { a: 1 };
  const obj = reactive(target);

  effect(() => {
    document.body.innerHTML = `<div>${obj.a}</div>`;
  });

  expect(document.body.innerHTML).toBe(`<div>1</div>`);

  obj.a = 2;
  expect(document.body.innerHTML).toBe(`<div>2</div>`);

  /**
   * reactiveRender({
   *   el: document.body,
   *   data() {
   *     return { a: 1 }
   *   },
   *   render() {
   *     return `<div>${this.a}</div>`
   *   }
   * })
   */
});
