export type TimeplanKind = "Huvudtidsplan" | "Deltidsplan";

export interface OrderTimeplan {
	id: string;
	date: string; // YYYY/MM/DD e.g. "2024/01/01"
	kind: TimeplanKind;
	name?: string;
	createdBy: string;
}

export type TimeplanColumnKey = "date" | "kind" | "createdBy";

