import {
	DESIGN_PROJECT_ROWS,
	DesignProjectItem,
} from "../data/designProjects.mock";

let projects: DesignProjectItem[] = [...DESIGN_PROJECT_ROWS];

export function listDesignProjects(): DesignProjectItem[] {
	return projects;
}

export function archiveDesignProject(id: string): DesignProjectItem[] {
	projects = projects.filter((project) => project.id !== id);
	return projects;
}

export function removeDesignProject(id: string): DesignProjectItem[] {
	projects = projects.filter((project) => project.id !== id);
	return projects;
}
