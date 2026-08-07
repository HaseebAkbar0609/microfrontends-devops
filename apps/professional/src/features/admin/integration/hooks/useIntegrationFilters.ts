"use client";

import { useMemo, useState } from "react";
import { IntegrationOffering } from "../constants/mockData";

export type IntegrationFilter = string | null;

export function useIntegrationFilters(offerings: IntegrationOffering[]) {
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<IntegrationFilter>(null);

	const providers = useMemo(
		() => [...new Set(offerings.map((offering) => offering.provider))],
		[offerings],
	);

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		let rows = offerings;
		if (term)
			rows = rows.filter(
				(offering) =>
					offering.title.toLowerCase().includes(term) ||
					offering.provider.toLowerCase().includes(term),
			);
		if (filter !== null)
			rows = rows.filter((offering) => offering.provider === filter);
		return rows;
	}, [offerings, search, filter]);

	return { search, setSearch, filter, setFilter, providers, filtered };
}
