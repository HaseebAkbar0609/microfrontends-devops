"use client";

import type { ReactNode } from "react";
import { ModulePageHeader } from "@/components/layout/navigation";
import {
	SUPPORT_BREADCRUMBS,
	SUPPORT_MODULE_TITLE_KEY,
} from "../constants/supportNav";

/**
 * Shell shared by every page reached from the support sub-sidebar: the title
 * stays constant and the sub-sidebar carries the navigation.
 */
export function SupportModuleShell({ children }: { children: ReactNode }) {
	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
			<ModulePageHeader
				title={SUPPORT_MODULE_TITLE_KEY}
				breadcrumbs={SUPPORT_BREADCRUMBS}
			/>
			<div className="flex flex-col gap-5 px-5 py-5">{children}</div>
		</div>
	);
}
