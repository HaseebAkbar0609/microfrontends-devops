/** Which of the two document tables an uploaded file belongs to. */
export type MachineDocumentKind = "specification" | "economy";

export interface MachineDocumentItem {
	id: string;
	/** "Datum" — upload date, displayed as yyyy-mm-dd. */
	date: string;
	/** "Dokument namn" — file name as uploaded. */
	name: string;
	/** "Fil" — file type shown in the table and on the row icon. */
	fileType: "pdf" | "doc" | "png" | "jpg";
	kind: MachineDocumentKind;
}

/** A file the user picked but has not filed into a table yet. */
export interface PendingMachineFile {
	id: string;
	name: string;
}

export interface NewMachineFormData {
	/** Auto-assigned, shown read-only in the form. */
	machineNo: string;
	name: string;
	factory: string;
	designation: string;
	category: string;
	purchaseDate: string;
	internalRent: string;
	unit: string;
	location: string;
	instruction: string;
}
