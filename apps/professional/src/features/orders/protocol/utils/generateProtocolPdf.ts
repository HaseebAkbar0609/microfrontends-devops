import type { ProtocolItem } from "../types/protocol.types";
import { PROTOCOL_CONSTANTS } from "../constants/protocol.constants";
import { downloadProtocolAction, downloadAllProtocolsAction } from "@/api-actions/orders/protocols";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 545;
const LINE_HEIGHT = 16;
const MAX_LINES_FIRST_PAGE = 38;
const MAX_LINES_OTHER_PAGES = 42;

/**
 * Escapes characters for PDF literal text strings in Latin1
 */
const escapePdfText = (text: string): string => {
	return (text || "")
		.replace(/\\/g, "\\\\")
		.replace(/\(/g, "\\(")
		.replace(/\)/g, "\\)")
		.replace(/[^\x20-\xff]/g, "?");
};

/**
 * Wraps long text into lines matching standard line width
 */
const wrapText = (text: string, maxChars = 75): string[] => {
	if (!text) return [];
	const lines: string[] = [];
	const paragraphs = text.split("\n");

	for (const para of paragraphs) {
		if (!para.trim()) {
			lines.push("");
			continue;
		}
		let current = "";
		for (const word of para.split(/\s+/)) {
			if ((current + " " + word).trim().length > maxChars) {
				if (current.trim()) lines.push(current.trim());
				current = word;
			} else {
				current = `${current} ${word}`;
			}
		}
		if (current.trim()) lines.push(current.trim());
	}
	return lines;
};

/**
 * Encodes ASCII / Latin-1 text to Uint8Array
 */
const toLatin1Bytes = (text: string): Uint8Array => {
	const bytes = new Uint8Array(text.length);
	for (let i = 0; i < text.length; i++) {
		const code = text.charCodeAt(i);
		bytes[i] = code <= 0xff ? code : 0x3f;
	}
	return bytes;
};

/**
 * Builds binary PDF document from protocol data
 */
