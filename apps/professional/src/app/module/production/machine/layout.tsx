"use client";

import { ModuleHeader } from "@/components/layout/ModuleHeader";
import {
	MACHINE_MODULE_TABS,
	MACHINE_MODULE_TITLE,
} from "@/features/machines/data/machineNav.config";

export default function MachineLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<ModuleHeader
				titleKey={MACHINE_MODULE_TITLE}
				items={MACHINE_MODULE_TABS}
				autoHideOnSubRoutes={false}
			/>
			<div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
		</div>
	);
}
