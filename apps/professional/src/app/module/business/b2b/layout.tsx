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
		<div className="flex flex-1 flex-col overflow-hidden bg-slate-50 min-h-0">
			<ModuleHeader
				titleKey={localizationConstants.b2b}
				items={b2bNavItems}
			/>
			<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50 min-h-0">
				{children}
			</div>
		</div>
	);
}
