"use client";

import { Headset } from "lucide-react";
import {
	ModuleMobileNav,
	ModuleSubSidebar,
	type ModuleSubNavItem,
} from "@/components/layout/sidebar/ModuleSubSidebar";
import localizationConstants from "@/utils/translation/constants";
import {
	SUPPORT_SUB_NAV_ITEMS,
	getActiveSupportNavId,
} from "../../constants/supportNav";

/** The most specific href wins, so ticket pages light the overview. */
const isActive = (item: ModuleSubNavItem, pathname: string) =>
	item.id === getActiveSupportNavId(pathname);

/** Second sidebar for the support desk, shown on every `/support` page. */
export function SupportSubSidebar() {
	return (
		<ModuleSubSidebar
			titleKey={localizationConstants.support}
			icon={Headset}
			items={SUPPORT_SUB_NAV_ITEMS}
			isActive={isActive}
		/>
	);
}

export function SupportMobileNav() {
	return (
		<ModuleMobileNav
			titleKey={localizationConstants.support}
			items={SUPPORT_SUB_NAV_ITEMS}
			isActive={isActive}
		/>
	);
}