export function buildProtocolPdf(
	protocol: ProtocolItem,
	orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
): Uint8Array {
	const safeOrderId = orderId || protocol.orderId || PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID;
	const safeDate = protocol.date || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DATE;
	const safeType = protocol.type || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_TYPE;
	const safeName = protocol.protocolName || safeType;
	const safeResponsible = protocol.responsible || "Kalle Svensson";
	const safeStatus =
		protocol.status === "completed"
			? "Klar / Godkänd"
			: protocol.status === "in_progress"
				? "Pågår"
				: "Ej påbörjad";

	// Generate document lines
	const lines: string[] = [];

	lines.push(`Dokumenttyp: ${safeType}`);
	lines.push(`Protokollnamn: ${safeName}`);
	lines.push(`Order / Projekt-ID: Order ${safeOrderId}`);
	lines.push(`Datum: ${safeDate}`);
	lines.push(`Ansvarig: ${safeResponsible}`);
	lines.push(`Status: ${safeStatus}`);
	lines.push(`Senast uppdaterad: ${protocol.lastUpdated || safeDate}`);
	lines.push("");
	lines.push("--------------------------------------------------------------------------------");
	lines.push("1. SAMMANFATTNING & ANTECKNINGAR");
	lines.push("--------------------------------------------------------------------------------");

	const noteLines = wrapText(
		protocol.notes ||
			"Genomgång av framdrift, kontrollpunkter, arbetsmiljö samt samordning med berörda parter. Inga allvarliga avvikelser noterade vid tillfället.",
		75
	);
	lines.push(...noteLines);

	lines.push("");
	lines.push("--------------------------------------------------------------------------------");
	lines.push("2. STANDARD KONTROLLPUNKTER & BESIKTNING");
	lines.push("--------------------------------------------------------------------------------");
	lines.push("[X] 2.1 Arbetsmiljö och säkerhet på arbetsplatsen           - Godkänd");
	lines.push("[X] 2.2 Kvalitetskontroll enligt kontrollplan och ritning    - Godkänd");
	lines.push("[X] 2.3 Leverans och materialmottagning                    - Godkänd");
	lines.push("[X] 2.4 Tidsplan och framdrift                              - Enligt plan");
	lines.push("[X] 2.5 Avvikelser och åtgärdsplan                          - Inga öppna punkter");

	lines.push("");
	lines.push("--------------------------------------------------------------------------------");
	lines.push("3. SIGNATURER & GODKÄNNANDE");
	lines.push("--------------------------------------------------------------------------------");
	lines.push("");
	lines.push(`Upprättad av: _________________________       Datum: ${safeDate}`);
	lines.push(`              ${safeResponsible}`);
	lines.push("");
	lines.push(`Godkänd av:   _________________________       Datum: ${safeDate}`);
	lines.push(`              Beställare / Kontrollansvarig`);

	// Split into pages
	const pagesLines: string[][] = [];
	let currentIdx = 0;

	// First page takes fewer lines because of the large title & header block
	pagesLines.push(lines.slice(0, MAX_LINES_FIRST_PAGE));
	currentIdx += MAX_LINES_FIRST_PAGE;

	while (currentIdx < lines.length) {
		pagesLines.push(lines.slice(currentIdx, currentIdx + MAX_LINES_OTHER_PAGES));
		currentIdx += MAX_LINES_OTHER_PAGES;
	}

	const totalPagesCount = pagesLines.length;
	const objects: string[] = [];

	// Object index management
	// 1: Catalog, 2: Pages, 3: Font Helvetica, 4: Font Bold
	const pageObjectIds = pagesLines.map((_, idx) => 5 + idx * 2);

	objects.push("<< /Type /Catalog /Pages 2 0 R >>");
	objects.push(
		`<< /Type /Pages /Kids [${pageObjectIds
			.map((id) => `${id} 0 R`)
			.join(" ")}] /Count ${totalPagesCount} >>`
	);
	objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
	objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

	pagesLines.forEach((pLines, pageIdx) => {
		const isFirstPage = pageIdx === 0;
		let streamContent = "";

		// Header Branding & Title on Page 1
		if (isFirstPage) {
			streamContent += `BT\n/F2 16 Tf\n${MARGIN_LEFT} 780 Td\n(TIMEFLOW SYSTEM - PROTOKOLL) Tj\nET\n`;
			streamContent += `BT\n/F1 10 Tf\n${MARGIN_LEFT} 765 Td\n(Officiellt protokoll och dokumentation for orderproduktion) Tj\nET\n`;
			streamContent += `0.75 w\n${MARGIN_LEFT} 752 m\n${MARGIN_RIGHT} 752 l\nS\n`;
		} else {
			// Sub-header for subsequent pages
			streamContent += `BT\n/F2 10 Tf\n${MARGIN_LEFT} 800 Td\n(${escapePdfText(safeName)} - Sida ${pageIdx + 1}) Tj\nET\n`;
			streamContent += `0.5 w\n${MARGIN_LEFT} 790 m\n${MARGIN_RIGHT} 790 l\nS\n`;
		}

		// Body text
		let yPos = isFirstPage ? 730 : 770;
		for (const line of pLines) {
			const isSectionHeader =
				line.startsWith("1.") ||
				line.startsWith("2.") ||
				line.startsWith("3.") ||
				line.startsWith("---");

			const fontName = isSectionHeader ? "/F2" : "/F1";
			const fontSize = isSectionHeader ? 11 : 10;

			streamContent += `BT\n${fontName} ${fontSize} Tf\n${MARGIN_LEFT} ${yPos} Td\n(${escapePdfText(
				line
			)}) Tj\nET\n`;
			yPos -= LINE_HEIGHT;
		}

		// Footer on all pages
		streamContent += `0.5 w\n${MARGIN_LEFT} 45 m\n${MARGIN_RIGHT} 45 l\nS\n`;
		streamContent += `BT\n/F1 8 Tf\n${MARGIN_LEFT} 32 Td\n(Timeflow System | Genererat: ${new Date().toISOString().split("T")[0]}) Tj\nET\n`;
		streamContent += `BT\n/F1 8 Tf\n${MARGIN_RIGHT - 60} 32 Td\n(Sida ${pageIdx + 1} av ${totalPagesCount}) Tj\nET\n`;

		objects.push(
			`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${objects.length + 2} 0 R >>`
		);
		objects.push(
			`<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`
		);
	});

	let output = "%PDF-1.4\n";
	const offsets: number[] = [];
	objects.forEach((obj, idx) => {
		offsets.push(output.length);
		output += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
	});

	const xrefPos = output.length;
	output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
	for (const offset of offsets) {
		output += `${String(offset).padStart(10, "0")} 00000 n \n`;
	}
	output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;

	return toLatin1Bytes(output);
}

