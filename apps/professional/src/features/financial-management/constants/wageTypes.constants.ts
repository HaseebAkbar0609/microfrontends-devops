import localizationConstants from "@/utils/translation/constants";
import type {
	WageTypePersonalType,
	WageTypeWageForm,
	WageTypeTransactionType,
	WageTypeUnit,
} from "../types/wageTypes.types";

export const WAGE_TYPES_BASE_ROUTE = "/module/financial-management/economy/wage-types";
export const WAGE_TYPES_CREATE_ROUTE = `${WAGE_TYPES_BASE_ROUTE}/create`;
export const WAGE_TYPES_STORAGE_KEY = "tfs_wage_types_data";
export const WAGE_TYPES_DEFAULT_PAGE_SIZE = 10;

export const PERSONAL_TYPE_OPTIONS: Array<{
	value: WageTypePersonalType;
	labelKey: string;
}> = [
	{ value: "tjansteman", labelKey: localizationConstants.personalTypeTjanstemanLabel },
	{ value: "arbetare", labelKey: localizationConstants.personalTypeArbetareLabel },
	{ value: "deltid", labelKey: localizationConstants.personalTypeDeltidLabel },
	{ value: "vikarie", labelKey: localizationConstants.personalTypeVikarieLabel },
	{ value: "projektanstalld", labelKey: localizationConstants.personalTypeProjektanstalldLabel },
];

export const WAGE_FORM_OPTIONS: Array<{
	value: WageTypeWageForm;
	labelKey: string;
}> = [
	{ value: "timlon", labelKey: localizationConstants.wageFormTimLonLabel },
	{ value: "fastlon", labelKey: localizationConstants.wageFormFastLonLabel },
];

export const TRANSACTION_TYPE_OPTIONS: Array<{
	value: WageTypeTransactionType;
	labelKey: string;
}> = [
	{ value: "bruttolon", labelKey: localizationConstants.transactionTypeBruttolonLabel },
	{ value: "oblon", labelKey: localizationConstants.transactionTypeObLonLabel },
	{ value: "sjuklon", labelKey: localizationConstants.transactionTypeSjuklonLabel },
	{ value: "overtid", labelKey: localizationConstants.transactionTypeOvertidLabel },
	{ value: "semester", labelKey: localizationConstants.transactionTypeSemesterLabel },
	{ value: "nettolon", labelKey: localizationConstants.transactionTypeNettolonLabel },
];

export const UNIT_OPTIONS: Array<{
	value: WageTypeUnit;
	labelKey: string;
	displayShort: string;
}> = [
	{ value: "manad", labelKey: localizationConstants.unitManadLabel, displayShort: "mån" },
	{ value: "tim", labelKey: localizationConstants.unitTimLabel, displayShort: "tim" },
	{ value: "dag", labelKey: localizationConstants.unitDagLabel, displayShort: "dag" },
	{ value: "belopp", labelKey: localizationConstants.unitBeloppLabel, displayShort: "kr" },
	{ value: "percent", labelKey: localizationConstants.unitPercentLabel, displayShort: "%" },
];

export const TAX_OPTIONS = [
	{ value: "Ja 30%", labelKey: localizationConstants.taxJa30Label },
	{ value: "Ja 35%", labelKey: localizationConstants.taxJa35Label },
	{ value: "Ja (tabellskatt)", labelKey: localizationConstants.wageTypeTaxTabell },
	{ value: "Nej 0%", labelKey: localizationConstants.wageTypeTaxNej0 },
];

export const EMPLOYER_CONTRIBUTION_OPTIONS = [
	{ value: "Ja 31.42%", labelKey: localizationConstants.wageTypeTaxJa3142 },
	{ value: "Ja 30%", labelKey: localizationConstants.contrJa30Label },
	{ value: "Ja 35%", labelKey: localizationConstants.contrJa35Label },
	{ value: "Nej 0%", labelKey: localizationConstants.contrNej0Label },
];
