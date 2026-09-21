"use client";

import { useMemo } from "react";

import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";

export interface ProtocolProjectFacts {
	/** "5001" — Protokoll nr is built from it. */
	projectNo: string;
	/** Projekt namn, as the project list names it. */
	projectName: string;
}

/** The project line the meeting screens show; `null` for an id that matches no project, which the page 404s. */
export function useProtocolProject(projectId: string): ProtocolProjectFacts | null {
	return useMemo(() => {
		const row = PROJECT_LIST_ROWS.find((project) => project.id === projectId);
		return row ? { projectNo: row.projectNr.replace(/^#/, ""), projectName: row.name } : null;
	}, [projectId]);
}
