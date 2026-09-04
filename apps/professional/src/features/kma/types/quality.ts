export type QualityDocStatus = "published" | "draft";
export type QualityFileType = "pdf" | "doc";

export interface QualityDocument {
	id: string;
	title: string;
	fileType: QualityFileType;
	updatedText: string;
	starred: boolean;
	status: QualityDocStatus;
	categoryFrom: string;
	subCategoryFrom: string;
	templateType: string;
	tags: string[];
	owner: string;
	linkedModules: string[];
	created: string;
	lastUpdated: string;
	recentActivity: string;
	description?: string;
	isTemplate?: boolean;
}

export interface QualitySubCategory {
	id: string;
	label: string;
	documents: QualityDocument[];
}

export interface QualityMainCategory {
	id: string;
	label: string;
	subcategories: QualitySubCategory[];
}
