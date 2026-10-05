"use client";

import type { ReactNode } from "react";
import {
	ModulePageHeader,
	type ModuleTabItem,
} from "@/components/layout/navigation";
import {
	MARKETING_BREADCRUMBS,
	MARKETING_MODULE_TITLE_KEY,
} from "../constants/marketingNav";

type MarketingModuleShellProps = {
	children: ReactNode;
	/** The registers inside the active group; absent on the overview and newsletter. */
	sectionTabs?: ModuleTabItem[];
};

/**
 * Shell for every page in the marketing module.
 *
 * The module's sub-sidebar selects the overview, a group or the newsletter;
 * the section row here selects a register inside the group. Every page keeps
 * its own route, so it is linkable and the back button works.
 */
export function MarketingModuleShell({
	children,
	sectionTabs,
}: MarketingModuleShellProps) {
	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
			<ModulePageHeader
				title={MARKETING_MODULE_TITLE_KEY}
				breadcrumbs={MARKETING_BREADCRUMBS}
				secondaryTabs={sectionTabs}
			/>
			<div className="flex flex-col gap-5 px-5 py-5">{children}</div>
		</div>
	);
}

export default MarketingModuleShell;
