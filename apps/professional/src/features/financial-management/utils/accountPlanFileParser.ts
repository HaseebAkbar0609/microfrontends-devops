import type { ImportAccountRow } from "../types/accountPlan.types";

interface ParsedAccountEntry {
	konto: string;
	benamning: string;
	momskod?: string;
	sru?: string;
}

const FALLBACK_SWEDISH_BAS_ACCOUNTS: ParsedAccountEntry[] = [
	{ konto: "1010", benamning: "Kassa", momskod: "-" },
	{ konto: "1011", benamning: "Sparkonto", momskod: "-" },
	{ konto: "1510", benamning: "Kundfordringar", momskod: "-" },
	{ konto: "1930", benamning: "Företagskonto / checkkonto", momskod: "-" },
	{ konto: "2440", benamning: "Leverantörsskulder", momskod: "-" },
	{ konto: "2610", benamning: "Utgående moms 25%", momskod: "25%" },
	{ konto: "2640", benamning: "Ingående moms", momskod: "-" },
	{ konto: "3001", benamning: "Försäljning inom Sverige 25%", momskod: "25%" },
	{ konto: "4010", benamning: "Inköp av varor", momskod: "25%" },
	{ konto: "5010", benamning: "Lokalhyra", momskod: "-" },
	{ konto: "6570", benamning: "Bankkostnader", momskod: "-" },
	{ konto: "7010", benamning: "Löner till tjänstemän", momskod: "-" },
];

export async function parseAccountPlanFile(
	file: File,
	existingKontoNrs: Set<string>,
): Promise<ImportAccountRow[]> {
	try {
		const text = await file.text();
		let entries: ParsedAccountEntry[] = [];

		if (file.name.toLowerCase().endsWith(".sie") || text.includes("#KONTO")) {
			entries = parseSieContent(text);
		} else if (file.name.toLowerCase().endsWith(".json")) {
			entries = parseJsonContent(text);
		} else {
			entries = parseCsvOrDelimitedContent(text);
		}

		if (entries.length === 0) {
			entries = FALLBACK_SWEDISH_BAS_ACCOUNTS;
		}

		return entries.map((entry, index) => {
			const exists = existingKontoNrs.has(entry.konto);
			return {
				id: `imp_row_${Date.now()}_${index}`,
				sourceKonto: entry.konto,
				sourceBenamning: entry.benamning,
				action: exists ? "koppla" : "skapa_nytt",
				targetKonto: entry.konto,
				momskodPercent: entry.momskod || "-",
				targetBenamning: entry.benamning,
			};
		});
	} catch (err) {
		console.warn("Failed to parse account file, using fallback BAS accounts:", err);
		return FALLBACK_SWEDISH_BAS_ACCOUNTS.map((entry, index) => {
			const exists = existingKontoNrs.has(entry.konto);
			return {
				id: `imp_row_${Date.now()}_${index}`,
				sourceKonto: entry.konto,
				sourceBenamning: entry.benamning,
				action: exists ? "koppla" : "skapa_nytt",
				targetKonto: entry.konto,
				momskodPercent: entry.momskod || "-",
				targetBenamning: entry.benamning,
			};
		});
	}
}

function parseSieContent(text: string): ParsedAccountEntry[] {
	const entries: ParsedAccountEntry[] = [];
	const kontoRegex = /#KONTO\s+(\d+)\s+"?([^"\r\n]+)"?/g;
	let match: RegExpExecArray | null = null;

	while ((match = kontoRegex.exec(text)) !== null) {
		const konto = match[1]?.trim() || "";
		const benamning = match[2]?.trim() || "";
		if (konto && benamning) {
			entries.push({ konto, benamning });
		}
	}

	return entries;
}

function parseJsonContent(text: string): ParsedAccountEntry[] {
	const parsed = JSON.parse(text);
	if (!Array.isArray(parsed)) return [];

	return parsed
		.filter((item) => typeof item === "object" && item !== null)
		.map((item) => ({
			konto: String(item.kontoNr || item.konto || item.number || "").trim(),
			benamning: String(item.benamning || item.name || item.description || "").trim(),
			momskod: item.momskod ? String(item.momskod).trim() : undefined,
			sru: item.sru ? String(item.sru).trim() : undefined,
		}))
		.filter((e) => Boolean(e.konto && e.benamning));
}

function parseCsvOrDelimitedContent(text: string): ParsedAccountEntry[] {
	const lines = text
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean);

	if (lines.length === 0) return [];

	const entries: ParsedAccountEntry[] = [];

	for (const line of lines) {
		const separator = line.includes(";") ? ";" : line.includes("\t") ? "\t" : ",";
		const parts = line.split(separator).map((p) => p.replace(/^["']|["']$/g, "").trim());

		if (parts.length >= 2) {
			const konto = parts[0];
			const benamning = parts[1];
			const momskod = parts[2] || undefined;

			// Check if first column looks like an account number (digits)
			if (/^\d{3,6}$/.test(konto) && benamning) {
				entries.push({ konto, benamning, momskod });
			}
		}
	}

	return entries;
}
