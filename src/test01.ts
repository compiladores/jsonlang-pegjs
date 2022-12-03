import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { testGramar } from "./index.ts";

Deno.test("Hello Test", () => {
  assert("Hello");
});

Deno.test("Test01", async () => {
  const res = await testGramar('var x = 5;')
  console.log(res);
  
  assert(res === null)
})