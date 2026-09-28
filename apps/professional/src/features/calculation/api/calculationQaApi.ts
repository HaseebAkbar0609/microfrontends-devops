import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	CalculationQuestion,
	NewCalculationQuestion,
} from "../types/calculationQa";
import { MOCK_CALCULATION_QUESTIONS } from "../constants/calculationQaMock";

// In-memory store for calculation Q&A
const localQaStore: Record<string, CalculationQuestion[]> = {};

function getFallbackQuestions(calcId: string): CalculationQuestion[] {
	if (!localQaStore[calcId]) {
		localQaStore[calcId] = MOCK_CALCULATION_QUESTIONS.map((q) => ({
			...q,
			calcId,
		}));
	}
	return localQaStore[calcId];
}

/**
 * Normalizes raw API response objects to typed CalculationQuestion domain models.
 */
export function mapCalculationQuestionFromApi(
	item: Record<string, unknown>,
	fallbackCalcId = "",
): CalculationQuestion {
	return {
		id: String(item.id ?? item._id ?? `qa_${Date.now()}`),
		calcId: String(item.calc_id ?? item.calcId ?? fallbackCalcId),
		sender: String(item.sender ?? item.author_name ?? item.authorName ?? "User"),
		company: String(item.company ?? item.company_name ?? item.companyName ?? ""),
		badge: (item.badge as CalculationQuestion["badge"]) ?? "Fråga",
		message: String(item.message ?? item.text ?? item.description ?? ""),
		date: String(item.date ?? item.created_at ?? item.createdAt ?? new Date().toISOString().split("T")[0]),
		status: (item.status as CalculationQuestion["status"]) ?? "new",
		archived: Boolean(item.archived ?? item.is_archived),
		type: (item.type as CalculationQuestion["type"]) ?? "calculation",
		function: (item.function ?? item.trade ?? item.category) as CalculationQuestion["function"],
		answerUser: item.answer_user ? String(item.answer_user) : (item.answerUser ? String(item.answerUser) : undefined),
		answerBadge: item.answer_badge ? String(item.answer_badge) : (item.answerBadge ? String(item.answerBadge) : undefined),
		answerText: item.answer_text ? String(item.answer_text) : (item.answerText ? String(item.answerText) : undefined),
		answerDate: item.answer_date ? String(item.answer_date) : (item.answerDate ? String(item.answerDate) : undefined),
		replyText: item.reply_text ? String(item.reply_text) : (item.replyText ? String(item.replyText) : undefined),
		costImpact: Boolean(item.cost_impact ?? item.costImpact),
	};
}

/**
 * Maps frontend domain question model to backend payload.
 */
export function mapCalculationQuestionToApi(
	question: Partial<CalculationQuestion> | NewCalculationQuestion,
): Record<string, unknown> {
	return {
		sender: question.sender,
		company: question.company,
		badge: question.badge,
		message: question.message,
		date: question.date,
		status: "status" in question ? question.status : "new",
		archived: "archived" in question ? question.archived : false,
		type: question.type,
		function: question.function,
		cost_impact: question.costImpact,
		answer_user: "answerUser" in question ? question.answerUser : undefined,
		answer_badge: "answerBadge" in question ? question.answerBadge : undefined,
		answer_text: "answerText" in question ? question.answerText : undefined,
		answer_date: "answerDate" in question ? question.answerDate : undefined,
	};
}

export async function getCalculationQuestionsAPIAction(
	calcId: string,
): Promise<CalculationQuestion[]> {
	try {
		const res = await axiosInstance.get(API_PATH.CALCULATIONS.QA.LIST(calcId));
		if (res.data?.data && Array.isArray(res.data.data)) {
			const mapped = res.data.data.map((item: Record<string, unknown>) =>
				mapCalculationQuestionFromApi(item, calcId),
			);
			localQaStore[calcId] = mapped;
			return mapped;
		}
	} catch {
		// Fallback cleanly to local store
	}
	return getFallbackQuestions(calcId);
}

export async function createCalculationQuestionAPIAction(
	calcId: string,
	input: NewCalculationQuestion,
): Promise<CalculationQuestion> {
	const newQuestion: CalculationQuestion = {
		id: `qa_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
		calcId,
		sender: input.sender,
		company: input.company,
		badge: input.badge ?? "Fråga",
		message: input.message,
		date: input.date,
		status: "new",
		archived: false,
		type: input.type,
		function: input.function,
		costImpact: input.costImpact,
	};

	const current = getFallbackQuestions(calcId);
	localQaStore[calcId] = [newQuestion, ...current];

	try {
		const payload = mapCalculationQuestionToApi(input);
		const res = await axiosInstance.post(
			API_PATH.CALCULATIONS.QA.CREATE(calcId),
			payload,
		);
		if (res.data?.data) {
			const mapped = mapCalculationQuestionFromApi(res.data.data, calcId);
			localQaStore[calcId] = [mapped, ...current];
			return mapped;
		}
	} catch {
		// Retain optimistic question in fallback
	}

	return newQuestion;
}

export async function updateCalculationQuestionAPIAction(
	calcId: string,
	question: CalculationQuestion,
): Promise<CalculationQuestion> {
	const current = getFallbackQuestions(calcId);
	localQaStore[calcId] = current.map((q) =>
		q.id === question.id ? question : q,
	);

	try {
		const payload = mapCalculationQuestionToApi(question);
		const res = await axiosInstance.put(
			API_PATH.CALCULATIONS.QA.UPDATE(calcId, question.id),
			payload,
		);
		if (res.data?.data) {
			const mapped = mapCalculationQuestionFromApi(res.data.data, calcId);
			localQaStore[calcId] = current.map((q) =>
				q.id === question.id ? mapped : q,
			);
			return mapped;
		}
	} catch {
		// Retain optimistic update in fallback
	}

	return question;
}

export async function deleteCalculationQuestionAPIAction(
	calcId: string,
	questionId: string,
): Promise<void> {
	const current = getFallbackQuestions(calcId);
	localQaStore[calcId] = current.filter((q) => q.id !== questionId);

	try {
		await axiosInstance.delete(
			API_PATH.CALCULATIONS.QA.DELETE(calcId, questionId),
		);
	} catch {
		// Retain deletion in fallback
	}
}
