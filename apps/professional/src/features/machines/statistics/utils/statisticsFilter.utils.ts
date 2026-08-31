/**
 * Shared utility for checking if a machine or vehicle status matches a given filter.
 */
export function matchesStatus(itemStatus: string, filterStatus: string): boolean {
	if (!filterStatus || filterStatus === "Alla" || filterStatus === "All") return true;

	const normItem = itemStatus.toLowerCase().trim();
	const normFilter = filterStatus.toLowerCase().trim();

	if (normFilter === "alla" || normFilter === "all") return true;

	if (normFilter === "aktiv" || normFilter === "active") {
		return normItem === "aktiv" || normItem === "active";
	}
	if (normFilter === "reparation" || normFilter === "repair") {
		return normItem === "reparation" || normItem === "repair";
	}
	if (
		normFilter === "avslutad" ||
		normFilter === "completed" ||
		normFilter === "closed"
	) {
		return (
			normItem === "avslutad" ||
			normItem === "completed" ||
			normItem === "closed"
		);
	}

	return normItem === normFilter;
}
