import type { ReactNode } from "react";
import { MarketingProvider } from "@/features/marketing/context/MarketingProvider";

/**
 * Holds the marketing registers for every page in this module, so edits survive
 * moving between the overview, the 19 registers and the newsletter builder.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
	return <MarketingProvider>{children}</MarketingProvider>;
}
