import { ModuleHeader } from "@/components/layout/ModuleHeader";
import localizationConstants from "@/utils/translation/constants";
import { calculationNavItems } from "../constants";

export function CalculationModuleHeader() {
	return (
		<ModuleHeader
			titleKey={localizationConstants.calculation}
			items={calculationNavItems}
		/>
	);
}
