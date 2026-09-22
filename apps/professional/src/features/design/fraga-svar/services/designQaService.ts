import { generateTempId } from "@/lib/tempId";
import type {
	NewProjectQuestion,
	ProjectQuestion,
} from "@/features/project/production/fraga-svar/types";
import { SEEDED_DESIGN_QUESTIONS } from "../data/designQa.mock";

/**
 * Design projekt questions, in memory.
 *
 * Mirrors `projectQaService` — a module-level array every read goes through,
 * with each mutator reassigning it. A hard reload resets to the seed.
 * Nothing is persisted to browser storage (AGENTS.md rule 6).
 */
let questions: ProjectQuestion[] = SEEDED_DESIGN_QUESTIONS.map((q) => ({ ...q }));

/** Newest first. */
export function listQuestions(projektId: string): ProjectQuestion[] {
	return questions
		.filter((q) => q.projectId === projektId)
		.sort((a, b) => b.date.localeCompare(a.date));
}

function update(
	id: string,
	change: (q: ProjectQuestion) => ProjectQuestion,
): void {
	questions = questions.map((q) => (q.id === id ? change(q) : q));
}

export function createQuestion(
	projektId: string,
	input: NewProjectQuestion,
): ProjectQuestion {
	const question: ProjectQuestion = {
		...input,
		id: generateTempId(),
		projectId: projektId,
		badge: "Fråga",
		status: "new",
		archived: false,
	};
	questions = [question, ...questions];
	return question;
}

export function replyTo(
	id: string,
	answer: { author: string; text: string; date: string },
): void {
	update(id, (q) => ({
		...q,
		status: "answered",
		answerUser: answer.author,
		answerText: answer.text,
		answerDate: answer.date,
	}));
}

/** New → Opened. */
export function markAsRead(id: string): void {
	update(id, (q) => (q.status === "new" ? { ...q, status: "opened" } : q));
}

export function setArchived(id: string, archived: boolean): void {
	update(id, (q) => ({ ...q, archived }));
}

/** Permanent. Keep it behind a confirm. */
export function removeQuestion(id: string): void {
	questions = questions.filter((q) => q.id !== id);
}
