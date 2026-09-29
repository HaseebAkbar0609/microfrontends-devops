/**
 * Which main-menu entry is lit for a route.
 *
 * isActiveNavHref lights an entry only when no longer menu entry also matches,
 * so a parent such as /admin goes dark once a deeper entry owns the page. Every
 * page's menu goes through it, so the edges are pinned here.
 *
 * Follows admin-user-contract.spec.ts: the Playwright runner, no browser.
 */
import { expect, test } from "@playwright/test";
import { isActiveNavHref } from "../src/components/layout/sidebar/navConfig";

test("a parent entry goes dark when a deeper entry owns the page", () => {
	expect(isActiveNavHref("/admin", "/admin/users")).toBe(false);
	expect(isActiveNavHref("/admin/users", "/admin/users")).toBe(true);
});

test("a parent stays lit on its own page", () => {
	expect(isActiveNavHref("/admin", "/admin")).toBe(true);
});

test("a page with no menu entry of its own lights its nearest ancestor", () => {
	// A record's detail page is not in the menu; its list entry should own it.
	expect(isActiveNavHref("/admin/users", "/admin/users/5f0e8a4b")).toBe(true);
	expect(isActiveNavHref("/admin", "/admin/users/5f0e8a4b")).toBe(false);
});

test("a shared prefix is not a match", () => {
	// /admin/users must not light for /admin/usersettings.
	expect(isActiveNavHref("/admin/users", "/admin/usersettings")).toBe(false);
});

test("an unrelated route lights nothing under /admin", () => {
	expect(isActiveNavHref("/admin", "/home")).toBe(false);
});
