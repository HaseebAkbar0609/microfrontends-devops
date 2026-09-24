import axiosInstance from "@/lib/axiosInstance";
import {
	LicenseCategoryId,
	LicensePackage,
	LicenseTabId,
	LicenseVersionOption,
} from "../constants/licenseCatalog.constants";

interface ApiLicenseCatalogOption {
	id: string;
	label: string;
	price_label: string | null;
	price: number | null;
	default_checked: boolean;
	purchasable: boolean;
}

interface ApiLicenseCatalogPackage {
	id: string;
	name: string;
	price_label: string | null;
	price: number | null;
	description: string | null;
	modules_description: string | null;
	version_text: string | null;
	version_options: ApiLicenseCatalogOption[] | null;
	version_checklist: ApiLicenseCatalogOption[] | null;
	connected_systems: string | null;
	industry_options: string[] | null;
	industry_text: string | null;
	category_id: string | null;
	action: "upgrade" | "add";
	purchasable: boolean;
}

interface ApiLicenseCatalogTab {
	tab_id: string;
	heading: string | null;
	packages: ApiLicenseCatalogPackage[];
}

export interface ApiLicenseCatalogResponse {
	tabs: ApiLicenseCatalogTab[];
}

export const getLicenseCatalog = async () => {
	const res = await axiosInstance.get("/professionals/admin/licenses/catalog");
	return res.data as { data: ApiLicenseCatalogResponse };
};

const adaptOption = (option: ApiLicenseCatalogOption): LicenseVersionOption => ({
	id: option.id,
	label: option.label,
	priceLabel: option.price_label ?? "",
	price: option.price,
	defaultChecked: option.default_checked,
});

const adaptPackage = (pkg: ApiLicenseCatalogPackage): LicensePackage => ({
	id: pkg.id,
	name: pkg.name,
	priceLabel: pkg.price_label,
	price: pkg.price,
	feeKey: pkg.description ?? "",
	modulesKey: pkg.modules_description ?? undefined,
	versionText: pkg.version_text ?? undefined,
	versionOptions: pkg.version_options?.map(adaptOption),
	versionChecklist: pkg.version_checklist?.map(adaptOption),
	connectedSystems: pkg.connected_systems ?? undefined,
	industryOptionKeys: pkg.industry_options ?? undefined,
	industryText: pkg.industry_text ?? undefined,
	categoryId: (pkg.category_id as LicenseCategoryId | null) ?? undefined,
	action: pkg.action,
});

/** Maps the backend catalog response into the tab -> packages shape the UI renders. */
export const adaptLicenseCatalog = (
	response: ApiLicenseCatalogResponse,
): Partial<Record<LicenseTabId, LicensePackage[]>> => {
	const byTab: Partial<Record<LicenseTabId, LicensePackage[]>> = {};
	for (const tab of response.tabs) {
		byTab[tab.tab_id as LicenseTabId] = tab.packages.map(adaptPackage);
	}
	return byTab;
};
