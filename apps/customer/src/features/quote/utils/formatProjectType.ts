/**
 * Maps API `project_type` (e.g. b2c, b2b, express) to table labels.
 */
export function formatProjectTypeLabel(raw: unknown): string {
	const t = String(raw ?? "").toLowerCase().trim();
	if (t === "express") return "Express";
	if (t === "b2b") return "B2B";
	if (t === "b2c") return "B2C";
	if (t) return t.toUpperCase();
	return "-";
}
