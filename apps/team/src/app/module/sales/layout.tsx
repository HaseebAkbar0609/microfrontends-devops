import type { ReactNode } from "react";
import { SalesCrmProvider } from "@/features/sales/context/SalesCrmProvider";

/**
 * Holds the sales CRM state for every page in this section so edits survive
 * navigation between the overview, company card, quote and order confirmation.
 */
export default function SalesLayout({ children }: { children: ReactNode }) {
	return <SalesCrmProvider>{children}</SalesCrmProvider>;
}
