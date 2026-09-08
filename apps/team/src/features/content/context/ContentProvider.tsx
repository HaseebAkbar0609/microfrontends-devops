"use client";

import {
	createContext,
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { CONTENT_ROWS_SEED } from "../constants/contentSamples.mock";
import { SUPPORT_GUIDE_SEED } from "../constants/supportGuide.mock";
import type {
	ContentContextValue,
	ContentGroupId,
	ContentRow,
	ContentRowValues,
	ContentRowsBySection,
	GuideCategory,
	SupportContact,
	SupportGuideState,
} from "../types";
import {
	createGuideCategory,
	createGuideSubcategory,
	createRowId,
} from "../utils/contentFactories";
import * as guide from "../utils/guideMutations";

export const ContentContext = createContext<ContentContextValue | null>(null);

const EMPTY_ROWS: ContentRow[] = [];

/**
 * Holds the content console for the length of the session.
 *
 * The prototype reset every row in a `useEffect` keyed on the section, so
 * switching sections silently discarded edits. Lifting the state here keeps
 * them, and mirrors `SalesCrmProvider` and `SupportProvider`.
 */
export function ContentProvider({ children }: { children: ReactNode }) {
	const [rows, setRows] = useState<ContentRowsBySection>(CONTENT_ROWS_SEED);
	const [guides, setGuides] =
		useState<Record<ContentGroupId, SupportGuideState>>(SUPPORT_GUIDE_SEED);

	const getRows = useCallback(
		(sectionKey: string) => rows[sectionKey] ?? EMPTY_ROWS,
		[rows],
	);

	const addRow = useCallback((sectionKey: string, values: ContentRowValues) => {
		setRows((previous) => ({
			...previous,
			[sectionKey]: [
				{ id: createRowId(), values },
				...(previous[sectionKey] ?? []),
			],
		}));
	}, []);

	const updateRow = useCallback(
		(sectionKey: string, rowId: string, values: ContentRowValues) => {
			setRows((previous) => ({
				...previous,
				[sectionKey]: (previous[sectionKey] ?? []).map((row) =>
					row.id === rowId ? { ...row, values } : row,
				),
			}));
		},
		[],
	);

	const removeRow = useCallback((sectionKey: string, rowId: string) => {
		setRows((previous) => ({
			...previous,
			[sectionKey]: (previous[sectionKey] ?? []).filter(
				(row) => row.id !== rowId,
			),
		}));
	}, []);

	const getGuide = useCallback(
		(groupId: ContentGroupId) => guides[groupId],
		[guides],
	);

	const patchTree = useCallback(
		(
			groupId: ContentGroupId,
			apply: (tree: GuideCategory[]) => GuideCategory[],
		) => {
			setGuides((previous) => ({
				...previous,
				[groupId]: {
					...previous[groupId],
					tree: apply(previous[groupId].tree),
				},
			}));
		},
		[],
	);

	const setContact = useCallback(
		(groupId: ContentGroupId, contact: SupportContact) => {
			setGuides((previous) => ({
				...previous,
				[groupId]: { ...previous[groupId], contact },
			}));
		},
		[],
	);

	const addCategory = useCallback(
		(groupId: ContentGroupId, name: string) => {
			patchTree(groupId, (tree) => [...tree, createGuideCategory(name)]);
		},
		[patchTree],
	);

	const addSubcategory = useCallback(
		(groupId: ContentGroupId, categoryId: string, name: string) => {
			// Built here rather than inside the transform so the caller gets the id
			// back and can expand the new branch.
			const subcategory = createGuideSubcategory(name);
			patchTree(groupId, (tree) =>
				tree.map((category) =>
					category.id === categoryId
						? {
								...category,
								subcategories: [...category.subcategories, subcategory],
							}
						: category,
				),
			);
			return subcategory.id;
		},
		[patchTree],
	);

	const value = useMemo<ContentContextValue>(
		() => ({
			getRows,
			addRow,
			updateRow,
			removeRow,
			getGuide,
			setContact,
			addCategory,
			addSubcategory,
			renameCategory: (groupId, categoryId, name) =>
				patchTree(groupId, (tree) =>
					guide.renameCategory(tree, categoryId, name),
				),
			removeCategory: (groupId, categoryId) =>
				patchTree(groupId, (tree) => guide.removeCategory(tree, categoryId)),
			renameSubcategory: (groupId, categoryId, subcategoryId, name) =>
				patchTree(groupId, (tree) =>
					guide.renameSubcategory(tree, categoryId, subcategoryId, name),
				),
			removeSubcategory: (groupId, categoryId, subcategoryId) =>
				patchTree(groupId, (tree) =>
					guide.removeSubcategory(tree, categoryId, subcategoryId),
				),
			addEntry: (groupId, categoryId, subcategoryId) =>
				patchTree(groupId, (tree) =>
					guide.addEntry(tree, categoryId, subcategoryId),
				),
			updateEntry: (groupId, categoryId, subcategoryId, entryId, patch) =>
				patchTree(groupId, (tree) =>
					guide.updateEntry(tree, categoryId, subcategoryId, entryId, patch),
				),
			removeEntry: (groupId, categoryId, subcategoryId, entryId) =>
				patchTree(groupId, (tree) =>
					guide.removeEntry(tree, categoryId, subcategoryId, entryId),
				),
		}),
		[
			getRows,
			addRow,
			updateRow,
			removeRow,
			getGuide,
			setContact,
			addCategory,
			addSubcategory,
			patchTree,
		],
	);

	return (
		<ContentContext.Provider value={value}>{children}</ContentContext.Provider>
	);
}
