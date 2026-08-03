import { EmploymentContract } from "../constants/mockData";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const LINE_CHARS = 90;
const LINES_PER_PAGE = 44;

const escapePdfText = (text: string) =>
	text
		.replace(/[\\()]/g, (match) => `\\${match}`)
		.replace(/[^\x20-\xff]/g, "?");

const wrapText = (text: string): string[] => {
	const lines: string[] = [];
	for (const paragraph of text.split("\n")) {
		if (!paragraph.trim()) {
			lines.push("");
			continue;
		}
		let current = "";
		for (const word of paragraph.split(/\s+/)) {
			if ((current + " " + word).trim().length > LINE_CHARS) {
				lines.push(current.trim());
				current = word;
			} else {
				current = `${current} ${word}`;
			}
		}
		if (current.trim()) lines.push(current.trim());
	}
	return lines;
};

const toLatin1Bytes = (text: string): Uint8Array => {
	const bytes = new Uint8Array(text.length);
	for (let index = 0; index < text.length; index += 1) {
		const code = text.charCodeAt(index);
		bytes[index] = code <= 0xff ? code : 0x3f;
	}
	return bytes;
};

const buildPdf = (contract: EmploymentContract): Uint8Array => {
	const header = [
		`Anställningsavtal - ${contract.employeeName}`,
		"",
		`Roll: ${contract.role}`,
		`Anställningsnummer: ${contract.employmentNumber}`,
		`Startdatum: ${contract.startDate}`,
		"",
	];
	const bodyLines = contract.documentPages.flatMap((page) => [
		...wrapText(page.text),
		"",
	]);
	const allLines = [...header, ...bodyLines];

	const pages: string[][] = [];
	for (let index = 0; index < allLines.length; index += LINES_PER_PAGE) {
		pages.push(allLines.slice(index, index + LINES_PER_PAGE));
	}

	const objects: string[] = [];
	const pageObjectIds = pages.map((_, index) => 4 + index * 2);
	objects.push("<< /Type /Catalog /Pages 2 0 R >>");
	objects.push(
		`<< /Type /Pages /Kids [${pageObjectIds
			.map((id) => `${id} 0 R`)
			.join(" ")}] /Count ${pages.length} >>`,
	);
	objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

	for (const pageLines of pages) {
		const contentParts = ["BT /F1 11 Tf 60 780 Td 15 TL"];
		for (const line of pageLines) {
			contentParts.push(`(${escapePdfText(line)}) Tj T*`);
		}
		contentParts.push("ET");
		const stream = contentParts.join("\n");
		objects.push(
			`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${objects.length + 2} 0 R >>`,
		);
		objects.push(
			`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
		);
	}

	let output = "%PDF-1.4\n";
	const offsets: number[] = [];
	objects.forEach((object, index) => {
		offsets.push(output.length);
		output += `${index + 1} 0 obj\n${object}\nendobj\n`;
	});
	const xrefPosition = output.length;
	output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
	for (const offset of offsets) {
		output += `${String(offset).padStart(10, "0")} 00000 n \n`;
	}
	output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPosition}\n%%EOF\n`;

	return toLatin1Bytes(output);
};

export function downloadContractPdf(contract: EmploymentContract): void {
	const blob = new Blob([buildPdf(contract) as BlobPart], {
		type: "application/pdf",
	});
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = `Anstallningsavtal-${contract.employmentNumber}.pdf`;
	anchor.click();
	URL.revokeObjectURL(url);
}
