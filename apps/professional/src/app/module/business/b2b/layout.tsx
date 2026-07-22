"use client";

import DynamicSubSidebar from "@/components/layout/sidebar/DynamicSubSidebar";
import { b2bSidebarItems } from "@/features/b2b/constants";
import localizationConstants from "@/utils/translation/constants";

export default function B2BLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-full overflow-hidden">
			<DynamicSubSidebar
				titleKey={localizationConstants.b2b}
				items={b2bSidebarItems}
			/>
			<div className="flex-1 overflow-auto bg-white">{children}</div>
		</div>
	);
}
