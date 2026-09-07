import type { ReactNode } from "react";
import { SupportProvider } from "@/features/support/context/SupportProvider";

/**
 * Holds the support desk state for every page in this section so edits survive
 * navigation between the overview, inbox, escalations and ticket pages.
 */
export default function SupportLayout({ children }: { children: ReactNode }) {
	return <SupportProvider>{children}</SupportProvider>;
}
