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
		<div className="flex flex-1 flex-col">
			<ModuleHeader
				titleKey={localizationConstants.agreement}
				items={agreementNavItems}
				className="[&_.font-bold]:font-semibold [&_.h-\[3px\]]:h-[2.5px]"
			/>
			<div className="flex flex-1 flex-col">
				{children}
			</div>
		</div>
	);
}
