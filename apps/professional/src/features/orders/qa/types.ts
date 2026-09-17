import type { QAThreadStatus } from "@/components/common/QAThreadColumn";

export type OrderQaRole = "UE" | "Supplier" | "Beställare" | "Fråga";

export type OrderQaType = "project" | "order";

export type OrderQaFunction =
	| "construction"
	| "electrical"
	| "groundwork"
	| "painting"
	| "ventilation"
	| "plumbing";

export interface OrderQuestion {
	id: string;
	orderId?: string;
	sender: string;
	company: string;
	role?: string;
	badge: string;
	type: string;
	function?: string;
	message: string;
	date: string;
	status: QAThreadStatus;
	archived: boolean;
	answerUser?: string;
	answerText?: string;
	answerDate?: string;
}

export interface NewOrderQuestion {
	sender: string;
	company: string;
	type: string;
	function?: string;
	message: string;
	date: string;
}
