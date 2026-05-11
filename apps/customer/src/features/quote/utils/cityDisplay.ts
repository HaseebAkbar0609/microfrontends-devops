/** Rough UUID v4 check — city fields from API are stored as ids */
const CITY_ID_UUID_RE =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function looksLikeCityUuid(v: string | undefined): boolean {
	if (!v?.trim()) return false;
	return CITY_ID_UUID_RE.test(v.trim());
}