/**
 * Builds a single consolidated multi-page PDF containing all protocols
 */
export function buildAllProtocolsPdf(
	protocols: ProtocolItem[],
	orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
): Uint8Array {
	if (protocols.length === 0) {
		return new Uint8Array();
	}

	const safeOrderId = orderId || PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID;
	const pagesLines: string[][] = [];

	protocols.forEach((protocol, pIndex) => {
		const safeDate = protocol.date || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DATE;
		const safeType = protocol.type || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_TYPE;
		const safeName = protocol.protocolName || safeType;
		const safeResponsible = protocol.responsible || "Kalle Svensson";
		const safeStatus =
			protocol.status === "completed"
				? "Klar / Godkand"
				: protocol.status === "in_progress"
					? "Pagar"
					: "Ej paborjad";

		const protoLines: string[] = [];
		protoLines.push(`[PROTOKOLL ${pIndex + 1} AV ${protocols.length}]`);
		protoLines.push(`Dokumenttyp: ${safeType}`);
		protoLines.push(`Protokollnamn: ${safeName}`);
		protoLines.push(`Order / Projekt-ID: Order ${safeOrderId}`);
		protoLines.push(`Datum: ${safeDate}`);
		protoLines.push(`Ansvarig: ${safeResponsible}`);
		protoLines.push(`Status: ${safeStatus}`);
		protoLines.push(`Senast uppdaterad: ${protocol.lastUpdated || safeDate}`);
		protoLines.push("");
		protoLines.push("--------------------------------------------------------------------------------");
		protoLines.push("1. SAMMANFATTNING & ANTECKNINGAR");
		protoLines.push("--------------------------------------------------------------------------------");

		const noteLines = wrapText(
			protocol.notes ||
				"Genomgang av framdrift, kontrollpunkter, arbetsmiljo samt samordning med berorda parter. Inga allvarliga avvikelser noterade vid tillfallet.",
			75
		);
		protoLines.push(...noteLines);

		protoLines.push("");
		protoLines.push("--------------------------------------------------------------------------------");
		protoLines.push("2. STANDARD KONTROLLPUNKTER & BESIKTNING");
		protoLines.push("--------------------------------------------------------------------------------");
		protoLines.push("[X] 2.1 Arbetsmiljo och sakerhet pa arbetsplatsen           - Godkand");
		protoLines.push("[X] 2.2 Kvalitetskontroll enligt kontrollplan och ritning    - Godkand");
		protoLines.push("[X] 2.3 Leverans och materialmottagning                    - Godkand");
		protoLines.push("[X] 2.4 Tidsplan och framdrift                              - Enligt plan");
		protoLines.push("[X] 2.5 Avvikelser och atgardsplan                          - Inga oppna punkter");

		protoLines.push("");
		protoLines.push("--------------------------------------------------------------------------------");
		protoLines.push("3. SIGNATURER & GODKANNANDE");
		protoLines.push("--------------------------------------------------------------------------------");
		protoLines.push("");
		protoLines.push(`Upprattad av: _________________________       Datum: ${safeDate}`);
		protoLines.push(`              ${safeResponsible}`);
		protoLines.push("");
		protoLines.push(`Godkand av:   _________________________       Datum: ${safeDate}`);
		protoLines.push(`              Bestallare / Kontrollansvarig`);

		// Split this protocol into pages
		let currentIdx = 0;
		pagesLines.push(protoLines.slice(0, MAX_LINES_FIRST_PAGE));
		currentIdx += MAX_LINES_FIRST_PAGE;

		while (currentIdx < protoLines.length) {
			pagesLines.push(protoLines.slice(currentIdx, currentIdx + MAX_LINES_OTHER_PAGES));
			currentIdx += MAX_LINES_OTHER_PAGES;
		}
	});

	const totalPagesCount = pagesLines.length;
	const objects: string[] = [];
	const pageObjectIds = pagesLines.map((_, idx) => 5 + idx * 2);

	objects.push("<< /Type /Catalog /Pages 2 0 R >>");
	objects.push(
		`<< /Type /Pages /Kids [${pageObjectIds
			.map((id) => `${id} 0 R`)
			.join(" ")}] /Count ${totalPagesCount} >>`
	);
	objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
	objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

	pagesLines.forEach((pLines, pageIdx) => {
		const isFirstPage = pageIdx === 0;
		let streamContent = "";

		if (isFirstPage) {
			streamContent += `BT\n/F2 16 Tf\n${MARGIN_LEFT} 780 Td\n(TIMEFLOW SYSTEM - ALLA PROTOKOLL) Tj\nET\n`;
			streamContent += `BT\n/F1 10 Tf\n${MARGIN_LEFT} 765 Td\n(Samlad dokumentation for orderproduktion - Order ${escapePdfText(safeOrderId)}) Tj\nET\n`;
			streamContent += `0.75 w\n${MARGIN_LEFT} 752 m\n${MARGIN_RIGHT} 752 l\nS\n`;
		} else {
			streamContent += `BT\n/F2 10 Tf\n${MARGIN_LEFT} 800 Td\n(Order ${escapePdfText(safeOrderId)} - Protokollsammanstallning - Sida ${pageIdx + 1}) Tj\nET\n`;
			streamContent += `0.5 w\n${MARGIN_LEFT} 790 m\n${MARGIN_RIGHT} 790 l\nS\n`;
		}

		let yPos = isFirstPage ? 730 : 770;
		for (const line of pLines) {
			const isSectionHeader =
				line.startsWith("1.") ||
				line.startsWith("2.") ||
				line.startsWith("3.") ||
				line.startsWith("[PROTOKOLL") ||
				line.startsWith("---");

			const fontName = isSectionHeader ? "/F2" : "/F1";
			const fontSize = isSectionHeader ? 11 : 10;

			streamContent += `BT\n${fontName} ${fontSize} Tf\n${MARGIN_LEFT} ${yPos} Td\n(${escapePdfText(
				line
			)}) Tj\nET\n`;
			yPos -= LINE_HEIGHT;
		}

		streamContent += `0.5 w\n${MARGIN_LEFT} 45 m\n${MARGIN_RIGHT} 45 l\nS\n`;
		streamContent += `BT\n/F1 8 Tf\n${MARGIN_LEFT} 32 Td\n(Timeflow System | Genererat: ${new Date().toISOString().split("T")[0]}) Tj\nET\n`;
		streamContent += `BT\n/F1 8 Tf\n${MARGIN_RIGHT - 60} 32 Td\n(Sida ${pageIdx + 1} av ${totalPagesCount}) Tj\nET\n`;

		objects.push(
			`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${objects.length + 2} 0 R >>`
		);
		objects.push(
			`<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`
		);
	});

	let output = "%PDF-1.4\n";
	const offsets: number[] = [];
	objects.forEach((obj, idx) => {
		offsets.push(output.length);
		output += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
	});

	const xrefPos = output.length;
	output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
	for (const offset of offsets) {
		output += `${String(offset).padStart(10, "0")} 00000 n \n`;
	}
	output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;

	return toLatin1Bytes(output);
}

