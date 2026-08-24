"use client";

import { usePathname } from "next/navigation";
import { RouteTabs } from "@/components/layout/RouteTabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { calculationNavItems } from "../constants";

export function CalculationModuleHeader() {
	const pathname = usePathname();
	const activeItem = calculationNavItems.find(
		(item) => item.href === pathname,
	);

	// Deeper routes (calculation detail, create flows) render their own headers.
	if (!activeItem) return null;

	return (
		<div className="border-b border-slate-200">
			<div className="px-5 pt-4">
				<h1 className="text-2xl font-semibold tracking-tight text-slate-950">
					<Translate text={localizationConstants.calculation} />
				</h1>
			</div>
			<div className="px-5">
				<RouteTabs items={calculationNavItems} />
			</div>
		</div>
	);
}
