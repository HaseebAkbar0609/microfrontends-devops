import { fileRejection, mintTypedUrl, revokeUrls } from "@/features/project/shared/recordFiles";
import { generateTempId } from "@/lib/tempId";
import { TEMPLATE_FILE_RULES } from "../constants/forecastTemplates.constants";
import { INITIAL_TEMPLATES } from "../mock/forecastTemplates.mock";
import type { TemplateDocument, TemplateUploadInput } from "../types/forecastTemplates.types";

/**
 * Prognos's template register, in memory.
 *
 * There is no templates endpoint, so this stands in for one as the report
 * register's service does: a module-level array every read goes through, each
 * mutator reassigning it. A new template survives a visit to another screen; a
 * hard reload returns to the seed. Nothing is written to browser storage — a
 * file's bytes have no business there (AGENTS.md rule 6), and a `blob:` URL
 * could not survive a reload anyway.
 *
 * It also stands in for the upload endpoint, so it owns the files' `blob:`
 * URLs: minted when a template is stored, revoked when one is deleted.
 */
let templates: TemplateDocument[] = INITIAL_TEMPLATES.map((template) => ({ ...template }));

/** Newest first: ISO dates sort as text, and ties keep their stored order. */
export function listTemplates(): TemplateDocument[] {
	return [...templates].sort((a, b) => b.date.localeCompare(a.date));
}

/** The number the next template gets, continuing the register's own series. */
function nextTemplateNo(): string {
	const highest = templates.reduce((max, template) => {
		const parsed = Number(template.templateNo);
		return Number.isFinite(parsed) && parsed > max ? parsed : max;
	}, 0);
	return String(highest + 1).padStart(4, "0");
}

/**
 * Stores a new template, or refuses one the dialog should already have
 * stopped: a file of the wrong type or over the size ceiling, a register
 * already full, or a name that is blank once trimmed. The dialog's checks run
 * in the browser; these stand where the endpoint's would.
 */
export function createTemplate(input: TemplateUploadInput, today: string): TemplateDocument | undefined {
	if (fileRejection(input.file, TEMPLATE_FILE_RULES)) return undefined;
	if (templates.length >= TEMPLATE_FILE_RULES.maxCount) return undefined;

	const documentName = input.documentName.trim();
	if (!documentName) return undefined;

	/* An empty description is no description, so the dialog shows its own line
	   for one rather than an empty paragraph. */
	const description = input.description?.trim() || undefined;

	const template: TemplateDocument = {
		id: generateTempId(),
		templateNo: nextTemplateNo(),
		category: input.category,
		documentName,
		fileName: input.file.name,
		fileSize: input.file.size,
		date: today,
		description,
		url: mintTypedUrl(input.file, TEMPLATE_FILE_RULES.types),
	};

	templates = [template, ...templates];
	return template;
}

/** Permanent, file included. Keep it behind a confirm. */
export function removeTemplate(id: string): void {
	const target = templates.find((template) => template.id === id);
	if (!target) return;
	templates = templates.filter((template) => template !== target);
	revokeUrls([target]);
}
