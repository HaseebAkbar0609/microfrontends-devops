"use client";

import { Megaphone } from "lucide-react";
import {
	ModuleMobileNav,
	ModuleSubSidebar,
} from "@/components/layout/sidebar/ModuleSubSidebar";
import {
	MARKETING_MODULE_TITLE_KEY,
	MARKETING_SUB_NAV_ITEMS,
	isMarketingSubNavItemActive,
} from "../../constants/marketingNav";

/** Second sidebar for the marketing module, shown on every marketing page, as in Sales. */
export function MarketingSubSidebar() {
	return (
		<ModuleSubSidebar
			titleKey={MARKETING_MODULE_TITLE_KEY}
			icon={Megaphone}
			items={MARKETING_SUB_NAV_ITEMS}
			isActive={isMarketingSubNavItemActive}
		/>
	);
}

/** The same entries as a scrolling row, below the `lg` breakpoint where the sidebar is hidden. */
export function MarketingMobileNav() {
	return (
		<ModuleMobileNav
			titleKey={MARKETING_MODULE_TITLE_KEY}
			items={MARKETING_SUB_NAV_ITEMS}
			isActive={isMarketingSubNavItemActive}
		/>
	);
}
