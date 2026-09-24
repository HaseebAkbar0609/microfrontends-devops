import type { SalesEmailTemplate } from "../types";

/** The Calendly link the sales team books demos with. */
export const DEFAULT_CALENDLY_LINK = "https://calendly.com/timeflow-sverige/demo";

/**
 * Starting templates.
 *
 * The subject and body are content the Swedish sales team writes, not UI copy,
 * so they are literal strings here rather than translation keys. The same goes
 * for the tag names inside them.
 */
export const SALES_EMAIL_TEMPLATES_SEED: SalesEmailTemplate[] = [
	{
		id: "tpl-1",
		name: "Presentation – Timeflow för hantverksföretag",
		subject: "Timeflow – digitalt system för {företag}",
		body: [
			"Hej {kontakt},",
			"",
			"Tack för samtalet! Här kommer en kort presentation av Timeflow – ett komplett system för hantverksföretag med tidrapportering, order, kalkyl och ekonomi i samma flöde.",
			"",
			"Boka gärna en kort genomgång direkt i min kalender: {calendly}",
			"",
			"Vänliga hälsningar",
			"{säljare}",
		].join("\n"),
	},
	{
		id: "tpl-2",
		name: "Uppföljning efter samtal",
		subject: "Uppföljning – {företag}",
		body: [
			"Hej {kontakt},",
			"",
			"Jag följer upp vårt samtal kring hur {företag} kan spara tid med Timeflow.",
			"",
			"Boka en tid som passar: {calendly}",
			"",
			"Vänliga hälsningar",
			"{säljare}",
		].join("\n"),
	},
];

/** Tags the app swaps for real values when a template is used. */
export const SALES_TEMPLATE_TAGS = [
	"{företag}",
	"{kontakt}",
	"{säljare}",
	"{calendly}",
] as const;
