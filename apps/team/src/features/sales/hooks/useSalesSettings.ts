"use client";

import { useContext } from "react";
import {
	SalesSettingsContext,
	type SalesSettingsContextValue,
} from "../context/SalesSettingsProvider";

/** The single entry point for the sales module's settings. */
export function useSalesSettings(): SalesSettingsContextValue {
	const context = useContext(SalesSettingsContext);
	if (!context) {
		throw new Error(
			"useSalesSettings must be used within a SalesSettingsProvider",
		);
	}
	return context;
}
