import { generateTempId } from "@/lib/tempId";
import { SEEDED_PROJECT_QUESTIONS } from "../data/projectQa.mock";
import type { NewProjectQuestion, ProjectQuestion } from "../types";

/**
 * The project questions, in memory.
 *
 * There is no Fråga/Svar endpoint, so this stands in for one, as
 * `timeplanService` does for timeplans: a module-level array every read goes
 * through, with each mutator reassigning it. **Every change goes through
 * here**; nothing writes to the seed.
 *
 * Holding the list here rather than in component state is what keeps an answer
 * or an archived question in place when the reader switches to another of the
 * record's sections and back. A hard reload resets everything to the seed.
 * Nothing is persisted to browser storage (AGENTS.md rule 6).
 */
let questions: ProjectQuestion[] = SEEDED_PROJECT_QUESTIONS.map((question) => ({
	...question,
}));

/** Newest first: ISO dates sort as text, and ties keep their stored order. */
export function listQuestions(projectId: string): ProjectQuestion[] {
	return questions
		.filter((question) => question.projectId === projectId)
		.sort((a, b) => b.date.localeCompare(a.date));
}

function update(
	id: string,
	change: (question: ProjectQuestion) => ProjectQuestion,
): void {
	questions = questions.map((question) =>
		question.id === id ? change(question) : question,
	);
}

export function createQuestion(
	projectId: string,
	input: NewProjectQuestion,
): ProjectQuestion {
	const question: ProjectQuestion = {
		...input,
		id: generateTempId(),
		projectId,
		/* A new question is always the asker's; "Fråga" is the chip the frame
		   draws on a question with no other role attached. */
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
	update(id, (question) => ({
		...question,
		status: "answered",
		answerUser: answer.author,
		answerText: answer.text,
		answerDate: answer.date,
	}));
}

/** New → Opened. Anything already opened or answered is left as it is. */
export function markAsRead(id: string): void {
	update(id, (question) =>
		question.status === "new" ? { ...question, status: "opened" } : question,
	);
}

export function setArchived(id: string, archived: boolean): void {
	update(id, (question) => ({ ...question, archived }));
}

/** Permanent. Keep it behind a confirm. */
export function removeQuestion(id: string): void {
	questions = questions.filter((question) => question.id !== id);
}
