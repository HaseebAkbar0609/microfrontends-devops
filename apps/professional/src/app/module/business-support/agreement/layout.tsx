"use client";

import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { agreementNavItems } from "@/features/business-support/constants";
import localizationConstants from "@/utils/translation/constants";

export default function AgreementLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<ModuleHeader
				titleKey={localizationConstants.agreement}
				items={agreementNavItems}
			/>
			<div className="flex flex-1 flex-col overflow-y-auto">
				{children}
			</div>
		</div>
	);
}
