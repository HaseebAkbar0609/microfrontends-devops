"use client";

import { useMemo } from "react";

import localizationConstants from "@/utils/translation/constants";
import { toPerson, useProjectPeople, type ProjectPerson } from "../../hooks/useProjectPeople";

const NO_NAMES: string[] = [];

/**
 * Who a meeting can name — the project's people, plus any name the meeting
 * already records that the project's list no longer carries, so a saved Värd
 * or participant never shows as empty. Pass `storedNames` memoised.
 */
export function useMeetingPeople(projectId: string, storedNames: string[] = NO_NAMES): ProjectPerson[] {
	const people = useProjectPeople(projectId, localizationConstants.projectProtocolYou);

	return useMemo(() => {
		const known = new Set(people.map((person) => person.name));
		const missing = [...new Set(storedNames)].filter((name) => !known.has(name)).map(toPerson);
		return missing.length > 0 ? [...people, ...missing] : people;
	}, [people, storedNames]);
}
