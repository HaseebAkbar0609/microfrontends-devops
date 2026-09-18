"use client";

import { useContext, useMemo } from "react";
import {
	SalesTeamContext,
	type SalesTeamContextValue,
} from "../context/SalesTeamProvider";

/** The single entry point for reading or changing the sales organisation. */
export function useSalesTeam(): SalesTeamContextValue {
	const context = useContext(SalesTeamContext);
	if (!context) {
		throw new Error("useSalesTeam must be used within a SalesTeamProvider");
	}
	return context;
}

/** Names of the members who currently hold the meeting booker role. */
export function useMeetingBookerNames(): string[] {
	const { members } = useSalesTeam();
	return useMemo(
		() =>
			members
				.filter((member) => member.role === "meeting-booker")
				.map((member) => member.name),
		[members],
	);
}
