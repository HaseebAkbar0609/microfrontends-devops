import { generateTempId } from "@/lib/tempId";
import {
	archiveOrderQuestionAction,
	createOrderQuestionAction,
	deleteOrderQuestionAction,
	getOrderQuestionsAction,
	markOrderQuestionReadAction,
	replyOrderQuestionAction,
} from "@/api-actions/orders/orderQa";
import { MOCK_ORDER_QUESTIONS } from "../data/orderQa.mock";
import type { NewOrderQuestion, OrderQuestion } from "../types";

/**
 * In-memory store for Order Q&A, synchronizing with API actions.
 *
 * Seeded from `MOCK_ORDER_QUESTIONS`. All operations update this state optimistically
 * and trigger corresponding API calls.
 */
let questions: OrderQuestion[] = MOCK_ORDER_QUESTIONS.map((question) => ({
	...question,
}));

let initialized = false;

/** Load questions from API or fallback store. */
export async function initializeOrderQuestions(orderId: string): Promise<OrderQuestion[]> {
	if (!initialized) {
		const res = await getOrderQuestionsAction(orderId);
		if (res.success && res.data && res.data.length > 0) {
			questions = res.data;
			initialized = true;
		}
	}
	return listOrderQuestions(orderId);
}

/** Newest first: ISO dates sort as text, and ties keep their stored order. */
export function listOrderQuestions(orderId: string): OrderQuestion[] {
	const matching = questions.filter(
		(question) => !orderId || question.orderId === orderId,
	);
	if (matching.length === 0 && orderId) {
		const seeded = MOCK_ORDER_QUESTIONS.map((q) => ({ ...q, orderId }));
		questions = [...questions, ...seeded];
		return seeded.sort((a, b) => b.date.localeCompare(a.date));
	}
	return matching.sort((a, b) => b.date.localeCompare(a.date));
}

function update(
	id: string,
	change: (question: OrderQuestion) => OrderQuestion,
): void {
	questions = questions.map((question) =>
		question.id === id ? change(question) : question,
	);
}

export async function createOrderQuestion(
	orderId: string,
	input: NewOrderQuestion,
): Promise<OrderQuestion> {
	const tempId = generateTempId();
	const question: OrderQuestion = {
		...input,
		id: tempId,
		orderId,
		badge: "Fråga",
		status: "new",
		archived: false,
	};
	questions = [question, ...questions];

	// API sync in background
	const apiRes = await createOrderQuestionAction(orderId, input);
	if (apiRes.success && apiRes.data?.id) {
		update(tempId, (q) => ({ ...q, id: apiRes.data?.id ?? tempId }));
	}

	return question;
}

export async function replyToOrderQuestion(
	orderId: string,
	id: string,
	answer: { author: string; text: string; date: string },
): Promise<void> {
	update(id, (question) => ({
		...question,
		status: "answered",
		answerUser: answer.author,
		answerText: answer.text,
		answerDate: answer.date,
	}));

	await replyOrderQuestionAction(orderId, id, answer);
}

/** New → Opened. Anything already opened or answered is left as it is. */
export async function markOrderQuestionAsRead(orderId: string, id: string): Promise<void> {
	update(id, (question) =>
		question.status === "new" ? { ...question, status: "opened" } : question,
	);

	await markOrderQuestionReadAction(orderId, id);
}

export async function setOrderQuestionArchived(
	orderId: string,
	id: string,
	archived: boolean,
): Promise<void> {
	update(id, (question) => ({ ...question, archived }));
	await archiveOrderQuestionAction(orderId, id, archived);
}

/** Permanent deletion. */
export async function removeOrderQuestion(orderId: string, id: string): Promise<void> {
	questions = questions.filter((question) => question.id !== id);
	await deleteOrderQuestionAction(orderId, id);
}
