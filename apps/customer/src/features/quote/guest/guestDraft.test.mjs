import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import {
  clearGuestQuote,
  GUEST_QUOTE_KEY,
  guestQuoteDefaults,
  guestQuoteValuesSchema,
  readGuestQuote,
  writeGuestQuote,
} from "./guestDraft.ts";

const items = new Map();
globalThis.sessionStorage = {
  getItem: (key) => items.get(key) ?? null,
  setItem: (key, value) => items.set(key, value),
  removeItem: (key) => items.delete(key),
};

beforeEach(() => items.clear());

test("restores a completed guest quote after leaving the page", () => {
  const values = {
    ...guestQuoteDefaults,
    firstName: "QA",
    lastName: "Guest",
    email: "qa@example.com",
    phone: "0700000000",
    address: "Testgatan 1",
    personalCity: "9ce093b9-3ebc-4a18-b8f8-7bb9d926093a",
    postalCode: "11122",
    projectName: "Test project",
    projectAddress: "Testgatan 1",
    projectCity: "9ce093b9-3ebc-4a18-b8f8-7bb9d926093a",
    projectPostalCode: "11122",
    description: "A test project description",
  };
  assert.equal(guestQuoteValuesSchema.safeParse(values).success, true);
  assert.equal(writeGuestQuote({ version: 1, step: 4, completed: true, values }), true);
  assert.deepEqual(readGuestQuote()?.values, values);
  assert.equal(readGuestQuote()?.completed, true);
});

test("keeps the created project ID when an import needs retrying", () => {
  const draft = { version: 1, step: 4, completed: true, values: guestQuoteDefaults };
  writeGuestQuote(draft);
  const projectId = "724518f7-d68e-4dd3-92c0-a6d0d14bb1c8";
  writeGuestQuote({ ...readGuestQuote(), projectId });
  assert.equal(readGuestQuote()?.projectId, projectId);
  clearGuestQuote();
  assert.equal(readGuestQuote(), null);
});

test("rejects malformed or incompatible saved drafts", () => {
  items.set(GUEST_QUOTE_KEY, "not json");
  assert.equal(readGuestQuote(), null);
  items.set(GUEST_QUOTE_KEY, JSON.stringify({ version: 2, step: 4, completed: true }));
  assert.equal(readGuestQuote(), null);
});

test("reports storage failure without pretending the draft was saved", () => {
  const original = globalThis.sessionStorage;
  globalThis.sessionStorage = { setItem: () => { throw new Error("disabled"); } };
  assert.equal(writeGuestQuote({ version: 1, step: 1, completed: false, values: guestQuoteDefaults }), false);
  globalThis.sessionStorage = original;
});
