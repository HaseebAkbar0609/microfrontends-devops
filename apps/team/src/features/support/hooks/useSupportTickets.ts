"use client";

import { useContext } from "react";
import {
	SupportContext,
	type SupportContextValue,
} from "../context/SupportProvider";

/**
 * The single entry point components use to read or mutate support data.
 *
 * Nothing else in the feature touches the seed files, so replacing the
 * provider's source with a query hook later is a one-file change.
 */
export function useSupportTickets(): SupportContextValue {
	const context = useContext(SupportContext);
	if (!context) {
		throw new Error("useSupportTickets must be used within a SupportProvider");
	}
	return context;
}
