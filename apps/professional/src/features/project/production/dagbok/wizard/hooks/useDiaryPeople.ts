"use client";

import { useMemo } from "react";

import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import localizationConstants from "@/utils/translation/constants";
import { buildProjectStaffLedger } from "../../../personalliggare/data/projectStaffLedger.mock";
import { buildProjectOrganisation } from "../../../organisation/data/projectOrganisation.mock";
import type { DiaryProjectFacts } from "../../hooks/useDiaryProject";

export interface DiaryPerson {
	name: string;
	/** "@förnamn", folded to ASCII — the frame draws a handle beside each name. */
	handle: string;
}

const FOLD: Record<string, string> = { å: "a", ä: "a", ö: "o", é: "e", ü: "u" };

function handleOf(name: string): string {
	const first = name.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
	return `@${[...first].map((letter) => FOLD[letter] ?? letter).join("")}`;
}

/**
 * Who can be named in Skapat av: the signed-in user first, then the project's
 * own people — its manager, the organisation's contacts and everyone in the
 * staff ledger. Names are the value, since that is what a diary records.
 *
 * The frame's "Rachel Meyers @rachel" is Figma placeholder copy; the handles
 * here are made from the first name, as no account in this app carries one.
 */
export function useDiaryPeople(projectId: string, facts: DiaryProjectFacts): DiaryPerson[] {
	const currentUser = useCurrentUserName(localizationConstants.projectDiaryYou);

	return useMemo(() => {
		const names = [
			currentUser,
			facts.signers.platschef,
			facts.signers.bestallare,
			...(buildProjectOrganisation(projectId) ?? []).map((member) => member.kontakt),
			...(buildProjectStaffLedger(projectId) ?? []).map((entry) => entry.name),
		];

		const seen = new Set<string>();
		return names.flatMap((name) => {
			const trimmed = name.trim();
			if (!trimmed || seen.has(trimmed)) return [];
			seen.add(trimmed);
			return [{ name: trimmed, handle: handleOf(trimmed) }];
		});
	}, [projectId, facts.signers, currentUser]);
}
