import { mockDate } from "../../../constants/mockData";
import type { DrawingCategory, ProjectDocument, ProjectDocumentKind } from "../types";

interface Seed {
	id: string;
	projectId: string;
	kind: ProjectDocumentKind;
	daysAgo: number;
	name: string;
	fileName: string;
	createdBy: string;
	category?: DrawingCategory | null;
	archived?: boolean;
}

const seed = ({ daysAgo, category = null, archived = false, ...rest }: Seed): ProjectDocument => ({
	...rest,
	date: mockDate(-daysAgo),
	category,
	archived,
});

/**
 * Each project's Handlingar.
 *
 * 5001 carries the frames' rows — Rumsbeskrivning, Byggbeskrivning,
 * Färgsättning and Ljudprotokoll; A-305-20, A-306-20, K-106-20 and VS-101-20 —
 * plus a photo for the Bilder filter and icon, an E-ritning so every category
 * shows, two contracts, and one archived handling and drawing for Arkiv.
 * 5000 has a few; 5002 has none, for the empty states. The frames' "Sefan
 * Eriksson" is the "Stefan Eriksson" of the record's other mocks.
 *
 * Seeded files have no URL — there is no file store behind them — so Visa
 * explains why it cannot open them. Dates come from `mockDate`, never
 * `new Date()`.
 */
export const SEEDED_PROJECT_DOCUMENTS: ProjectDocument[] = [
	seed({ id: "doc-5001-1", projectId: "5001", kind: "handling", daysAgo: 2, name: "Rumsbeskrivning", fileName: "Rum 1-50.pdf", createdBy: "Kalle Svensson" }),
	seed({ id: "doc-5001-2", projectId: "5001", kind: "handling", daysAgo: 5, name: "Byggbeskrivning", fileName: "Konstruktion.pdf", createdBy: "Stefan Eriksson" }),
	seed({ id: "doc-5001-3", projectId: "5001", kind: "handling", daysAgo: 9, name: "Färgsättning", fileName: "Rumsbeskrivning.pdf", createdBy: "Stina Larsson" }),
	seed({ id: "doc-5001-4", projectId: "5001", kind: "handling", daysAgo: 12, name: "Ljudprotokoll", fileName: "Rumsbeskrivning.pdf", createdBy: "Stefan Eriksson" }),
	seed({ id: "doc-5001-5", projectId: "5001", kind: "handling", daysAgo: 20, name: "Fasadfoto", fileName: "Fasad norr.jpg", createdBy: "Kalle Svensson" }),
	seed({ id: "doc-5001-6", projectId: "5001", kind: "ritning", daysAgo: 3, name: "A-305-20", category: "a", fileName: "A-305-20.pdf", createdBy: "Kalle Svensson" }),
	seed({ id: "doc-5001-7", projectId: "5001", kind: "ritning", daysAgo: 6, name: "A-306-20", category: "konstruktion", fileName: "A-306-20.pdf", createdBy: "Stefan Eriksson" }),
	seed({ id: "doc-5001-8", projectId: "5001", kind: "ritning", daysAgo: 10, name: "K-106-20", category: "k", fileName: "K-106-20.pdf", createdBy: "Stina Larsson" }),
	seed({ id: "doc-5001-9", projectId: "5001", kind: "ritning", daysAgo: 14, name: "VS-101-20", category: "vvs", fileName: "VS-101-20.pdf", createdBy: "Stefan Eriksson" }),
	seed({ id: "doc-5001-10", projectId: "5001", kind: "ritning", daysAgo: 25, name: "E-201-20", category: "e", fileName: "E-201-20.png", createdBy: "Kalle Svensson" }),
	seed({ id: "doc-5001-11", projectId: "5001", kind: "kontrakt", daysAgo: 60, name: "Entreprenadkontrakt", fileName: "Kontrakt.pdf", createdBy: "Kalle Svensson" }),
	seed({ id: "doc-5001-12", projectId: "5001", kind: "kontrakt", daysAgo: 45, name: "UE-avtal Rörmokare", fileName: "UE-avtal.pdf", createdBy: "Stefan Eriksson" }),
	seed({ id: "doc-5001-13", projectId: "5001", kind: "handling", daysAgo: 80, name: "Tidplan v1", fileName: "Tidplan v1.pdf", createdBy: "Stina Larsson", archived: true }),
	seed({ id: "doc-5001-14", projectId: "5001", kind: "ritning", daysAgo: 90, name: "A-301-19", category: "a", fileName: "A-301-19.pdf", createdBy: "Kalle Svensson", archived: true }),
	seed({ id: "doc-5000-1", projectId: "5000", kind: "handling", daysAgo: 4, name: "Rumsbeskrivning", fileName: "Rumsbeskrivning.pdf", createdBy: "Stefan Eriksson" }),
	seed({ id: "doc-5000-2", projectId: "5000", kind: "handling", daysAgo: 15, name: "Materialval", fileName: "Materialval.pdf", createdBy: "Kalle Svensson" }),
	seed({ id: "doc-5000-3", projectId: "5000", kind: "ritning", daysAgo: 8, name: "A-101-20", category: "a", fileName: "A-101-20.pdf", createdBy: "Stefan Eriksson" }),
];
