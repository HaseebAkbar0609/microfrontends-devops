"use client";

import { useContext } from "react";
import { ContentContext } from "../context/ContentProvider";
import type { ContentContextValue } from "../types";

/**
 * The single entry point components use to read or mutate content.
 *
 * Nothing else in the feature touches the seed files, so replacing the
 * provider's source with a query hook later is a one-file change.
 */
export function useContentSections(): ContentContextValue {
	const context = useContext(ContentContext);
	if (!context) {
		throw new Error("useContentSections must be used within a ContentProvider");
	}
	return context;
}
