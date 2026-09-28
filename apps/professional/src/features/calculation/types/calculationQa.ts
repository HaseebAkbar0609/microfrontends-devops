import type { QAThreadStatus } from "@/components/common/QAThreadColumn";

/** Typ in "Ny fråga": whether the question concerns a project, an order, or calculation. */
export type CalculationQaType = "project" | "order" | "calculation";

/** Funktion in "Ny fråga": the trade/category the question is for. */
export type CalculationQaFunction =
	| "construction"
	| "electrical"
	| "groundwork"
	| "painting"
	| "ventilation"
	| "plumbing";

/**
 * The role chip beside the sender.
 */
export type CalculationQaRole = "UE" | "Beställare" | "Fråga" | "Supplier";

/** One question on a Calculation's Fråga/Svar board. */
export interface CalculationQuestion {
	id: string;
	calcId: string;
	version?: number;
	sender: string;
	company: string;
	badge: CalculationQaRole;
	message: string;
	/** `yyyy-MM-dd`, formatted for display by `formatQaDate`. */
	date: string;
	status: QAThreadStatus;
	/** Archived questions show under Arkiv instead of Alla. */
	archived: boolean;
	type: CalculationQaType;
	/** Optional trade in "Ny fråga". */
	function?: CalculationQaFunction;
	answerUser?: string;
	answerBadge?: string;
	answerText?: string;
	/** `yyyy-MM-dd`. */
	answerDate?: string;
	replyText?: string;
	costImpact?: boolean;
}

/** A new question draft as handed to the store/API. */
export interface NewCalculationQuestion {
	sender: string;
	company: string;
	type: CalculationQaType;
	function?: CalculationQaFunction;
	message: string;
	/** `yyyy-MM-dd`. */
	date: string;
	badge?: CalculationQaRole;
	costImpact?: boolean;
}
