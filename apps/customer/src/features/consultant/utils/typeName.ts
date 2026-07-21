import localizationConstants from "@/utils/translation/constants";

const NAME_TO_KEY: Record<string, string> = {
	architect: localizationConstants.ctTypeArchitectName,
	"inspection man": localizationConstants.ctTypeInspectionName,
	"hvac consultant": localizationConstants.ctTypeHvacName,
	"electrical consultant": localizationConstants.ctTypeElectricalName,
	"fire consultant": localizationConstants.ctTypeFireName,
	"site development": localizationConstants.ctTypeSiteDevName,
	"interior architect": localizationConstants.ctTypeInteriorName,
	"geotechnical engineer": localizationConstants.ctTypeGeotechName,
	surveying: localizationConstants.ctTypeSurveyingName,
	"building permit": localizationConstants.ctTypePermitName,
};

export function consultantTypeNameKey(name: string): string {
	return NAME_TO_KEY[name.trim().toLowerCase()] ?? name;
}
