import { revokeUrls } from "@/features/project/shared/recordFiles";
import { DOCUMENT_FILE_RULES } from "../constants/forecastDocuments.constants";
import { INITIAL_DOCUMENTS } from "../mock/forecastDocuments.mock";
import type { DocumentUploadInput, ForecastDocument } from "../types/forecastDocuments.types";

/**
 * Prognos's document centre, in memory.
 *
 * There is no documents endpoint, so this stands in for one as the report
 * register's service does: a module-level array every read goes through, each
 * mutator reassigning it. An upload survives a visit to another screen; a hard
 * reload returns to the seed. Nothing is written to browser storage — a file's
 * bytes have no business there (AGENTS.md rule 6), and a `blob:` URL could not
 * survive a reload anyway.
 *
 * The create page mints the URLs, because its table offers them before
 * anything is filed; this service only takes ownership of them.
 */
let documents: ForecastDocument[] = INITIAL_DOCUMENTS.map((document) => ({ ...document }));

/** Newest first: ISO dates sort as text, and ties keep their stored order. */
export function listDocuments(): ForecastDocument[] {
	return [...documents].sort((a, b) => b.date.localeCompare(a.date));
}

/** The highest number the register has issued so far. */
function highestNumber(): number {
	return documents.reduce((max, document) => {
		const parsed = Number(document.documentNo);
		return Number.isFinite(parsed) && parsed > max ? parsed : max;
	}, 0);
}

/**
 * Files a whole batch under one category, numbering each in turn.
 *
 * All or nothing: a batch that would overflow the register is refused whole
 * rather than filed in part, so the reader is never left guessing which of
 * their files made it. The create page has already checked every file against
 * the rules, so this stands where the endpoint's own guard would.
 */
export function createDocuments(input: DocumentUploadInput): ForecastDocument[] {
	if (input.staged.length === 0) return [];
	if (documents.length + input.staged.length > DOCUMENT_FILE_RULES.maxCount) return [];

	const from = highestNumber();
	const created: ForecastDocument[] = input.staged.map((item, index) => ({
		id: item.id,
		documentNo: String(from + index + 1).padStart(4, "0"),
		category: input.category,
		fileName: item.name,
		fileSize: item.fileSize,
		date: item.date,
		url: item.url,
	}));

	/* Every row in a batch shares a date, and the sort is stable, so the
	   order they are stored in is the order they show. Reversed, the
	   highest number sits on top, as a one-at-a-time upload would. */
	documents = [...created].reverse().concat(documents);
	return created;
}

/** Permanent, file included. Keep it behind a confirm. */
export function removeDocument(id: string): void {
	const target = documents.find((document) => document.id === id);
	if (!target) return;
	documents = documents.filter((document) => document !== target);
	revokeUrls([target]);
}
