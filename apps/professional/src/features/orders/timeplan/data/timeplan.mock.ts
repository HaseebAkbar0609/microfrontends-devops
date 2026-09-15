import type { OrderTimeplan } from "../types/timeplan.types";

export const MOCK_ORDER_TIMEPLANS: OrderTimeplan[] = [
	{
		id: "plan-1",
		date: "2024/01/01",
		kind: "Huvudtidsplan",
		name: "Huvudtidsplan",
		createdBy: "Kalle Svensson",
	},
	{
		id: "plan-2",
		date: "2024/01/01",
		kind: "Deltidsplan",
		name: "Deltidsplan",
		createdBy: "Sefan Eriksson",
	},
];