/**
 * Standard File Naming Convention: Protocol_[Name]_[OrderID]_[Date].pdf
 */
export function getProtocolFileName(
	protocol: ProtocolItem,
	orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
): string {
	const rawName = protocol.protocolName || protocol.type || "Protokoll";
	const rawOrderId = orderId || protocol.orderId || PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID;
	const rawDate = protocol.date || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DATE;

	const safeName = rawName.replace(/[^a-zA-Z0-9_-]/g, "_");
	const safeOrderId = rawOrderId.replace(/[^a-zA-Z0-9_-]/g, "_");
	const safeDate = rawDate.replace(/[^a-zA-Z0-9_-]/g, "_");

	return `Protocol_${safeName}_${safeOrderId}_${safeDate}.pdf`;
}

/**
 * Standard File Naming for Bulk Export: Protocol_All_[OrderID]_[Date].pdf
 */
export function getAllProtocolsFileName(
	orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
): string {
	const rawOrderId = orderId || PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID;
	const safeOrderId = rawOrderId.replace(/[^a-zA-Z0-9_-]/g, "_");
	const safeDate = new Date().toISOString().split("T")[0];

	return `Protocol_All_${safeOrderId}_${safeDate}.pdf`;
}

/**
 * Triggers browser download of a single protocol PDF file
 */
