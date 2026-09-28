import localizationConstants from "@/utils/translation/constants";
import {
	AssetStatus,
	CompanyAssetItem,
	EmployeeEquipmentProfile,
	EquipmentCategory,
} from "../types/equipment.types";

export const EQUIPMENT_STORAGE_KEYS = {
	EMPLOYEE_PROFILES: "tfs_employee_equipment_profiles_v1",
	COMPANY_ASSETS: "tfs_company_assets_v1",
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

/** Seed data matching Figma screenshot 1:1 for Anna Svensson */
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

export const SEED_COMPANY_ASSETS: CompanyAssetItem[] = [
	{
		id: "ast_1",
		name: "Volkswagen Caddy Maxi",
		category: "vehicle",
		idNumber: "HKH455",
		assignedEmployeeId: "emp_anna_svensson",
		assignedEmployeeName: "Anna Svensson",
		assignedEmployeeAvatar: null,
		status: "active_in_use",
		lastInspectionDate: "2024-01-15",
		nextInspectionDate: "2025-01-15",
		department: "Montering",
		notes: "Servicebok uppdaterad vid auktoriserad verkstad.",
		history: [
			{
				id: "log_1",
				date: "2024-01-15",
				type: "service",
				description: "Årlig fordonsservice och oljebyte genomförd.",
				performedBy: "Mekonomen Stockholm",
			},
			{
				id: "log_2",
				date: "2023-08-01",
				type: "assignment",
				description: "Fordon tilldelat till Anna Svensson.",
				performedBy: "Driftchef",
			},
		],
	},
	{
		id: "ast_2",
		name: "HP EliteBook 850 G8 (Dator 01)",
		category: "it_device",
		idNumber: "Dator 01",
		assignedEmployeeId: "emp_anna_svensson",
		assignedEmployeeName: "Anna Svensson",
		assignedEmployeeAvatar: null,
		status: "active_in_use",
		lastInspectionDate: "2023-09-10",
		nextInspectionDate: "2025-09-10",
		department: "Administration",
		notes: "IT-säkerhetsgranskad och krypterad SSD.",
		history: [
			{
				id: "log_3",
				date: "2023-09-10",
				type: "assignment",
				description: "Hårdvara registrerad och utkvitterad till Anna Svensson.",
				performedBy: "IT Support",
			},
		],
	},
	{
		id: "ast_3",
		name: "Ford Transit Custom",
		category: "vehicle",
		idNumber: "MLB892",
		assignedEmployeeId: "emp_erik_lindqvist",
		assignedEmployeeName: "Erik Lindqvist",
		assignedEmployeeAvatar: null,
		status: "active_in_use",
		lastInspectionDate: "2023-11-20",
		nextInspectionDate: "2024-11-20",
		department: "Fältarbete",
		notes: "Utrustad med inredning för verktyg.",
		history: [
			{
				id: "log_4",
				date: "2023-11-20",
				type: "inspection",
				description: "Kontrollbesiktning godkänd utan anmärkning.",
				performedBy: "Bilprovningen",
			},
		],
	},
	{
		id: "ast_4",
		name: "Hilti Kombihammare TE 70-ATC",
		category: "power_tool",
		idNumber: "HLT-70-044",
		assignedEmployeeId: "emp_erik_lindqvist",
		assignedEmployeeName: "Erik Lindqvist",
		assignedEmployeeAvatar: null,
		status: "active_in_use",
		lastInspectionDate: "2024-02-01",
		nextInspectionDate: "2025-02-01",
		department: "Produktion",
		notes: "Periodisk elsäkerhetskontroll utförd.",
		history: [
			{
				id: "log_5",
				date: "2024-02-01",
				type: "inspection",
				description: "Elsäkerhets- och funktionskontroll utförd.",
				performedBy: "KMA Ansvarig",
			},
		],
	},
	{
		id: "ast_5",
		name: "Hilti Borrhammare TE 30",
		category: "power_tool",
		idNumber: "HLT-30-019",
		assignedEmployeeId: null,
		assignedEmployeeName: null,
		assignedEmployeeAvatar: null,
		status: "in_stock",
		lastInspectionDate: "2023-10-05",
		nextInspectionDate: "2024-10-05",
		department: "Lager",
		notes: "Nyservad och redo för utlåning.",
		history: [
			{
				id: "log_6",
				date: "2023-10-05",
				type: "service",
				description: "Rengöring och byte av chuck.",
				performedBy: "Verkstad",
			},
		],
	},
	{
		id: "ast_6",
		name: "Fordonssläp Brenderup 3-vägs",
		category: "vehicle",
		idNumber: "SLP-902",
		assignedEmployeeId: null,
		assignedEmployeeName: null,
		assignedEmployeeAvatar: null,
		status: "maintenance",
		lastInspectionDate: "2023-05-12",
		nextInspectionDate: "2024-05-12",
		department: "Logistik",
		notes: "Inväntar bromsreparation.",
		history: [
			{
				id: "log_7",
				date: "2024-03-01",
				type: "status_change",
				description: "Status satt till Underhåll på grund av slitna bromsbackar.",
				performedBy: "Verkstadschef",
			},
		],
	},
	{
		id: "ast_7",
		name: "Fallskyddsutrustning Petzl Pro",
		category: "safety_gear",
		idNumber: "FSK-8812",
		assignedEmployeeId: "emp_anna_svensson",
		assignedEmployeeName: "Anna Svensson",
		assignedEmployeeAvatar: null,
		status: "active_in_use",
		lastInspectionDate: "2023-12-01",
		nextInspectionDate: "2024-12-01",
		department: "Montering",
		notes: "Årlig besiktning genomförd av behörig kontrollant.",
		history: [
			{
				id: "log_8",
				date: "2023-12-01",
				type: "inspection",
				description: "Årlig obligatorisk fallskyddsbesiktning godkänd.",
				performedBy: "Säkerhetsbesiktning AB",
			},
		],
	},
];
