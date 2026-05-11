import { getCitiesAPIAction } from "@/api-actions";

const MAX_PAGES = 80;

/**
 * Find a city's display name by paging through GET cities for a country.
 * Search-by-UUID often returns nothing; listing pages matches FormCitySelect behavior.
 */
export async function resolveCityNameById(
	countryId: string,
	cityId: string,
): Promise<string | null> {
	const id = cityId.trim();
	if (!countryId.trim() || !id) return null;

	let page = 1;
	let totalPages = 1;

	while (page <= totalPages && page <= MAX_PAGES) {
		const res = await getCitiesAPIAction({
			countryId: countryId.trim(),
			page,
			pageSize: 50,
		});
		if (!res.success || !res.data?.data) return null;
		totalPages = res.data.total_pages ?? 1;
		const hit = res.data.data.find((c) => c.id === id);
		if (hit) return hit.name;
		page += 1;
	}

	return null;
}
