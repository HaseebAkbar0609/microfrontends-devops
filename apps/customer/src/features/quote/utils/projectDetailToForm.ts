import type { CreateOfferFormValues, QuoteDocument, QuoteSupplier } from "../types/form";

function s(v: unknown): string {
	if (v == null || v === "") return "";
	if (typeof v === "string") return v.trim();
	if (typeof v === "number" || typeof v === "boolean")
		return String(v).trim();
	// Avoid "[object Object]" from passing objects into form text fields
	if (typeof v === "object") return "";
	return String(v).trim();
}

/**
 * GET project may return `project_description` as a string or as a nested object
 * (e.g. i18n map or `{ text, content }`).
 */
function descriptionFromApi(v: unknown): string {
	if (v == null || v === "") return "";
	if (typeof v === "string") return v.trim();
	if (typeof v === "number" || typeof v === "boolean")
		return String(v).trim();
	if (typeof v !== "object") return "";
	const o = v as Record<string, unknown>;
	const preferredKeys = [
		/** Nested GET project block: `{ project_description: "..." , media }` */
		"project_description",
		"text",
		"content",
		"value",
		"body",
		"description",
		"default",
		"en",
		"sv",
		"no",
		"nb",
	];
	for (const k of preferredKeys) {
		const inner = o[k];
		if (typeof inner === "string" && inner.trim()) return inner.trim();
	}
	const skipDescriptionKeys = new Set([
		"media",
		"documents",
		"files",
		"attachments",
		"project_media",
		"images",
		"videos",
	]);
	for (const [k, val] of Object.entries(o)) {
		if (skipDescriptionKeys.has(k)) continue;
		if (typeof val === "string" && val.trim()) return val.trim();
		if (Array.isArray(val) && val.length) {
			const joined = val
				.map((x) => (typeof x === "string" ? x : ""))
				.filter(Boolean)
				.join("\n");
			if (joined.trim()) return joined.trim();
		}
	}
	return "";
}

/** Unwrap nested `project` / `attributes` so `media` and description map correctly */
function flattenProjectPayload(
	raw: Record<string, unknown>,
): Record<string, unknown> {
	let row: Record<string, unknown> = { ...raw };
	for (const key of ["result", "payload"] as const) {
		const nest = raw[key];
		if (
			nest != null &&
			typeof nest === "object" &&
			!Array.isArray(nest)
		) {
			row = { ...row, ...(nest as Record<string, unknown>) };
		}
	}
	const attrs = row.attributes;
	if (
		attrs != null &&
		typeof attrs === "object" &&
		!Array.isArray(attrs)
	) {
		row = { ...row, ...(attrs as Record<string, unknown>) };
	}
	const project = row.project;
	if (
		project != null &&
		typeof project === "object" &&
		!Array.isArray(project)
	) {
		row = { ...row, ...(project as Record<string, unknown>) };
	}
	return row;
}

/** One field that may be an array or a wrapper object with a list inside */
function asMediaArraySingle(v: unknown): unknown[] {
	if (Array.isArray(v)) return v;
	if (v != null && typeof v === "object") {
		const bag = v as Record<string, unknown>;
		for (const k of ["data", "items", "media", "rows", "list"] as const) {
			const inner = bag[k];
			if (Array.isArray(inner)) return inner;
		}
	}
	return [];
}

function mediaItemId(m: unknown): string {
	if (m == null || typeof m !== "object") return "";
	const o = m as Record<string, unknown>;
	return s(o.id ?? o.media_id ?? o.file_id ?? o.uuid);
}

/**
 * Collect media from the project root and from nested `project_description` /
 * `description` objects (API often nests `media` next to description text).
 */
function gatherMediaItems(row: Record<string, unknown>): unknown[] {
	const collected: unknown[] = [];
	const take = (v: unknown) => {
		collected.push(...asMediaArraySingle(v));
	};

	take(row.media);
	take(row.documents);
	take(row.project_media);
	take(row.attachments);

	for (const key of ["project_description", "description"] as const) {
		const block = row[key];
		if (block == null || typeof block !== "object" || Array.isArray(block))
			continue;
		const p = block as Record<string, unknown>;
		take(p.media);
		take(p.documents);
		take(p.project_media);
		take(p.attachments);
		take(p.files);
	}

	const seen = new Set<string>();
	const out: unknown[] = [];
	for (const m of collected) {
		const id = mediaItemId(m);
		if (id) {
			if (seen.has(id)) continue;
			seen.add(id);
		}
		out.push(m);
	}
	return out;
}

