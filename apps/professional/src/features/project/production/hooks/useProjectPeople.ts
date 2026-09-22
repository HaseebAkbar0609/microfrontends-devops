"use client";

import { useMemo } from "react";

import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import type { TranslationKeys } from "@/utils/translation/constants";
import { PROJECT_LIST_ROWS } from "../../data/projectsOverview.mock";
import { buildProjectRecordInfo } from "../data/projectRecordInfo.mock";
import { buildProjectOrganisation } from "../organisation/data/projectOrganisation.mock";
import { buildProjectStaffLedger } from "../personalliggare/data/projectStaffLedger.mock";

export interface ProjectPerson {
	name: string;
	/** "@förnamn", folded to ASCII — the frames draw a handle beside each name. */
	handle: string;
}

const FOLD: Record<string, string> = { å: "a", ä: "a", ö: "o", é: "e", ü: "u" };

function handleOf(name: string): string {
	const first = name.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
	return `@${[...first].map((letter) => FOLD[letter] ?? letter).join("")}`;
}

/** A stored name as a person — for one the project's list no longer carries. */
export function toPerson(name: string): ProjectPerson {
	return { name, handle: handleOf(name) };
}

/**
 * Who can be named on the project's records: the signed-in user first, then
 * the project's own people — its manager, the customer's contact, the
 * organisation's contacts and everyone in the staff ledger — each once. Names
 * are the value, since that is what a diary or a protocol records.
 *
 * The frames' "Rachel Meyers @rachel" is Figma placeholder copy; the handles
 * here are made from the first name, as no account in this app carries one.
 *
 * @param youKey read when the signed-in account carries no name — the section's own "Du".
 */
export function useProjectPeople(projectId: string, youKey: TranslationKeys): ProjectPerson[] {
	const currentUser = useCurrentUserName(youKey);

	return useMemo(() => {
		const row = PROJECT_LIST_ROWS.find((project) => project.id === projectId);
		const contact = buildProjectRecordInfo(projectId)?.contactPerson;
		const names = [
			currentUser,
			row?.projectManager ?? "",
			[contact?.firstName, contact?.lastName].filter(Boolean).join(" "),
			...(buildProjectOrganisation(projectId) ?? []).map((member) => member.kontakt),
			...(buildProjectStaffLedger(projectId) ?? []).map((entry) => entry.name),
		];

		const seen = new Set<string>();
		return names.flatMap((name) => {
			const trimmed = name.trim();
			if (!trimmed || seen.has(trimmed)) return [];
			seen.add(trimmed);
			return [toPerson(trimmed)];
		});
	}, [projectId, currentUser]);
}
