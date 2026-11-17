import { describe, it, expect } from "vitest";
import { toSlug } from "../index";

describe("toSlug", () => {
  it("lowercases and hyphenates a title", () => {
    expect(toSlug("  Hello, Deep Modules!  ")).toBe("hello-deep-modules");
  });

  it.each([
    ["Crème Brûlée", "creme-brulee"],
    ["Jalapeño Guide", "jalapeno-guide"],
    ["ÀÉÎÖÜ Ç", "aeiou-c"],
    ["Cre\u0300me Bru\u0302le\u0301e", "creme-brulee"],
  ])("preserves the base letters of %s", (title, expected) => {
    expect(toSlug(title)).toBe(expected);
  });

  it.each([
    ["ABC xyz 0123456789", "abc-xyz-0123456789"],
    ["  one\t\n two  ", "one-two"],
    ["...one!!!two___three---", "one-two-three"],
    ["", ""],
    [" \t\n ", ""],
    ["!@#$%^&*()", ""],
  ])("keeps existing slug rules for %j", (title, expected) => {
    expect(toSlug(title)).toBe(expected);
  });
});
