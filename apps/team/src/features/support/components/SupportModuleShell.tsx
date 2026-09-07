"use client";

import type { ReactNode } from "react";
import { ModulePageHeader } from "@/components/layout/navigation";
import {
	SUPPORT_BREADCRUMBS,
	SUPPORT_MODULE_TABS,
	SUPPORT_MODULE_TITLE_KEY,
} from "../constants/supportNav";

/**
 * Shell shared by every page reached from the module's primary tab row: the
 * title stays constant and the tabs carry the navigation, replacing the
 * prototype's dark sidebar.
 */
export function SupportModuleShell({ children }: { children: ReactNode }) {
	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
			<ModulePageHeader
				title={SUPPORT_MODULE_TITLE_KEY}
				tabs={SUPPORT_MODULE_TABS}
				breadcrumbs={SUPPORT_BREADCRUMBS}
			/>
			<div className="flex flex-col gap-5 px-5 py-5">{children}</div>
		</div>
	);
}
