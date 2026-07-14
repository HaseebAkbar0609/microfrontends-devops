import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";

import type { ProjectTypeConfig, ProductPrice, HourlyPrice } from "../types";

export const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.tools, href: "/priceCalculator" },
	{ label: localizationConstants.priceCalculatorTabExamples },
];

export const PRICE_CALCULATOR_TABS_LIST_CLASS =
	"flex h-auto w-full flex-wrap justify-start gap-x-8 gap-y-1 rounded-none border-0 border-b border-slate-200 bg-transparent p-0 md:gap-x-10";

export const PRICE_CALCULATOR_TAB_TRIGGER_CLASS =
	"relative flex-none rounded-none border-0 bg-transparent px-0 py-2.5 text-sm shadow-none " +
	"font-normal text-slate-500 transition-colors hover:text-slate-700 " +
	"focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 " +
	"border-b-2 border-transparent -mb-px after:hidden " +
	"data-[state=active]:z-[1] data-[state=active]:bg-transparent data-[state=active]:font-semibold " +
	"data-[state=active]:text-slate-900 data-[state=active]:shadow-none " +
	"data-[state=active]:!border-b-2 data-[state=active]:!border-slate-900";

export const PROJECT_TYPES: ProjectTypeConfig[] = [
	{
		id: "new-villa",
		nameKey: localizationConstants.priceCalculatorNewVilla,
		titleKey: localizationConstants.priceCalculatorTitleNewVilla,
		subtitleKey: localizationConstants.priceCalculatorAdjustValues,
		fields: [
			{
				type: "slider",
				id: "area",
				labelKey: localizationConstants.priceCalculatorBoyta,
				subtitleKey: localizationConstants.priceCalculatorBoytaSubtitle,
				min: 50,
				max: 500,
				defaultValue: 200,
				unit: "m²",
				step: 10,
			},
			{
				type: "slider",
				id: "rooms",
				labelKey: localizationConstants.priceCalculatorRooms,
				min: 1,
				max: 20,
				defaultValue: 6,
				unit: "rum",
			},
			{
				type: "select",
				id: "standard",
				labelKey: localizationConstants.priceCalculatorStandard,
				options: [
					{ value: "normal", labelKey: localizationConstants.priceCalculatorStandardNormal },
					{ value: "high", labelKey: localizationConstants.priceCalculatorStandardHigh },
				],
				defaultValue: "normal",
			},
		],
		basePrice: 900000,
		pricePerUnit: { area: 9500, rooms: 25000, standard: 50000 },
		materialShare: 55,
	},
	{
		id: "bathroom",
		nameKey: localizationConstants.priceCalculatorNewBathroom,
		titleKey: localizationConstants.priceCalculatorTitleNewBathroom,
		subtitleKey: localizationConstants.priceCalculatorAdjustValues,
		fields: [
			{
				type: "number",
				id: "area",
				labelKey: localizationConstants.priceCalculatorStorlek,
				subtitleKey: localizationConstants.priceCalculatorStorlekSubtitle,
				min: 2,
				max: 30,
				defaultValue: 8,
				unit: "m²",
				step: 1,
			},
			{
				type: "number",
				id: "ceilingHeight",
				labelKey: localizationConstants.priceCalculatorCeilingHeight,
				subtitleKey: localizationConstants.priceCalculatorTakhojdSubtitle,
				min: 2,
				max: 5,
				defaultValue: 2.4,
				unit: "meter",
				step: 0.1,
			},
			{
				type: "select",
				id: "appliances",
				labelKey: localizationConstants.priceCalculatorAppliances,
				options: [
					{ value: "none", labelKey: localizationConstants.priceCalculatorNo },
					{ value: "washer", labelKey: localizationConstants.priceCalculatorWashingMachine },
					{ value: "washer-dryer", labelKey: localizationConstants.priceCalculatorWashingMachineDryer },
				],
				defaultValue: "none",
				selectWidth: "max-w-[320px]", // Wider for bathroom
			},
			{
				type: "select",
				id: "showerBath",
				labelKey: localizationConstants.priceCalculatorShowerBath,
				options: [
					{ value: "shower", labelKey: localizationConstants.priceCalculatorShowerBathShower },
					{ value: "bath", labelKey: localizationConstants.priceCalculatorShowerBathBath },
				],
				defaultValue: "shower",
				selectWidth: "max-w-[320px]", // Wider for bathroom
			},
			{
				type: "select",
				id: "surfaceLayer",
				labelKey: localizationConstants.priceCalculatorSurfaceLayer,
				options: [
					{ value: "ceramic-tile", labelKey: localizationConstants.priceCalculatorKakelKlinker },
					{ value: "vinyl", labelKey: localizationConstants.priceCalculatorPlastmatta },
				],
				defaultValue: "ceramic-tile",
			},
			{
				type: "select",
				id: "spotlight",
				labelKey: localizationConstants.priceCalculatorSpotlight,
				options: [
					{ value: "yes", labelKey: localizationConstants.priceCalculatorYes },
					{ value: "no", labelKey: localizationConstants.priceCalculatorNo },
				],
				defaultValue: "yes",
			},
		],
		basePrice: 90000,
		pricePerUnit: { area: 22000, ceilingHeight: 5000, appliances: 12000, showerBath: 8000, surfaceLayer: 5000, spotlight: 3000 },
		materialShare: 50,
	},
	{
		id: "kitchen",
		nameKey: localizationConstants.priceCalculatorNewKitchen,
		titleKey: localizationConstants.priceCalculatorTitleNewKitchen,
		subtitleKey: localizationConstants.priceCalculatorAdjustValues,
		fields: [
			{
				type: "number",
				id: "length",
				labelKey: localizationConstants.priceCalculatorLength,
				min: 2,
				max: 20,
				defaultValue: 10,
				unit: "meter",
				step: 0.5,
			},
			{
				type: "number",
				id: "height",
				labelKey: localizationConstants.priceCalculatorHeight,
				min: 2,
				max: 4,
				defaultValue: 2.4,
				unit: "meter",
				step: 0.1,
			},
			{
				type: "select",
				id: "standard",
				labelKey: localizationConstants.priceCalculatorStandard,
				options: [
					{ value: "normal", labelKey: localizationConstants.priceCalculatorStandardNormal },
					{ value: "high", labelKey: localizationConstants.priceCalculatorStandardHigh },
				],
				defaultValue: "normal",
			},
			{
				type: "select",
				id: "fridgeFreezer",
				labelKey: localizationConstants.priceCalculatorFridgeFreezer,
				options: [
					{ value: "combo", labelKey: localizationConstants.priceCalculatorFridgeFreezerCombo },
					{ value: "freestanding", labelKey: localizationConstants.priceCalculatorFridgeFreezerFreestanding },
				],
				defaultValue: "combo",
			},
			{
				type: "select",
				id: "dishwasher",
				labelKey: localizationConstants.priceCalculatorDishwasher,
				options: [
					{ value: "yes", labelKey: localizationConstants.priceCalculatorYes },
					{ value: "no", labelKey: localizationConstants.priceCalculatorNo },
				],
				defaultValue: "yes",
			},
			{
				type: "select",
				id: "microwave",
				labelKey: localizationConstants.priceCalculatorMicrowave,
				options: [
					{ value: "yes", labelKey: localizationConstants.priceCalculatorYes },
					{ value: "no", labelKey: localizationConstants.priceCalculatorNo },
				],
				defaultValue: "yes",
			},
			{
				type: "select",
				id: "stoveOven",
				labelKey: localizationConstants.priceCalculatorStoveOven,
				options: [
					{ value: "oven-stove", labelKey: localizationConstants.priceCalculatorOvenWithStove },
					{ value: "stove-hob", labelKey: localizationConstants.priceCalculatorStoveHob },
				],
				defaultValue: "oven-stove",
			},
			{
				type: "select",
				id: "countertop",
				labelKey: localizationConstants.priceCalculatorCountertop,
				options: [
					{ value: "laminate", labelKey: localizationConstants.priceCalculatorLaminate },
					{ value: "granite", labelKey: localizationConstants.priceCalculatorGraniteMarble },
				],
				defaultValue: "laminate",
			},
		],
		basePrice: 120000,
		pricePerUnit: { length: 13000, height: 8000, standard: 40000, fridgeFreezer: 8000, dishwasher: 5000, microwave: 3000, stoveOven: 5000, countertop: 15000 },
		materialShare: 50,
	},
	{
		id: "roof-laying",
		nameKey: localizationConstants.priceCalculatorNewRoofLaying,
		titleKey: localizationConstants.priceCalculatorTitleRoofLaying,
		subtitleKey: localizationConstants.priceCalculatorAdjustValues,
		fields: [
			{
				type: "slider",
				id: "roofArea",
				labelKey: localizationConstants.priceCalculatorRoofArea,
				min: 30,
				max: 400,
				defaultValue: 150,
				unit: "m²",
				step: 10,
			},
			{
				type: "number",
				id: "houseWidth",
				labelKey: localizationConstants.priceCalculatorHouseWidth,
				min: 4,
				max: 30,
				defaultValue: 12,
				unit: "meter",
			},
			{
				type: "number",
				id: "houseLength",
				labelKey: localizationConstants.priceCalculatorHouseLength,
				min: 4,
				max: 40,
				defaultValue: 24,
				unit: "meter",
			},
			{
				type: "number",
				id: "eavesHeight",
				labelKey: localizationConstants.priceCalculatorEavesHeight,
				min: 2,
				max: 20,
				defaultValue: 10,
				unit: "meter",
			},
			{
				type: "select",
				id: "material",
				labelKey: localizationConstants.priceCalculatorRoofMaterial,
				options: [
					{ value: "metal", labelKey: localizationConstants.priceCalculatorPlat },
					{ value: "tile", labelKey: localizationConstants.priceCalculatorTegel },
					{ value: "felt", labelKey: localizationConstants.priceCalculatorPapp },
					{ value: "sedum", labelKey: localizationConstants.priceCalculatorSedum },
				],
				defaultValue: "metal",
			},
			{
				type: "select",
				id: "chimney",
				labelKey: localizationConstants.priceCalculatorChimney,
				options: [
					{ value: "yes", labelKey: localizationConstants.priceCalculatorYes },
					{ value: "no", labelKey: localizationConstants.priceCalculatorNo },
				],
				defaultValue: "yes",
			},
		],
		basePrice: 35000,
		pricePerUnit: { roofArea: 1200, houseWidth: 5000, houseLength: 5000, eavesHeight: 3000, material: 2000, chimney: 8000 },
		materialShare: 50,
	},
	{
		id: "terrace",
		nameKey: localizationConstants.priceCalculatorNewTerrace,
		titleKey: localizationConstants.priceCalculatorTitleNewTerrace,
		subtitleKey: localizationConstants.priceCalculatorAdjustValues,
		fields: [
			{
				type: "slider",
				id: "area",
				labelKey: localizationConstants.priceCalculatorArea,
				min: 5,
				max: 100,
				defaultValue: 30,
				unit: "m²",
				step: 5,
			},
			{
				type: "select",
				id: "foundation",
				labelKey: localizationConstants.priceCalculatorFoundation,
				options: [
					{ value: "ground", labelKey: localizationConstants.priceCalculatorMark },
					{ value: "plinth", labelKey: localizationConstants.priceCalculatorPlintar },
				],
				defaultValue: "ground",
			},
			{
				type: "select",
				id: "material",
				labelKey: localizationConstants.priceCalculatorRoofMaterial,
				options: [
					{ value: "tryck-imp", labelKey: localizationConstants.priceCalculatorTryckImp },
					{ value: "composite", labelKey: localizationConstants.priceCalculatorComposite },
					{ value: "adeltra", labelKey: localizationConstants.priceCalculatorAdeltra },
				],
				defaultValue: "tryck-imp",
			},
			{
				type: "select",
				id: "railing",
				labelKey: localizationConstants.priceCalculatorRailing,
				options: [
					{ value: "none", labelKey: localizationConstants.priceCalculatorRailingNone },
					{ value: "wood", labelKey: localizationConstants.priceCalculatorRailingWood },
					{ value: "glass", labelKey: localizationConstants.priceCalculatorRailingGlass },
				],
				defaultValue: "none",
			},
		],
		basePrice: 35000,
		pricePerUnit: { area: 2400, foundation: 5000, material: 3000, railing: 8000 },
		materialShare: 62,
	},
	{
		id: "inner-wall",
		nameKey: localizationConstants.priceCalculatorNewInnerWall,
		titleKey: localizationConstants.priceCalculatorTitleNewInnerWall,
		subtitleKey: localizationConstants.priceCalculatorAdjustValues,
		fields: [
			{
				type: "number",
				id: "area",
				labelKey: localizationConstants.priceCalculatorArea,
				min: 5,
				max: 100,
				defaultValue: 20,
				unit: "m²",
				step: 5,
			},
			{
				type: "number",
				id: "height",
				labelKey: localizationConstants.priceCalculatorHeight,
				min: 2,
				max: 4,
				defaultValue: 2.4,
				unit: "meter",
				step: 0.1,
			},
			{
				type: "select",
				id: "standard",
				labelKey: localizationConstants.priceCalculatorStandard,
				options: [
					{ value: "normal", labelKey: localizationConstants.priceCalculatorStandardNormal },
					{ value: "high", labelKey: localizationConstants.priceCalculatorStandardHigh },
				],
				defaultValue: "normal",
			},
		],
		basePrice: 15000,
		pricePerUnit: { area: 1500, height: 3000, standard: 5000 },
		materialShare: 45,
	},
];

