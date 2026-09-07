"use client";

import { useMemo, useState } from "react";
import { useTranslate } from "@/utils/translation/translate";
import type { AgentLineFilter, SupportAgent } from "../types";

/** Line filter and keyword search for the agent roster. */
export function useAgentFilters(agents: SupportAgent[]) {
	const [lineFilter, setLineFilter] = useState<AgentLineFilter>("all");
	const [query, setQuery] = useState("");
	const t = useTranslate();

	const visibleAgents = useMemo(() => {
		const normalisedQuery = query.trim().toLowerCase();
		return agents.filter((agent) => {
			if (lineFilter !== "all" && agent.line !== lineFilter) return false;
			if (!normalisedQuery) return true;
			return [agent.name, agent.country, t(agent.roleKey)].some((field) =>
				field.toLowerCase().includes(normalisedQuery),
			);
		});
	}, [agents, lineFilter, query, t]);

	return { lineFilter, query, visibleAgents, setLineFilter, setQuery };
}