function num(v: unknown): number {
	if (typeof v === "number" && !Number.isNaN(v)) return v;
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
}

function expressFromRow(row: Record<string, unknown>): string {
	const pt = s(row.project_type).toLowerCase();
	if (pt === "express") return "express";
	if (pt === "b2c") return "b2c";
	const ex = row.is_express;
	if (ex === true) return "express";
	if (ex === false) return "b2c";
	return "b2c";
}

function categoryIdsFromRow(row: Record<string, unknown>): string[] {
	const ids = row.category_ids;
	if (Array.isArray(ids)) {
		return ids.map((x) => s(x)).filter(Boolean);
	}
	const subs = row.subcategories;
	if (Array.isArray(subs)) {
		const out: string[] = [];
		for (const item of subs) {
			if (item != null && typeof item === "object" && "id" in item) {
				const id = s((item as { id?: unknown }).id);
				if (id) out.push(id);
			}
		}
		if (out.length) return out;
	}
	const single = s(row.category_id);
	return single ? [single] : [];
}

const MIME_TO_EXT: Record<string, string> = {
	"application/pdf": "pdf",
	"application/msword": "doc",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
		"docx",
	"application/vnd.ms-excel": "xls",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/gif": "gif",
	"image/webp": "webp",
};

function extensionFromFileName(fileName: string): string {
	const parts = fileName.split(".");
	if (parts.length < 2) return "";
	return parts.pop()!.trim().toLowerCase();
}

function displayTypeFromMedia(o: Record<string, unknown>, fileName: string): string {
	const fromName = extensionFromFileName(fileName);
	if (fromName) return fromName;
	const mime = s(o.mime_type ?? o.content_type ?? o.type).toLowerCase();
	if (mime && MIME_TO_EXT[mime]) return MIME_TO_EXT[mime];
	if (mime.includes("/")) return mime.split("/").pop() || "file";
	return "file";
}

function formatMediaDate(v: unknown): string {
	if (typeof v === "number" && Number.isFinite(v)) {
		const d = new Date(v);
		return Number.isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
	}
	if (typeof v === "string" && v.trim()) {
		const asNum = Number(v);
		if (Number.isFinite(asNum) && asNum > 1e11) {
			const d = new Date(asNum);
			return Number.isNaN(d.getTime()) ? v.trim() : d.toISOString().split("T")[0];
		}
		return v.trim();
	}
	return "";
}

function documentsFromRow(row: Record<string, unknown>): QuoteDocument[] {
	const media = gatherMediaItems(row);
	if (!media.length) return [];
	const out: QuoteDocument[] = [];
	for (const m of media) {
		if (m == null || typeof m !== "object") continue;
		const o = m as Record<string, unknown>;
		const id = s(o.id ?? o.media_id ?? o.file_id ?? o.uuid);
		if (!id) continue;
		const name = s(o.name ?? o.file_name ?? o.filename ?? "file");
		const urlRaw = o.url;
		const url = typeof urlRaw === "string" && urlRaw.trim() ? urlRaw.trim() : undefined;
		out.push({
			id,
			name,
			size: num(o.size ?? o.file_size),
			type: displayTypeFromMedia(o, name),
			date: formatMediaDate(o.date ?? o.created_at ?? o.updated_at),
			...(url ? { url } : {}),
		});
	}
	return out;
}

