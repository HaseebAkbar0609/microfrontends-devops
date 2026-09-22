/**
 * How a protocol came to be: a Standard meeting written in the app, an Action
 * protocol (its meeting form is not drawn yet), or an existing file uploaded as
 * it is.
 */
export type ProtocolKind = "standard" | "action" | "upload";

/** What the protocol records — the orders module's vocabulary, so both name things alike. */
export type ProtocolType = "byggmote" | "egenkontroll" | "slutbesiktning" | "kvalitetskontroll" | "skyddsrond";

/** What a meeting concerns — Kategori in Nytt möte and on the protocol. */
export type MeetingCategory = "bygg" | "ekonomi" | "elVvs" | "installation" | "markAnlaggning" | "maleri";

/**
 * The fields a meeting and its follow-up share. People are stored by name, as
 * Dagbok stores them; dates are `yyyy-MM-dd` and times `HH:mm`.
 */
export interface MeetingPlan {
	/** Ansvarig in Nytt möte and Nästa möte, Värd on the protocol. */
	host: string;
	/** Rubrik. */
	title: string;
	address: string;
	postalCode: string;
	city: string;
	/** Plats — a room or a site, as "Kontoret". */
	location: string;
	participants: string[];
	startDate: string;
	startTime: string;
	endDate: string;
	endTime: string;
	/** "Ange information för det här nya mötet…" — Information on the protocol. */
	information: string;
}

/** The meeting a Standard protocol records. */
export interface MeetingDetails extends MeetingPlan {
	type: ProtocolType;
	category: MeetingCategory;
	/** Protokoll nr — "5001-01", assigned when the meeting is created. */
	number: string;
	/** Ämne. Set on the edit page. */
	subject: string;
	/** Kommentar. Set on the edit page. */
	comment: string;
}

/** Nästa möte. Every field may stay empty; the edit page fills it. */
export interface NextMeeting extends MeetingPlan {
	category: MeetingCategory | null;
}

/** One item on the agenda. A Standard point carries no status — that is the Action protocol's. */
export interface MeetingPoint {
	id: string;
	/** "001" — prefilled with the next number, editable. */
	nr: string;
	/** Ansvarig, by name; may be empty. */
	responsible: string;
	/** Rubrik — the Ämne column's bold line. */
	title: string;
	description: string;
	/** Beslut. */
	decision: string;
}

export interface ProtocolMeeting {
	details: MeetingDetails;
	next: NextMeeting;
	points: MeetingPoint[];
}

/**
 * What "Nytt protokoll" (Ladda upp) records beside the file: the meeting's
 * fields without Ansvarig, and its Typ. It has no Kategori, Protokoll nr or
 * points — the frame draws none.
 */
export type UploadDetails = Omit<MeetingPlan, "host"> & { type: ProtocolType };

/**
 * One protocol on the project record. `fileName` is the file the list's PDF
 * column shows; `url` is the `blob:` the store minted for an upload — a seeded
 * row has a file name but no stored file, so it cannot be opened. A Standard
 * protocol carries its `meeting`, an uploaded one its `upload` details; the
 * store keeps `date`, `type` and `name` in step with their start day, Typ and
 * Rubrik, so the list reads every kind alike.
 */
export interface ProjectProtocol {
	id: string;
	projectId: string;
	kind: ProtocolKind;
	/** `yyyy-MM-dd` — the day the meeting or inspection took place. */
	date: string;
	type: ProtocolType;
	/** Benämning — a meeting's or an upload's Rubrik. The frame draws no column for it; search, the menus and the delete confirm use it. */
	name: string;
	fileName?: string;
	url?: string;
	/** An archived protocol leaves the list and is found under Filter → Arkiverade. */
	archived: boolean;
	/** A Standard protocol's meeting. */
	meeting?: ProtocolMeeting;
	/** An uploaded protocol's details. A seeded upload may have none. */
	upload?: UploadDetails;
	/** `yyyy-MM-dd` — the last time Skicka sent it. */
	sentAt?: string;
}

/** A protocol known to carry a meeting — every Standard protocol does. */
export type MeetingProtocol = ProjectProtocol & { meeting: ProtocolMeeting };

/** What Nytt möte hands over. The store assigns Protokoll nr; Ämne and Kommentar wait for the edit page. */
export type NewMeetingInput = Omit<MeetingDetails, "number" | "subject" | "comment">;

/** An Action protocol as the short dialog hands it over. */
export interface ProjectProtocolInput {
	date: string;
	type: ProtocolType;
	name: string;
}