export const PRODUCT_PRICES: ProductPrice[] = [
	{
		id: "wc",
		productKey: localizationConstants.priceCalculatorProductToilet,
		categoryKey: localizationConstants.priceCalculatorCategoryBathroom,
		priceInterval: "1 500 - 6 000 kr",
		unitPrice: 1500,
	},
	{
		id: "shower-wall",
		productKey: localizationConstants.priceCalculatorProductShowerWall,
		categoryKey: localizationConstants.priceCalculatorCategoryBathroom,
		priceInterval: "2 000 - 12 000 kr",
		unitPrice: 2000,
	},
	{
		id: "window",
		productKey: localizationConstants.priceCalculatorProductWindow,
		categoryKey: localizationConstants.priceCalculatorCategoryBuild,
		priceInterval: "3 000 - 9 000 kr",
		unitPrice: 3000,
	},
	{
		id: "inner-door",
		productKey: localizationConstants.priceCalculatorProductInnerDoor,
		categoryKey: localizationConstants.priceCalculatorCategoryBuild,
		priceInterval: "1 200 - 4 000 kr",
		unitPrice: 1200,
	},
	{
		id: "fan",
		productKey: localizationConstants.priceCalculatorProductKitchenFan,
		categoryKey: localizationConstants.priceCalculatorCategoryKitchen,
		priceInterval: "1 500 - 10 000 kr",
		unitPrice: 1500,
	},
	{
		id: "tiles",
		productKey: localizationConstants.priceCalculatorProductTiles,
		categoryKey: localizationConstants.priceCalculatorCategoryBathroom,
		priceInterval: "300 - 1 500 kr/m2",
		unitPrice: 300,
	},
	{
		id: "countertop",
		productKey: localizationConstants.priceCalculatorProductCountertop,
		categoryKey: localizationConstants.priceCalculatorCategoryKitchen,
		priceInterval: "3 000 - 15 000 kr",
		unitPrice: 3000,
	},
	{
		id: "tap",
		productKey: localizationConstants.priceCalculatorProductTap,
		categoryKey: localizationConstants.priceCalculatorCategoryBathroom,
		priceInterval: "800 - 4 000 kr",
		unitPrice: 800,
	},
];

