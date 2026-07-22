"use client";

import DynamicSubSidebar from "@/components/layout/sidebar/DynamicSubSidebar";
import {
	calculationGoToItems,
	calculationSidebarItems,
} from "@/features/calculation/constants";
import localizationConstants from "@/utils/translation/constants";

export default function CalculationLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-full overflow-hidden">
			<DynamicSubSidebar
				titleKey={localizationConstants.calculation}
				items={calculationSidebarItems}
				additionalSection={{
					titleKey: localizationConstants.goTo,
					items: calculationGoToItems,
				}}
			/>
			<div className="flex-1 overflow-auto bg-white">{children}</div>
		</div>
	);
}
