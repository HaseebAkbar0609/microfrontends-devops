"use client";

import {
	createContext,
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import type { SalesCustomDocument } from "../types";
import { createId } from "../utils/salesFactories";

export type SalesDocumentsContextValue = {
	documents: SalesCustomDocument[];
	addDocument: (draft: Omit<SalesCustomDocument, "id">) => void;
	removeDocument: (documentId: string) => void;
};

export const SalesDocumentsContext =
	createContext<SalesDocumentsContextValue | null>(null);

/**
 * Documents added by hand. Quotes, order confirmations and invoices are not
 * stored here: they are derived from the companies that own them.
 */
export function SalesDocumentsProvider({ children }: { children: ReactNode }) {
	const [documents, setDocuments] = useState<SalesCustomDocument[]>([]);

	const addDocument = useCallback(
		(draft: Omit<SalesCustomDocument, "id">) => {
			setDocuments((previous) => [
				{ ...draft, id: createId("doc") },
				...previous,
			]);
		},
		[],
	);

	const removeDocument = useCallback((documentId: string) => {
		setDocuments((previous) =>
			previous.filter((document) => document.id !== documentId),
		);
	}, []);

	const value = useMemo<SalesDocumentsContextValue>(
		() => ({ documents, addDocument, removeDocument }),
		[documents, addDocument, removeDocument],
	);

	return (
		<SalesDocumentsContext.Provider value={value}>
			{children}
		</SalesDocumentsContext.Provider>
	);
}
