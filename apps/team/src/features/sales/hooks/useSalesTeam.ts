"use client";

import { useContext } from "react";
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
