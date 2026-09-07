"use client";

import { ModuleHeader } from "@/components/layout/ModuleHeader";
import {
	ECONOMY_MODULE_TABS,
	ECONOMY_MODULE_TITLE,
} from "@/features/financial-management/constants/economyNav.config";

export default function FinancialManagementLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<ModuleHeader
				titleKey={ECONOMY_MODULE_TITLE}
				items={ECONOMY_MODULE_TABS}
				autoHideOnSubRoutes={false}
			/>
			<div className="flex flex-1 flex-col overflow-y-auto min-h-0">
				{children}
			</div>
		</div>
	);
}

