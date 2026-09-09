import {
	MARKETING_CSV_DELIMITER,
	MARKETING_MAILTO_MAX_LENGTH,
} from "../constants/marketing.constants";
import type { NewsletterRecipient } from "../types";

export function joinAddresses(recipients: NewsletterRecipient[]): string {
	return recipients.map((recipient) => recipient.email).join("; ");
}

/**
 * Semicolon-delimited and BOM-prefixed so Excel opens it as UTF-8 in a Swedish
 * locale. Values containing the delimiter or a quote are quoted — the prototype
 * concatenated raw, so a company name with a semicolon shifted every column.
 */
export function buildRecipientCsv(
	headers: string[],
	recipients: NewsletterRecipient[],
	statusLabel: (status: string) => string,
	audienceLabel: (audience: NewsletterRecipient["audience"]) => string,
): string {
	const escape = (value: string) =>
		/["\n\r]|;/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

	const lines = [headers.map(escape).join(MARKETING_CSV_DELIMITER)];
	for (const recipient of recipients) {
		lines.push(
			[
				recipient.name,
				recipient.email,
				statusLabel(recipient.status),
				audienceLabel(recipient.audience),
			]
				.map(escape)
				.join(MARKETING_CSV_DELIMITER),
		);
	}
	return `﻿${lines.join("\r\n")}`;
}

/**
 * Hands the file to the browser.
 *
 * The anchor is attached to the document and the object URL is revoked on the
 * next tick; the prototype clicked a detached node and revoked immediately,
 * which races the download in Firefox and Safari.
 */
export function downloadCsv(fileName: string, contents: string): void {
	const url = URL.createObjectURL(
		new Blob([contents], { type: "text/csv;charset=utf-8" }),
	);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = fileName;
	anchor.style.display = "none";
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export type MailtoResult = { href: string } | { tooLong: true };

/**
 * Builds the prefilled mail draft, or reports that the audience is too large.
 * Browsers silently ignore an over-long `mailto:`, so the caller falls back to
 * copying the addresses instead of appearing to do nothing.
 */
export function buildMailtoHref(
	recipients: NewsletterRecipient[],
	subject: string,
	body: string,
): MailtoResult {
	const bcc = recipients.map((recipient) => recipient.email).join(",");
	const href = `mailto:?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent(
		subject,
	)}&body=${encodeURIComponent(body)}`;
	return href.length > MARKETING_MAILTO_MAX_LENGTH ? { tooLong: true } : { href };
}
