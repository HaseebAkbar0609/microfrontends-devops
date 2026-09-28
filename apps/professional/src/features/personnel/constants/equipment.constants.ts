import localizationConstants from "@/utils/translation/constants";
import {
	AssetStatus,
	EmployeeEquipmentProfile,
	EquipmentCategory,
} from "../types/equipment.types";

export const EQUIPMENT_STORAGE_KEYS = {
	EMPLOYEE_PROFILES: "tfs_employee_equipment_profiles_v1",
} as const;

export const CATEGORY_LABEL_KEY_MAP: Record<EquipmentCategory, string> = {
	work_tools: localizationConstants.categoryPowerTools,
	clothes: localizationConstants.categoryClothes,
	keys_cards: localizationConstants.categoryKeysCards,
	vehicle: localizationConstants.categoryVehicle,
	safety_gear: localizationConstants.categorySafety,
	it_device: localizationConstants.categoryIT,
	power_tool: localizationConstants.categoryPowerTools,
};

export const ASSET_STATUS_STYLE_MAP: Record<
	AssetStatus,
	{ bg: string; text: string; dot: string; labelKey: string }
> = {
	active_in_use: {
		bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
		text: "text-emerald-700",
		dot: "bg-emerald-500",
		labelKey: localizationConstants.statusActiveInUse,
	},
	in_stock: {
		bg: "bg-blue-50 text-blue-700 border-blue-200/80",
		text: "text-blue-700",
		dot: "bg-blue-500",
		labelKey: localizationConstants.statusInStock,
	},
	maintenance: {
		bg: "bg-amber-50 text-amber-700 border-amber-200/80",
		text: "text-amber-700",
		dot: "bg-amber-500",
		labelKey: localizationConstants.statusMaintenance,
	},
	out_of_service: {
		bg: "bg-rose-50 text-rose-700 border-rose-200/80",
		text: "text-rose-700",
		dot: "bg-rose-500",
		labelKey: localizationConstants.statusOutOfService,
	},
};

/** Seed data matching Figma screenshot for Anna Svensson */
export const SEED_ANNA_SVENSSON_EQUIPMENT: EmployeeEquipmentProfile = {
	employeeId: "emp_anna_svensson",
	employeeName: "Anna Svensson",
	workTools: [
		{
			id: "wt_1",
			object: "Dator",
			designation: "HP Dator",
			markingId: "Dator 01",
		},
		{
			id: "wt_2",
			object: "Mobil",
			designation: "Iphone",
			markingId: "Mobil 001",
		},
		{
			id: "wt_3",
			object: "Ipad",
			designation: "Ipad",
			markingId: "Ipad 004",
		},
	],
	clothes: [
		{
			id: "cl_1",
			type: "shoes",
			label: "Skor",
			frequency: 2,
			unit: "ggr / år",
		},
		{
			id: "cl_2",
			type: "jacket",
			label: "Jacka",
			frequency: 1,
			unit: "ggr / år",
		},
		{
			id: "cl_3",
			type: "sweater",
			label: "Tröja",
			frequency: 4,
			unit: "ggr / år",
		},
		{
			id: "cl_4",
			type: "helmet",
			label: "Hjälm",
			frequency: 1,
			unit: "ggr / år",
		},
	],
	keysCards: [
		{
			id: "kc_1",
			object: "Mastercard",
			designation: "Inköp",
			markingId: "44665952",
		},
		{
			id: "kc_2",
			object: "Huvudnyckel",
			designation: "HN203434",
			markingId: "4465656",
		},
		{
			id: "kc_3",
			object: "Förrådsnyckel",
			designation: "FN34345",
			markingId: "44698",
		},
	],
	vehicles: [
		{
			id: "veh_1",
			vehicle: "Volkswagen",
			regNo: "HKH455",
			lastService: "2024-01-15",
			nextService: "2025-01-15",
			status: "active_in_use",
		},
	],
};
