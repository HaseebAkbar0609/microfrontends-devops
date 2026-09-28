import type { QAThreadStatus } from "@/components/common/QAThreadColumn";

/** Typ in "Ny fråga": whether the question concerns the project or an order. */
export type ProjectQaType = "project" | "order";

/** Funktion in "Ny fråga": the trade the question is for. */
export type ProjectQaFunction =
	| "construction"
	| "electrical"
	| "groundwork"
	| "painting"
	| "ventilation"
	| "plumbing";

/**
 * The role chip beside the sender. Stored as the value the card draws, which is
 * what the shared card's colours and label map are keyed by.
 */
export type ProjectQaRole = "UE" | "Beställare" | "Fråga" | "Supplier";

/** One question on a project's Fråga/Svar board. */
export interface ProjectQuestion {
	id: string;
	projectId: string;
	version?: number;
	sender: string;
	company: string;
	badge: ProjectQaRole;
	message: string;
	/** `yyyy-MM-dd`, formatted for display by `formatQaDate`. */
	date: string;
	status: QAThreadStatus;
	/** Archived questions show under Arkiv instead of Alla. */
	archived: boolean;
	type: ProjectQaType;
	/** Optional in "Ny fråga", so a question need not name a trade. */
	function?: ProjectQaFunction;
	answerUser?: string;
	answerText?: string;
	/** `yyyy-MM-dd`. */
	answerDate?: string;
}

/** A new question as the board hands it to the store. */
export interface NewProjectQuestion {
	sender: string;
	company: string;
	type: ProjectQaType;
	function?: ProjectQaFunction;
	message: string;
	/** `yyyy-MM-dd`. */
	date: string;
}
