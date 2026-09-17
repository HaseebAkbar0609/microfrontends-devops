import { generateTempId } from "@/lib/tempId";
import { SEEDED_PROJECT_DIARIES } from "../data/projectDiaries.mock";
import type { DiaryContent, DiarySignerRole, ProjectDiary } from "../types";

/**
 * The project diaries, in memory.
 *
 * There is no diary endpoint, so this stands in for one, as the record's other
 * sections' services do: a module-level array every read goes through, each
 * mutator reassigning it. A change survives a visit to another section; a hard
 * reload resets to the seed. Nothing is persisted to browser storage (AGENTS.md
 * rule 6) — the order module's diary keeps its logs in `localStorage`, which is
 * why this one does not reuse it.
 *
 * The rules live here as well as in the UI, where an endpoint would enforce
 * them: one diary per project per day, a published diary never changes, and
 * changing a signed diary's content removes its signatures.
 */
let diaries: ProjectDiary[] = SEEDED_PROJECT_DIARIES.map((diary) => structuredClone(diary));

const find = (projectId: string, id: string) =>
	diaries.find((diary) => diary.projectId === projectId && diary.id === id);

const replace = (next: ProjectDiary) => {
	diaries = diaries.map((diary) => (diary.id === next.id ? next : diary));
	return structuredClone(next);
};

/** Newest day first. Copies, so a caller can never change the store by mutating a result. */
export function listDiaries(projectId: string): ProjectDiary[] {
	return diaries
		.filter((diary) => diary.projectId === projectId)
		.sort((a, b) => b.date.localeCompare(a.date))
		.map((diary) => structuredClone(diary));
}

/** An empty draft for a day the project has no diary for yet; `undefined` when it has one. */
export function createDiary(
	projectId: string,
	date: string,
	meta: { createdBy: string; today: string },
): ProjectDiary | undefined {
	if (diaries.some((diary) => diary.projectId === projectId && diary.date === date)) return undefined;

	const diary: ProjectDiary = {
		id: generateTempId(),
		projectId,
		date,
		status: "utkast",
		weather: [],
		workforce: [],
		works: [],
		machines: [],
		deviations: [],
		generalNotes: "",
		selfControlNote: "",
		signatures: { platschef: null, bestallare: null },
		createdBy: meta.createdBy,
		updatedDate: meta.today,
		publishedDate: null,
	};
	diaries = [...diaries, diary];
	return structuredClone(diary);
}

const contentOf = ({ weather, workforce, works, machines, deviations, generalNotes, selfControlNote }: DiaryContent) =>
	JSON.stringify({ weather, workforce, works, machines, deviations, generalNotes, selfControlNote });

/**
 * Saves a draft's content. Refused (`undefined`) for a published or missing
 * diary. When the content actually changed, any signatures are removed — they
 * signed something else.
 */
export function updateDiary(projectId: string, id: string, content: DiaryContent, today: string): ProjectDiary | undefined {
	const previous = find(projectId, id);
	if (!previous || previous.status !== "utkast") return undefined;

	const changed = contentOf(previous) !== contentOf(content);
	return replace({
		...previous,
		...structuredClone(content),
		signatures: changed ? { platschef: null, bestallare: null } : previous.signatures,
		updatedDate: today,
	});
}

export function publishDiary(projectId: string, id: string, today: string): ProjectDiary | undefined {
	const previous = find(projectId, id);
	if (!previous || previous.status !== "utkast") return undefined;
	return replace({ ...previous, status: "publicerad", publishedDate: today });
}

/** Records a signature. Refused for a missing diary or a role that has already signed. */
export function signDiary(
	projectId: string,
	id: string,
	role: DiarySignerRole,
	signature: { name: string; today: string },
): ProjectDiary | undefined {
	const previous = find(projectId, id);
	if (!previous || previous.signatures[role] || !signature.name.trim()) return undefined;
	return replace({
		...previous,
		signatures: { ...previous.signatures, [role]: { name: signature.name, signedDate: signature.today } },
	});
}
