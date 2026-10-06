"use client";

import { Clock } from "lucide-react";
import {
	ModuleMobileNav,
	ModuleSubSidebar,
} from "@/components/layout/sidebar/ModuleSubSidebar";
import localizationConstants from "@/utils/translation/constants";
import {
	SALES_SUB_NAV_ITEMS,
	isSalesSubNavItemActive,
} from "../../constants/salesNav";

/** Second sidebar for the sales system, shown on every `/module/sales` page. */
export function SalesSubSidebar() {
	return (
		<ModuleSubSidebar
			titleKey={localizationConstants.salesSystemTitle}
			subtitleKey={localizationConstants.salesSystemSubtitle}
			footerKey={localizationConstants.salesSystemFooter}
			icon={Clock}
			items={SALES_SUB_NAV_ITEMS}
			isActive={isSalesSubNavItemActive}
		/>
	);
}

export function SalesMobileNav() {
	return (
		<ModuleMobileNav
			titleKey={localizationConstants.salesSystemTitle}
			items={SALES_SUB_NAV_ITEMS}
			isActive={isSalesSubNavItemActive}
		/>
	);
}
