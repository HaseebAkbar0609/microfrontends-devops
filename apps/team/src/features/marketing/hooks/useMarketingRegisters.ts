"use client";

import { useContext } from "react";
import { MarketingContext } from "../context/MarketingProvider";
import type { MarketingContextValue } from "../types";

/**
 * The single entry point components use to read or mutate register rows.
 *
 * Nothing else in the feature touches the seed file, so pointing the provider
 * at a query hook later is a one-file change.
 */
export function useMarketingRegisters(): MarketingContextValue {
	const context = useContext(MarketingContext);
	if (!context) {
		throw new Error(
			"useMarketingRegisters must be used within a MarketingProvider",
		);
	}
	return context;
}
