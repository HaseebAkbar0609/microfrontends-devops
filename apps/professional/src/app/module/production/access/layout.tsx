import { AccessRowsProvider } from "@/features/access/context/AccessRowsContext";

/** Shared by the list and the details pages, so list changes are kept while moving between them. */
export default function AccessLayout({ children }: { children: React.ReactNode }) {
	return <AccessRowsProvider>{children}</AccessRowsProvider>;
}
