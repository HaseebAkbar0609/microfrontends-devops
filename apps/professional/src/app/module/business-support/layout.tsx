"use client";

import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { businessSupportNavItems } from "@/features/business-support/constants";
import localizationConstants from "@/utils/translation/constants";

export default function BusinessSupportLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col overflow-y-auto">
			<ModuleHeader
				titleKey={localizationConstants.businessSupport}
				items={businessSupportNavItems}
				autoHideOnSubRoutes={false}
			/>
			<div className="flex flex-1 flex-col">
				{children}
			</div>
		</div>
	);
}
