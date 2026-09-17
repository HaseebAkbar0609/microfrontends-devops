import localizationConstants from "@/utils/translation/constants";
import type { TranslationKeys } from "@/utils/translation/constants";
import type { CaseCategory } from "../../../types/cases.types";

export function getCategoryLabelKey(category: CaseCategory): TranslationKeys {
	switch (category) {
		case "info":
			return localizationConstants.casesCategoryInfo;
		case "billing":
			return localizationConstants.casesCategoryBilling;
		case "support":
			return localizationConstants.casesCategorySupport;
		case "technical":
			return localizationConstants.casesCategoryTechnical;
		case "administrative":
			return localizationConstants.casesCategoryAdministrative;
		case "other":
		default:
			return localizationConstants.casesCategoryOther;
	}
}
