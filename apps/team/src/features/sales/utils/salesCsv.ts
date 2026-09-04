import { CSV_DELIMITER } from "../constants/sales.constants";
import { isSalesCompanyStatus } from "../constants/salesStatuses";
import {
	isSalesCategoryId,
	isSalesRegionId,
} from "../constants/salesTaxonomy";
import type { SalesCompany } from "../types";

/** Columns carried by the CSV round-trip, in order. */
const CSV_FIELDS = [
	"name",
	"organisationNumber",
	"contactPerson",
	"email",
	"mobile",
	"city",
	"category",
	"region",
	"trade",
	"employees",
	"revenue",
	"startYear",
	"status",
	"accountManager",
	"seller",
	"source",
	"notes",
] as const;

type CsvField = (typeof CSV_FIELDS)[number];

const NUMERIC_FIELDS = new Set<CsvField>(["employees", "revenue"]);

function escapeCell(value: unknown): string {
	return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function companiesToCsv(companies: SalesCompany[]): string {
	const header = CSV_FIELDS.join(CSV_DELIMITER);
	const rows = companies.map((company) =>
		CSV_FIELDS.map((field) => escapeCell(company[field])).join(CSV_DELIMITER),
	);
	return [header, ...rows].join("\n");
}

/** Splits one CSV line, honouring quoted cells and escaped double quotes. */
function splitLine(line: string, delimiter: string): string[] {
	const cells: string[] = [];
	let current = "";
	let quoted = false;

	for (let index = 0; index < line.length; index += 1) {
		const character = line[index];

		if (character === '"') {
			if (quoted && line[index + 1] === '"') {
				current += '"';
				index += 1;
			} else {
				quoted = !quoted;
			}
			continue;
		}

		if (character === delimiter && !quoted) {
			cells.push(current);
			current = "";
			continue;
		}

		current += character;
	}

	cells.push(current);
	return cells.map((cell) => cell.trim());
}

/**
 * Parses an exported CSV back into partial companies. Unknown columns are
 * ignored, and category, region and status fall back to empty or `prospect`
 * when they do not match a known id.
 */
export function parseCompaniesCsv(text: string): Partial<SalesCompany>[] {
	const lines = text.split(/\r?\n/).filter((line) => line.trim());
	if (lines.length < 2) return [];

	const headerLine = lines[0].replace(/^\uFEFF/, "");
	const delimiter = headerLine.includes(CSV_DELIMITER) ? CSV_DELIMITER : ",";
	const headers = splitLine(headerLine, delimiter).map((header) =>
		header.replace(/^"|"$/g, ""),
	);

	return lines.slice(1).map((line) => {
		const cells = splitLine(line, delimiter);
		const record: Record<string, string | number> = {};

		headers.forEach((header, index) => {
			if (!(CSV_FIELDS as readonly string[]).includes(header)) return;
			const field = header as CsvField;
			const value = (cells[index] ?? "").replace(/^"|"$/g, "");

			if (NUMERIC_FIELDS.has(field)) {
				record[field] = Number(value) || 0;
				return;
			}
			if (field === "status") {
				record[field] = isSalesCompanyStatus(value) ? value : "prospect";
				return;
			}
			if (field === "category") {
				record[field] = isSalesCategoryId(value) ? value : "";
				return;
			}
			if (field === "region") {
				record[field] = isSalesRegionId(value) ? value : "";
				return;
			}
			record[field] = value;
		});

		return record as Partial<SalesCompany>;
	});
}
