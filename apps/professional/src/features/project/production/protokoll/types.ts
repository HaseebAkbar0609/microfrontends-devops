/**
 * How a protocol came to be: written from the Standard or the Action template,
 * or an existing PDF uploaded as it is. The two templates differ in their
 * meeting form, which is not drawn yet; here they only name what was created.
 */
export type ProtocolKind = "standard" | "action" | "upload";

/** What the protocol records — the orders module's vocabulary, so both name things alike. */
export type ProtocolType = "byggmote" | "egenkontroll" | "slutbesiktning" | "kvalitetskontroll" | "skyddsrond";

/**
 * One protocol on the project record. `fileName` is the PDF the list shows; a
 * Standard or Action protocol has none until its meeting form exists. `url` is
 * the `blob:` the store minted for an upload; a seeded row has a file name but
 * no stored file, so it cannot be opened.
 */
export interface ProjectProtocol {
	id: string;
	projectId: string;
	kind: ProtocolKind;
	/** `yyyy-MM-dd` — the day the meeting or inspection took place. */
	date: string;
	type: ProtocolType;
	/** Benämning. The frame draws no column for it; search, the menus and the delete confirm use it. */
	name: string;
	fileName?: string;
	url?: string;
	/** An archived protocol leaves the list and is found under Filter → Arkiverade. */
	archived: boolean;
}

/** A protocol as the dialog hands it over. `file` only for Ladda upp. */
export interface ProjectProtocolInput {
	kind: ProtocolKind;
	date: string;
	type: ProtocolType;
	name: string;
	file?: File;
}
