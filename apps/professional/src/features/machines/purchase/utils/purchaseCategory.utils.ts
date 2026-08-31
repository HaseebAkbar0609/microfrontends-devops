/**
 * Domain utility for mapping machine type to normalized purchase categories.
 */
export function mapMachineTypeToCategory(type: string): string {
	const typeLower = (type || "").toLowerCase().trim();
	if (typeLower.includes("hand") || typeLower.includes("skruvdragare")) {
		return "handmaskin";
	}
	if (typeLower.includes("tung") || typeLower.includes("grävmaskin")) {
		return "tunga_maskiner";
	}
	if (
		typeLower.includes("fordon") ||
		typeLower.includes("bil") ||
		typeLower.includes("lastbil")
	) {
		return "fordon";
	}
	return "ovrigt";
}