export const HOURLY_PRICES: HourlyPrice[] = [
	{
		id: "electrician",
		workTypeKey: localizationConstants.priceCalculatorWorkElectrician,
		categoryKey: localizationConstants.priceCalculatorCategoryElectrical,
		priceInterval: "700 - 900 kr/timme",
	},
	{
		id: "plumber",
		workTypeKey: localizationConstants.priceCalculatorWorkPlumber,
		categoryKey: localizationConstants.priceCalculatorCategoryPlumbing,
		priceInterval: "750 - 1 050 kr/timme",
	},
	{
		id: "carpenter",
		workTypeKey: localizationConstants.priceCalculatorWorkCarpenter,
		categoryKey: localizationConstants.priceCalculatorCategoryBuild,
		priceInterval: "600 - 850 kr/timme",
	},
	{
		id: "painter",
		workTypeKey: localizationConstants.priceCalculatorWorkPainter,
		categoryKey: localizationConstants.priceCalculatorCategoryPainting,
		priceInterval: "550 - 800 kr/timme",
	},
	{
		id: "tiler",
		workTypeKey: localizationConstants.priceCalculatorWorkTiler,
		categoryKey: localizationConstants.priceCalculatorCategoryBathroom,
		priceInterval: "650 - 950 kr/timme",
	},
	{
		id: "roofer",
		workTypeKey: localizationConstants.priceCalculatorWorkRoofer,
		categoryKey: localizationConstants.priceCalculatorCategoryRoof,
		priceInterval: "650 - 900 kr/timme",
	},
];
