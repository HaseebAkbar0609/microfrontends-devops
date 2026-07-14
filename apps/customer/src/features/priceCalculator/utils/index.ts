import type { ProjectTypeConfig, PriceEstimate } from "../types";

function getMultiplier(value: number | string): number {
	if (typeof value === "number") return value;

	// String values map to specific multipliers
	switch (value) {
		// Yes/No
		case "yes":
			return 1;
		case "no":
			return 0;

		// Standard
		case "high":
			return 1;
		case "normal":
			return 0;

		// Appliances (Bathroom)
		case "washer":
			return 1;
		case "washer-dryer":
			return 1.8;
		case "none":
			return 0;

		// Shower / Bath
		case "bath":
			return 1;
		case "shower":
			return 0;

		// Surface layer
		case "ceramic-tile":
			return 1;
		case "vinyl":
			return 0;

		// Fridge Freezer
		case "freestanding":
			return 1;
		case "combo":
			return 0;

		// Stove Oven
		case "stove-hob":
			return 1;
		case "oven-stove":
			return 0;

		// Countertop
		case "granite":
			return 1;
		case "laminate":
			return 0;

		// Roof material
		case "metal":
			return 1;
		case "tile":
			return 1.3;
		case "felt":
			return 0.7;
		case "sedum":
			return 1.6;

		// Foundation
		case "plinth":
			return 1;
		case "ground":
			return 0;

		// Deck material
		case "tryck-imp":
			return 1;
		case "composite":
			return 1.8;
		case "adeltra":
			return 2.5;

		// Railing
		case "wood":
			return 1;
		case "glass":
			return 2.2;

		default:
			return 0;
	}
}

export function calculatePrice(
	config: ProjectTypeConfig,
	values: Record<string, number | string>,
): PriceEstimate {
	let total = config.basePrice;

	for (const field of config.fields) {
		const pricePerUnit = config.pricePerUnit[field.id] ?? 0;
		if (pricePerUnit === 0) continue;

		const rawValue = values[field.id] ?? field.defaultValue;
		const multiplier = getMultiplier(rawValue);
		total += multiplier * pricePerUnit;
	}

	const low = Math.round(total * 0.85);
	const high = Math.round(total * 1.15);
	const material = Math.round(total * (config.materialShare / 100));
	const labor = total - material;

	return {
		low,
		high,
		material,
		labor,
		materialShare: config.materialShare,
		laborShare: 100 - config.materialShare,
	};
}

export function formatCurrency(value: number): string {
	return new Intl.NumberFormat("sv-SE", {
		maximumFractionDigits: 0,
		style: "currency",
		currency: "SEK",
	}).format(value);
}
