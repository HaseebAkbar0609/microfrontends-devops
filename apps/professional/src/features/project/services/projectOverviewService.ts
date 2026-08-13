import {
	PROJECT_LIST_ROWS,
	ProjectListItem,
} from "../data/projectsOverview.mock";

let projects: ProjectListItem[] = [...PROJECT_LIST_ROWS];

export function listProjects(): ProjectListItem[] {
	return projects;
}

export function archiveProject(id: string): ProjectListItem[] {
	projects = projects.filter((project) => project.id !== id);
	return projects;
}

export function removeProject(id: string): ProjectListItem[] {
	projects = projects.filter((project) => project.id !== id);
	return projects;
}
