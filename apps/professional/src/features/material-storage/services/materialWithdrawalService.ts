import type {
	MaterialLinkTarget,
	MaterialTransactionStatus,
	MaterialWithdrawalTransaction,
	MaterialWorkStep,
	WithdrawalTargetType,
	WithdrawMaterialInput,
} from "../types/materialTransaction.types";
import { applyWithdrawal, availableStock } from "../utils/materialStockChanges";
import { WITHDRAWAL_LINK_RULES } from "../utils/materialWithdrawal";
import { materialMockStore as store, respondWith } from "./materialMockStore";

function availableNow({ articleId, depotId }: WithdrawMaterialInput): number {
	const entry = store
		.stockEntries()
		.find((candidate) => candidate.articleId === articleId && candidate.depotId === depotId);
	return entry ? availableStock(entry) : 0;
}

function recordWithdrawal(input: WithdrawMaterialInput, status: MaterialTransactionStatus): MaterialWithdrawalTransaction {
	const transaction: MaterialWithdrawalTransaction = {
		...input,
		...store.newTransaction("withdrawal", input, status),
		availableBefore: availableNow(input),
	};
	store.addTransaction(transaction);
	return transaction;
}

/**
 * "Ta ut material" (TFS-1074): take material out of a depot, linked to an
 * order, project or invoice or as internal use, or keep it as a draft. Only
 * the link is recorded; the Project and Invoice modules are not written to.
 */
export const materialWithdrawalService = {
	withdraw(input: WithdrawMaterialInput): Promise<MaterialWithdrawalTransaction> {
		return respondWith(() => {
			if (input.quantity === null || input.quantity <= 0) throw new Error("A withdrawal needs a quantity");
			if (WITHDRAWAL_LINK_RULES[input.linkType].hasTarget && !input.linkId)
				throw new Error("A withdrawal needs something to link to");
			// Worked out first: it throws when the depot does not have enough available.
			const nextStock = applyWithdrawal(store.stockEntries(), input.articleId, input.depotId, input.quantity);
			const transaction = recordWithdrawal(input, "completed");
			store.setStockEntries(nextStock);
			return transaction;
		});
	},

	/** Saves the withdrawal without touching stock. */
	saveDraft(input: WithdrawMaterialInput): Promise<MaterialWithdrawalTransaction> {
		return respondWith(() => recordWithdrawal(input, "draft"));
	},

	/** The orders, projects or invoices a withdrawal can be linked to. */
	getLinkTargets(type: WithdrawalTargetType): Promise<MaterialLinkTarget[]> {
		return respondWith(() =>
			store
				.linkTargets()
				.filter((target) => target.type === type)
				.map((target) => ({ ...target })),
		);
	},

	getWorkSteps(projectId: string): Promise<MaterialWorkStep[]> {
		return respondWith(() =>
			store
				.workSteps()
				.filter((step) => step.projectId === projectId)
				.map((step) => ({ ...step })),
		);
	},
};
