import { AccessHoldersProvider } from "@/features/access/context/AccessHoldersContext";
import { AccessRowsProvider } from "@/features/access/context/AccessRowsContext";

/** Shared by the list and the record pages, so changes are kept while moving between them. */
export default function AccessLayout({ children }: { children: React.ReactNode }) {
	return (
		<AccessRowsProvider>
			<AccessHoldersProvider>{children}</AccessHoldersProvider>
		</AccessRowsProvider>
	);
}
