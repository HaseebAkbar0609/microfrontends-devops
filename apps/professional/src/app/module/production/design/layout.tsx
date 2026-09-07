"use client";

import { ModuleHeader } from "@/components/layout/ModuleHeader";
import {
	DESIGN_MODULE_TABS,
	DESIGN_MODULE_TITLE,
} from "@/features/design/data/designNav.config";

export default function DesignLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<ModuleHeader
				titleKey={DESIGN_MODULE_TITLE}
				items={DESIGN_MODULE_TABS}
				autoHideOnSubRoutes={false}
			/>
			<div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
		</div>
	);
}
