import type { GuideCategory, GuideEntry } from "../types";
import { createGuideEntry } from "./contentFactories";

/**
 * Pure transforms for the help-guide tree.
 *
 * The prototype inlined these as deeply nested `map` chains at every call site —
 * one entry delete was a twenty-line triple-nested ternary. Keeping them here
 * leaves the provider as wiring and makes each transform testable on its own.
 */

function mapCategory(
	tree: GuideCategory[],
	categoryId: string,
	apply: (category: GuideCategory) => GuideCategory,
): GuideCategory[] {
	return tree.map((category) =>
		category.id === categoryId ? apply(category) : category,
	);
}

function mapSubcategory(
	tree: GuideCategory[],
	categoryId: string,
	subcategoryId: string,
	apply: (
		subcategory: GuideCategory["subcategories"][number],
	) => GuideCategory["subcategories"][number],
): GuideCategory[] {
	return mapCategory(tree, categoryId, (category) => ({
		...category,
		subcategories: category.subcategories.map((subcategory) =>
			subcategory.id === subcategoryId ? apply(subcategory) : subcategory,
		),
	}));
}

export function renameCategory(
	tree: GuideCategory[],
	categoryId: string,
	name: string,
): GuideCategory[] {
	return mapCategory(tree, categoryId, (category) => ({ ...category, name }));
}

export function removeCategory(
	tree: GuideCategory[],
	categoryId: string,
): GuideCategory[] {
	return tree.filter((category) => category.id !== categoryId);
}

export function renameSubcategory(
	tree: GuideCategory[],
	categoryId: string,
	subcategoryId: string,
	name: string,
): GuideCategory[] {
	return mapSubcategory(tree, categoryId, subcategoryId, (subcategory) => ({
		...subcategory,
		name,
	}));
}

export function removeSubcategory(
	tree: GuideCategory[],
	categoryId: string,
	subcategoryId: string,
): GuideCategory[] {
	return mapCategory(tree, categoryId, (category) => ({
		...category,
		subcategories: category.subcategories.filter(
			(subcategory) => subcategory.id !== subcategoryId,
		),
	}));
}

export function addEntry(
	tree: GuideCategory[],
	categoryId: string,
	subcategoryId: string,
): GuideCategory[] {
	return mapSubcategory(tree, categoryId, subcategoryId, (subcategory) => ({
		...subcategory,
		entries: [...subcategory.entries, createGuideEntry()],
	}));
}

export function updateEntry(
	tree: GuideCategory[],
	categoryId: string,
	subcategoryId: string,
	entryId: string,
	patch: Partial<GuideEntry>,
): GuideCategory[] {
	return mapSubcategory(tree, categoryId, subcategoryId, (subcategory) => ({
		...subcategory,
		entries: subcategory.entries.map((entry) =>
			entry.id === entryId ? { ...entry, ...patch } : entry,
		),
	}));
}

export function removeEntry(
	tree: GuideCategory[],
	categoryId: string,
	subcategoryId: string,
	entryId: string,
): GuideCategory[] {
	return mapSubcategory(tree, categoryId, subcategoryId, (subcategory) => ({
		...subcategory,
		entries: subcategory.entries.filter((entry) => entry.id !== entryId),
	}));
}
