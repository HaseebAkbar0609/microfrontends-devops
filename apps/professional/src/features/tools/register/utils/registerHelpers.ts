export const normalizeRegisterStatus = (val?: string): "active" | "inactive" => {
	if (!val) return "active";
	const s = String(val).toLowerCase();
	if (s === "inaktiv" || s === "inactive") return "inactive";
	return "active";
};
