"use client";

import { useContext } from "react";
import {
	SalesDocumentsContext,
	type SalesDocumentsContextValue,
} from "../context/SalesDocumentsProvider";

/** The single entry point for documents added by hand. */
export function useSalesDocuments(): SalesDocumentsContextValue {
	const context = useContext(SalesDocumentsContext);
	if (!context) {
		throw new Error(
			"useSalesDocuments must be used within a SalesDocumentsProvider",
		);
	}
	return context;
}
