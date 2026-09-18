import { mockDate } from "../../../constants/mockData";
import type { WarrantyCommitment } from "../types";

/**
 * Each project's warranty commitments.
 *
 * 5001 carries the frame's three rows — the two-, five- and ten-year
 * follow-ups after handover. 5000 has one; 5002 has none, for the empty state.
 * The frame's own dates (2028-01-01, 2030-05-31, 2035-01-01) are placeholder
 * copy; these count years from `mockDate`, which is deterministic — never
 * `new Date()` in a mock.
 */
const YEAR = 365;

export const SEEDED_WARRANTY_COMMITMENTS: WarrantyCommitment[] = [
	{ id: "warranty-5001-1", projectId: "5001", date: mockDate(2 * YEAR), name: "Garantibesiktning 1" },
	{ id: "warranty-5001-2", projectId: "5001", date: mockDate(5 * YEAR), name: "Garantibesiktning 2" },
	{ id: "warranty-5001-3", projectId: "5001", date: mockDate(10 * YEAR), name: "Garantibesiktning 3" },
	{ id: "warranty-5000-1", projectId: "5000", date: mockDate(2 * YEAR), name: "Garantibesiktning 1" },
];
