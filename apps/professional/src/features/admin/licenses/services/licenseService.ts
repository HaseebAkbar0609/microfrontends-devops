import {
	INITIAL_CART_ITEMS,
	LICENSE_PACKAGES,
	LicenseCartItem,
	LicensePackage,
	LicenseTabId,
} from "../constants/mockData";

export function listLicensePackages(tab: LicenseTabId): LicensePackage[] {
	return LICENSE_PACKAGES[tab];
}

export function getInitialCartItems(): LicenseCartItem[] {
	return INITIAL_CART_ITEMS;
}
