"use client";

import type { ReactNode } from "react";
import {
	ModulePageHeader,
	type ModuleTabItem,
} from "@/components/layout/navigation";
import {
	MARKETING_BREADCRUMBS,
	MARKETING_MODULE_TABS,
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
 * The prototype navigated 21 destinations from a dark 256px sidebar with six
 * collapsible groups and no URL state at all. Here the primary row selects a
 * group and the secondary row selects a register inside it, so every page is
 * linkable and the back button works.
 */
export function MarketingModuleShell({
	children,
	sectionTabs,
}: MarketingModuleShellProps) {
	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
			<ModulePageHeader
				title={MARKETING_MODULE_TITLE_KEY}
				tabs={MARKETING_MODULE_TABS}
				breadcrumbs={MARKETING_BREADCRUMBS}
				secondaryTabs={sectionTabs}
			/>
			<div className="flex flex-col gap-5 px-5 py-5">{children}</div>
		</div>
	);
}

export default MarketingModuleShell;
