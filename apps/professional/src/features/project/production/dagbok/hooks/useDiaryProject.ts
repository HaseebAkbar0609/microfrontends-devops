"use client";

import { useMemo } from "react";

import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";
import { buildProjectRecordInfo } from "../../data/projectRecordInfo.mock";
import type { DiarySignerRole } from "../types";

export interface DiaryProjectFacts {
	/** "Projekt nr N" in the page title, as the list row stores it. */
	projectNr: string;
	/** The frame's Projekt box: the block name ("Kv …") when the project has one. */
	name: string;
	projectNo: string;
	address: string;
	/** For Plats in the weather card. */
	city: string;
	startDate: string;
	endDate: string;
	/** Who the Bekräfta section asks to sign. */
	signers: Record<DiarySignerRole, string>;
}

/**
 * The project facts the diary page shows, read once. `null` for an id that
 * matches no project, which the page turns into a 404.
 *
 * The signers are the project's own people: its project manager signs as
 * Platschef and the customer's contact as Beställare.
 */
export function useDiaryProject(projectId: string): DiaryProjectFacts | null {
	return useMemo(() => {
		const row = PROJECT_LIST_ROWS.find((project) => project.id === projectId);
		const record = buildProjectRecordInfo(projectId);
		if (!row || !record) return null;

		const { details, contactPerson } = record;
		const place = [details.postalCode, details.city].filter(Boolean).join(" ");

		return {
			projectNr: row.projectNr,
			name: details.blockName || details.projectName,
			projectNo: details.projectNo.replace(/^#/, ""),
			address: [details.projectAddress, place].filter(Boolean).join(", "),
			city: details.city,
			startDate: details.startDate,
			endDate: details.endDate,
			signers: {
				platschef: row.projectManager,
				bestallare: [contactPerson.firstName, contactPerson.lastName].filter(Boolean).join(" "),
			},
		};
	}, [projectId]);
}
