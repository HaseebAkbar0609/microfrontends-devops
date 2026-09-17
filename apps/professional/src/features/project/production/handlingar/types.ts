/** Which tab a file lives on while it is active. Stored as a code, so its label follows the reader's language. */
export type ProjectDocumentKind = "handling" | "ritning" | "kontrakt";

/** A drawing's discipline: A-, K-, VVS-, E-ritning or Konstruktion. */
export type DrawingCategory = "a" | "k" | "vvs" | "e" | "konstruktion";

export interface ProjectDocument {
	id: string;
	projectId: string;
	kind: ProjectDocumentKind;
	/** `yyyy-MM-dd`, the day it was uploaded. */
	date: string;
	/** Benämning; for a drawing, its Ritningsnummer. */
	name: string;
	/** Set on drawings only. */
	category: DrawingCategory | null;
	fileName: string;
	/** A `blob:` URL the store minted for a file uploaded this session. Seeds have none. */
	url?: string;
	createdBy: string;
	archived: boolean;
}

/**
 * An upload as the dialog hands it over. It never carries a URL — the store
 * mints those, so nothing typed into a form can become one.
 */
export interface ProjectDocumentInput {
	kind: ProjectDocumentKind;
	name: string;
	category: DrawingCategory | null;
	file: File;
}