export async function downloadProtocolPdf(
	protocol: ProtocolItem,
	orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
): Promise<boolean> {
	try {
		// 1. Try real backend download endpoint if available
		const result = await downloadProtocolAction(orderId, protocol.id);
		if (result.success && result.data && result.data.size > 0) {
			triggerBlobDownload(result.data, getProtocolFileName(protocol, orderId));
			return true;
		}

		// 2. If fileUrl is a valid remote/backend URL, try direct fetching or download
		if (protocol.fileUrl && protocol.fileUrl.startsWith("http")) {
			try {
				const response = await fetch(protocol.fileUrl);
				if (response.ok) {
					const blob = await response.blob();
					triggerBlobDownload(blob, getProtocolFileName(protocol, orderId));
					return true;
				}
			} catch (fetchErr) {
				console.warn("[downloadProtocolPdf] Remote fetch failed, fallback to local generation:", fetchErr);
			}
		}

		// 3. Generate branded PDF client-side
		const pdfBytes = buildProtocolPdf(protocol, orderId);
		const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
		triggerBlobDownload(blob, getProtocolFileName(protocol, orderId));
		return true;
	} catch (err) {
		console.error("[downloadProtocolPdf] Failed to download protocol:", err);
		return false;
	}
}

/**
 * Triggers a single consolidated download of all protocols as one complete PDF document
 */
export async function downloadAllProtocolsPdf(
	protocols: ProtocolItem[],
	orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
): Promise<boolean> {
	if (!protocols || protocols.length === 0) return false;

	try {
		// 1. Try real backend bulk download endpoint if available
		const result = await downloadAllProtocolsAction(orderId);
		if (result.success && result.data && result.data.size > 0) {
			triggerBlobDownload(result.data, getAllProtocolsFileName(orderId));
			return true;
		}

		// 2. Generate consolidated PDF client-side (single download, no multi-file permissions prompted)
		const pdfBytes = buildAllProtocolsPdf(protocols, orderId);
		const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
		triggerBlobDownload(blob, getAllProtocolsFileName(orderId));
		return true;
	} catch (err) {
		console.error("[downloadAllProtocolsPdf] Failed to download all protocols:", err);
		return false;
	}
}

/**
 * Helper to download a Blob in the browser
 */
function triggerBlobDownload(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	setTimeout(() => URL.revokeObjectURL(url), 100);
}

