import type { ReactNode } from "react";
import { SalesCrmProvider } from "@/features/sales/context/SalesCrmProvider";
import { SalesDocumentsProvider } from "@/features/sales/context/SalesDocumentsProvider";
import { SalesSettingsProvider } from "@/features/sales/context/SalesSettingsProvider";
import { SalesTeamProvider } from "@/features/sales/context/SalesTeamProvider";

/**
 * Holds the sales CRM state for every page in this section so edits survive
 * navigation between the overview, company card, quote and order confirmation.
 */
export default function SalesLayout({ children }: { children: ReactNode }) {
	return (
		<SalesCrmProvider>
			<SalesTeamProvider>
				<SalesDocumentsProvider>
					<SalesSettingsProvider>{children}</SalesSettingsProvider>
				</SalesDocumentsProvider>
			</SalesTeamProvider>
		</SalesCrmProvider>
	);
}
