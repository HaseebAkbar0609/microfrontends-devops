"use client";

import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { b2bNavItems } from "@/features/b2b/constants";
import localizationConstants from "@/utils/translation/constants";

export default function B2BLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<ModuleHeader
				titleKey={localizationConstants.b2b}
				items={b2bNavItems}
			/>
			<div className="flex flex-1 flex-col overflow-y-auto">
				{children}
			</div>
		</div>
	);
}
