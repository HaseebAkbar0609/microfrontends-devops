import type { ForecastProtocol } from "../types/forecastProtocols.types";

/**
 * The protocols the register starts with.
 *
 * None carries a `url`: a seed has no file behind it, which is the state the
 * row menu's reason text and the details dialog's note are written for. The
 * dates are meeting dates, so they run earlier than the module's other
 * registers, whose rows are dated the day they were filed.
 */
export const INITIAL_PROTOCOLS: ForecastProtocol[] = [
	{ id: "fprot-0101", date: "2025-09-01", type: "byggmote", fileName: "Byggmote_12.pdf" },
	{ id: "fprot-0102", date: "2025-08-14", type: "egenkontroll", fileName: "Egenkontroll_etapp2.pdf" },
	{ id: "fprot-0103", date: "2025-07-29", type: "kvalitetskontroll", fileName: "Kvalitetskontroll_fasad.pdf" },
	{ id: "fprot-0104", date: "2025-06-17", type: "skyddsrond", fileName: "Skyddsrond_juni.pdf" },
	{ id: "fprot-0105", date: "2025-05-05", type: "slutbesiktning", fileName: "Slutbesiktning_husA.pdf" },
	{ id: "fprot-0106", date: "2025-04-22", type: "byggmote", fileName: "Byggmote_11.pdf" },
];