function suppliersFromRow(row: Record<string, unknown>): QuoteSupplier[] {
	let raw: unknown = row.suppliers ?? row.invited_suppliers;
	if (raw != null && typeof raw === "object" && !Array.isArray(raw)) {
		const bag = raw as Record<string, unknown>;
		raw =
			bag.invited_suppliers ??
			bag.items ??
			bag.data ??
			bag.list;
	}
	if (!Array.isArray(raw)) return [];
	const out: QuoteSupplier[] = [];
	for (const item of raw) {
		if (item == null || typeof item !== "object") continue;
		const r = item as Record<string, unknown>;
		out.push({
			id: s(r.id) || Math.random().toString(36).slice(2),
			companyName: s(r.company_name ?? r.companyName),
			category: s(r.category ?? r.subcategory_id ?? ""),
			orgNumber: s(r.organization_number ?? r.orgNumber),
			contactFirstName: s(r.first_name ?? r.contact_first_name),
			contactLastName: s(r.last_name ?? r.contact_last_name),
			emailAddress: s(r.email ?? r.email_address),
			mobileNumber: s(r.mobile_number ?? r.phone),
		});
	}
	return out;
}

export interface ProjectFormHydration {
	values: Partial<CreateOfferFormValues>;
	/** Wizard step 1–5 (UI uses 5 for overview) */
	step: number;
}

/**
 * Maps GET /api/v1/project/:id body (flattened or nested) into form defaults + step.
 */
function nestedObject(
	v: unknown,
): Record<string, unknown> | undefined {
	if (v != null && typeof v === "object" && !Array.isArray(v)) {
		return v as Record<string, unknown>;
	}
	return undefined;
}

/**
 * Description text only (avoid passing whole `{ project_description, media }` as string source).
 */
function descriptionSourceFromRow(row: Record<string, unknown>): unknown {
	const block = nestedObject(row.project_description);
	if (block) {
		const inner =
			block.project_description ??
			block.description ??
			block.text ??
			block.content;
		return inner ?? "";
	}
	if (typeof row.project_description === "string") return row.project_description;
	return row.description;
}

export function mapProjectDetailToFormHydration(
	raw: Record<string, unknown>,
): ProjectFormHydration {
	const row = flattenProjectPayload(raw);
	const personal = nestedObject(row.personal_information);
	const projectDetails = nestedObject(row.project_details);
	const projectRowForStep2: Record<string, unknown> = {
		...row,
		...(projectDetails ?? {}),
	};

	const stepRaw =
		row.step ?? row.current_step ?? row.last_step ?? row.project_step;
	let step = typeof stepRaw === "number" ? stepRaw : Number(stepRaw);
	if (!Number.isFinite(step) || step < 1) step = 1;
	if (step > 5) step = 5;

	const values: Partial<CreateOfferFormValues> = {
		firstName: s(personal?.first_name ?? row.first_name),
		lastName: s(personal?.last_name ?? row.last_name),
		mobileNumber: s(personal?.mobile_number ?? row.mobile_number),
		personalEmail: s(
			personal?.personal_email ?? personal?.email ?? row.personal_email ?? row.email,
		),
		address: s(personal?.address ?? row.address),
		city: s(personal?.city ?? row.city),
		pincode: s(
			personal?.postal_code ?? personal?.pincode ?? row.postal_code ?? row.pincode,
		),
		country: s(personal?.country ?? row.country),
		personalCityName: s(personal?.city_name ?? row.city_name),
		projectName: s(
			projectDetails?.project_name ?? row.project_name ?? row.name,
		),
		isExpressJob: expressFromRow(projectRowForStep2),
		clientNo: s(projectDetails?.client_no ?? row.client_no),
		category: categoryIdsFromRow(projectRowForStep2),
		sameAsContact: Boolean(row.same_as_contact ?? row.sameAsContact),
		projectAddress: s(
			projectDetails?.project_address ?? row.project_address,
		),
		projectCity: s(
			projectDetails?.city ??
				row.project_contact_city ??
				row.project_city ??
				row.contact_city,
		),
		projectPostalCode: s(
			projectDetails?.postal_code ??
				row.project_contact_postal_code ??
				row.project_postal_code ??
				row.contact_postal_code,
		),
		directions: s(projectDetails?.directions ?? row.directions),
		projectCityName: s(
			projectDetails?.city_name ?? row.project_city_name,
		),
		description: descriptionFromApi(descriptionSourceFromRow(row)),
		documents: documentsFromRow(row),
		invitedSuppliers: suppliersFromRow(row),
	};

	return { values, step };
}
