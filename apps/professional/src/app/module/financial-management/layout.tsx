"use client";

import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { financialNavItems } from "@/features/financial-management/constants";
import localizationConstants from "@/utils/translation/constants";

export default function FinancialManagementLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<ModuleHeader
				titleKey={localizationConstants.financialManagement}
				items={financialNavItems}
				autoHideOnSubRoutes={false}
			/>
			<div className="flex flex-1 flex-col overflow-y-auto">
				{children}
			</div>
		</div>
	);
}
