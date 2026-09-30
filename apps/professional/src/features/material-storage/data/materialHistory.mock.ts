import { MATERIAL_TRANSACTION_PREFIXES } from "../constants/materialStorage.constants";
import type { MaterialPriceChange } from "../types/materialArticle.types";
import type { MaterialTransaction } from "../types/materialTransaction.types";
import { availableStock, formatTransactionReference } from "../utils/materialStockChanges";
import { MOCK_MATERIAL_ARTICLES, MOCK_MATERIAL_STOCK } from "./materialStorage.mock";
import { MOCK_MATERIAL_LINK_TARGETS } from "./materialWithdrawal.mock";

/**
 * A made-up stock history, so "Visa artikel" has events and prices to show
 * before anything is registered. Gipsskiva 13 mm in Huvudlager has the three
 * Figma events; every other depot stock gets a receipt, and some a withdrawal
 * or an inventory adjustment. The quantities are not meant to add up to today's stock.
 */

const USERS = ["Robert Hellgren", "Anna Lindberg", "Johan Ek", "Sara Nilsson"];
const PROJECTS = MOCK_MATERIAL_LINK_TARGETS.filter((target) => target.type === "project");
const ORDERS = MOCK_MATERIAL_LINK_TARGETS.filter((target) => target.type === "order");

type Seed =
	| { type: "receipt"; date: string; articleId: string; depotId: string; quantity: number; supplierOrderNo: string; by: string }
	| { type: "withdrawal"; date: string; articleId: string; depotId: string; quantity: number; linkType: "project" | "order"; linkId: string; workStepId: string | null; by: string }
	| { type: "adjustment"; date: string; articleId: string; depotId: string; quantity: number; reason: string; by: string };

const FIGMA_SEEDS: Seed[] = [
	{ type: "adjustment", date: "2026-08-19", articleId: "art-100245", depotId: "dep-001", quantity: -2, reason: "Inventering", by: "Johan Ek" },
	{ type: "withdrawal", date: "2026-08-21", articleId: "art-100245", depotId: "dep-001", quantity: 40, linkType: "project", linkId: "prj-2026-0147", workStepId: "ws-0147-3", by: "Robert Hellgren" },
	{ type: "receipt", date: "2026-08-22", articleId: "art-100245", depotId: "dep-001", quantity: 120, supplierOrderNo: "LEV-45821", by: "Anna Lindberg" },
];

const addDays = (date: string, days: number) => {
	const next = new Date(`${date}T00:00:00Z`);
	next.setUTCDate(next.getUTCDate() + days);
	return next.toISOString().slice(0, 10);
};

const GENERATED_SEEDS: Seed[] = MOCK_MATERIAL_STOCK.filter(
	(entry) => !(entry.articleId === "art-100245" && entry.depotId === "dep-001"),
).flatMap((entry, index): Seed[] => {
	const base = Math.max(entry.inStock, 10);
	const received = addDays("2026-06-01", (index * 7) % 75);
	const by = USERS[index % USERS.length];
	const seeds: Seed[] = [
		{
			type: "receipt",
			date: received,
			articleId: entry.articleId,
			depotId: entry.depotId,
			quantity: Math.max(Math.round(base * 0.4), 1),
			supplierOrderNo: `LEV-${44000 + index * 53}`,
			by,
		},
	];
	if (index % 2 === 0) {
		const toOrder = index % 3 === 0;
		const target = toOrder ? ORDERS[index % ORDERS.length] : PROJECTS[index % PROJECTS.length];
		seeds.push({
			type: "withdrawal",
			date: addDays(received, 3),
			articleId: entry.articleId,
			depotId: entry.depotId,
			quantity: Math.max(Math.round(base * 0.15), 1),
			linkType: toOrder ? "order" : "project",
			linkId: target.id,
			workStepId: null,
			by: USERS[(index + 1) % USERS.length],
		});
	}
	if (index % 5 === 0) {
		seeds.push({
			type: "adjustment",
			date: addDays(received, 5),
			articleId: entry.articleId,
			depotId: entry.depotId,
			quantity: index % 10 === 0 ? -1 : 2,
			reason: index % 10 === 0 ? "Skadat material" : "Inventering",
			by: USERS[(index + 2) % USERS.length],
		});
	}
	return seeds;
});

function toTransaction(seed: Seed, index: number, sequence: number): MaterialTransaction {
	const article = MOCK_MATERIAL_ARTICLES.find((candidate) => candidate.id === seed.articleId)!;
	const entry = MOCK_MATERIAL_STOCK.find(
		(candidate) => candidate.articleId === seed.articleId && candidate.depotId === seed.depotId,
	)!;
	const base = {
		id: `seed_${index + 1}`,
		reference: formatTransactionReference(MATERIAL_TRANSACTION_PREFIXES[seed.type], Number(seed.date.slice(0, 4)), sequence),
		status: "completed" as const,
		unit: article.unit,
		// Spread over the working day so events on one date keep an order.
		createdAt: `${seed.date}T${String(7 + (index % 9)).padStart(2, "0")}:${String((index * 13) % 60).padStart(2, "0")}:00.000Z`,
		createdBy: seed.by,
		depotId: seed.depotId,
		articleId: seed.articleId,
	};

	switch (seed.type) {
		case "receipt":
			return {
				...base,
				type: "receipt",
				quantity: seed.quantity,
				supplierName: article.supplierName,
				unitPrice: article.purchasePrice,
				deliveryDate: seed.date,
				supplierOrderNo: seed.supplierOrderNo,
				comment: null,
			};
		case "withdrawal":
			return {
				...base,
				type: "withdrawal",
				quantity: seed.quantity,
				linkType: seed.linkType,
				linkId: seed.linkId,
				workStepId: seed.workStepId,
				salesPrice: article.salesPrice,
				addInvoiceLine: true,
				comment: null,
				availableBefore: availableStock(entry) + seed.quantity,
			};
		case "adjustment":
			return { ...base, type: "adjustment", quantity: seed.quantity, reason: seed.reason };
	}
}

/** Numbered per type in date order (INL-2026-0001 is the oldest receipt), then newest first like the store. */
export const MOCK_MATERIAL_HISTORY: MaterialTransaction[] = (() => {
	const seeds = [...GENERATED_SEEDS, ...FIGMA_SEEDS].sort((a, b) => a.date.localeCompare(b.date));
	const counts: Record<string, number> = {};
	const transactions = seeds.map((seed, index) => {
		counts[seed.type] = (counts[seed.type] ?? 0) + 1;
		return toTransaction(seed, index, counts[seed.type]);
	});
	return transactions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
})();

const roundPrice = (value: number) => Math.round(value * 100) / 100;

/** Three price changes per article, the latest being today's prices. */
export const MOCK_MATERIAL_PRICE_HISTORY: MaterialPriceChange[] = MOCK_MATERIAL_ARTICLES.flatMap((article) => [
	{ date: "2025-03-03", purchaseFactor: 0.92, salesFactor: 0.93, changedBy: USERS[0] },
	{ date: "2025-10-01", purchaseFactor: 0.96, salesFactor: 0.97, changedBy: USERS[1] },
	{ date: "2026-04-01", purchaseFactor: 1, salesFactor: 1, changedBy: USERS[2] },
].map(({ date, purchaseFactor, salesFactor, changedBy }) => ({
	articleId: article.id,
	date,
	purchasePrice: roundPrice(article.purchasePrice * purchaseFactor),
	salesPrice: roundPrice(article.salesPrice * salesFactor),
	changedBy,
})));
