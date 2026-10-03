export interface PersonalDocumentMetadata {
	employeeHandbook: string;
	policy: string;
	jobDescription: string;
}

export interface PersonalDocumentFileItem {
	id: string;
	date: string;
	name: string;
	fileFormat: string;
	fileSize?: string;
}

export interface PersonalDocumentsState {
	metadata: PersonalDocumentMetadata;
	documents: PersonalDocumentFileItem[];
}
