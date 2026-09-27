import {
	createProjectItem, deleteProjectItem, listProjectItems, updateProjectItem,
} from "@/features/project/services/projectItemService";
import type { NewProjectQuestion, ProjectQuestion } from "../types";

const kind = "question" as const;

export async function listQuestions(projectId: string): Promise<ProjectQuestion[]> {
	const rows = await listProjectItems<ProjectQuestion>(projectId, kind);
	return rows.sort((a, b) => b.date.localeCompare(a.date));
}

export function createQuestion(projectId: string, input: NewProjectQuestion): Promise<ProjectQuestion> {
	return createProjectItem<ProjectQuestion>(projectId, kind, {
		...input, badge: "Fråga", status: "new", archived: false,
	});
}

export function updateQuestion(question: ProjectQuestion): Promise<ProjectQuestion> {
	return updateProjectItem<ProjectQuestion>(question.projectId, kind, question);
}

export function removeQuestion(question: ProjectQuestion): Promise<void> {
	return deleteProjectItem(question.projectId, kind, question);
}
