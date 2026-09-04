"use client";

import { useContext } from "react";
import {
	SalesCrmContext,
	type SalesCrmContextValue,
} from "../context/SalesCrmProvider";

/**
 * The single entry point components use to read or mutate sales companies.
 *
 * Nothing else in the feature touches the seed data, so replacing the provider's
 * source with a query hook later is a one-file change.
 */
export function useSalesCompanies(): SalesCrmContextValue {
	const context = useContext(SalesCrmContext);
	if (!context) {
		throw new Error("useSalesCompanies must be used within a SalesCrmProvider");
	}
	return context;
}
