import { fileRejection, mintTypedUrl, revokeUrls } from "@/features/project/shared/recordFiles";
import { generateTempId } from "@/lib/tempId";
import { PROTOCOLS_MAX, PROTOCOL_FILE_RULES } from "../constants/forecastProtocols.constants";
import { INITIAL_PROTOCOLS } from "../mock/forecastProtocols.mock";
import type { ForecastProtocol, ForecastProtocolUploadInput } from "../types/forecastProtocols.types";

/**
 * Prognos's protocol register, in memory.
 *
 * There is no protocols endpoint, so this stands in for one as the module's
 * other registers do: a module-level array every read goes through, each
 * mutator reassigning it. An upload survives a visit to another screen; a hard
 * reload returns to the seed. Nothing is written to browser storage — a file's
 * bytes have no business there (AGENTS.md rule 6), and a `blob:` URL could not
 * survive a reload anyway.
 */
let protocols: ForecastProtocol[] = INITIAL_PROTOCOLS.map((protocol) => ({ ...protocol }));

/**
 * Newest meeting first — not newest filed. A protocol written up weeks after
 * the meeting takes its place by the date it records, which is why creating
 * one does not simply put it on top.
 */
export function listProtocols(): ForecastProtocol[] {
	return [...protocols].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Files an uploaded protocol, or refuses one the dialog should already have
 * stopped: a missing date, a file of the wrong type or over the size ceiling,
 * or a register already full. The dialog's checks run in the browser; these
 * stand where the endpoint's would.
 *
 * It takes no "today": the date is the meeting's, and the reader gives it.
 */
export function createProtocol(input: ForecastProtocolUploadInput): ForecastProtocol | undefined {
	if (!input.date) return undefined;
	if (fileRejection(input.file, PROTOCOL_FILE_RULES)) return undefined;
	if (protocols.length >= PROTOCOLS_MAX) return undefined;

	const protocol: ForecastProtocol = {
		id: generateTempId(),
		date: input.date,
		type: input.type,
		fileName: input.file.name,
		fileSize: input.file.size,
		url: mintTypedUrl(input.file, PROTOCOL_FILE_RULES.types),
	};

	protocols = [protocol, ...protocols];
	return protocol;
}

/** Permanent, file included. Keep it behind a confirm. */
export function removeProtocol(id: string): void {
	const target = protocols.find((protocol) => protocol.id === id);
	if (!target) return;
	protocols = protocols.filter((protocol) => protocol !== target);
	revokeUrls([target]);
}
