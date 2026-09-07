import localizationConstants from "@/utils/translation/constants";
import type { TranslationKeys } from "@/utils/translation/constants";
import type { SupportChannel, SupportTicket } from "../types";

/**
 * Seed tickets until the API lands. Only `useSupportTickets` reads this file.
 *
 * Every timestamp is a literal ISO string on purpose: deriving them from
 * `Date.now()` would render a different value on the server than in the browser
 * and hydrate mismatched markup. Subjects, customer names and descriptions are
 * record content, not UI copy — the action log is localized through keys.
 */

/** The opening log entry names the channel the ticket arrived on. */
const CREATED_KEY_BY_CHANNEL: Record<SupportChannel, TranslationKeys> = {
	phone: localizationConstants.supportActionCreatedViaPhone,
	email: localizationConstants.supportActionCreatedViaEmail,
	chat: localizationConstants.supportActionCreatedViaChat,
};

type TicketSeed = Omit<SupportTicket, "actions">;

const TICKET_SEEDS: TicketSeed[] = [
	{
		id: "TF-2481",
		subject: "Kan inte logga in i appen efter uppdatering",
		customer: "Anna Larsson",
		customerType: "private",
		channel: "phone",
		priority: "high",
		status: "new",
		line: "first",
		country: "Sverige",
		assigneeId: null,
		createdAt: "2026-09-03T08:12:00.000Z",
		slaMinutesLeft: 42,
		craftsmanId: null,
		description:
			"Kunden uppger att inloggningen fastnar på laddningsskärmen efter senaste appuppdateringen.",
	},
	{
		id: "TF-2480",
		subject: "Glömt lösenord till hantverkarportalen",
		customer: "Anders Holm Bygg AB",
		customerType: "craftsman",
		channel: "email",
		priority: "medium",
		status: "inProgress",
		line: "first",
		country: "Sverige",
		assigneeId: "a2",
		createdAt: "2026-09-03T07:55:00.000Z",
		slaMinutesLeft: 118,
		craftsmanId: "h1",
		description:
			"Återställningsmejlet kommer inte fram. Kontrollera att adressen är verifierad i portalen.",
	},
	{
		id: "TF-2479",
		subject: "Fakturan visar fel moms på ROT-avdrag",
		customer: "Nordvik El & VVS",
		customerType: "craftsman",
		channel: "chat",
		priority: "critical",
		status: "escalated",
		line: "second",
		country: "Norge",
		assigneeId: "a6",
		createdAt: "2026-09-03T07:31:00.000Z",
		slaMinutesLeft: -14,
		craftsmanId: "h2",
		description:
			"Momsen beräknas på hela beloppet i stället för på arbetskostnaden. Berör flera fakturor i augusti.",
	},
	{
		id: "TF-2478",
		subject: "Tidrapport synkas inte mot lönesystemet",
		customer: "Byggkraft i Väst",
		customerType: "craftsman",
		channel: "email",
		priority: "high",
		status: "inProgress",
		line: "second",
		country: "Sverige",
		assigneeId: "a7",
		createdAt: "2026-09-03T06:48:00.000Z",
		slaMinutesLeft: 63,
		craftsmanId: "h4",
		description:
			"Exporten körs utan fel men posterna saknas i lönesystemet för vecka 35.",
	},
	{
		id: "TF-2477",
		subject: "Vill ändra faktureringsadress",
		customer: "Lena Persson",
		customerType: "private",
		channel: "phone",
		priority: "low",
		status: "waiting",
		line: "first",
		country: "Danmark",
		assigneeId: "a5",
		createdAt: "2026-09-02T16:20:00.000Z",
		slaMinutesLeft: 240,
		craftsmanId: null,
		description:
			"Väntar på att kunden bekräftar den nya adressen skriftligt innan ändringen görs.",
	},
	{
		id: "TF-2476",
		subject: "Push-notiser kommer dubbelt",
		customer: "Kim Rasmussen",
		customerType: "private",
		channel: "chat",
		priority: "medium",
		status: "new",
		line: "first",
		country: "Danmark",
		assigneeId: null,
		createdAt: "2026-09-02T15:02:00.000Z",
		slaMinutesLeft: 95,
		craftsmanId: null,
		description:
			"Varje notis levereras två gånger. Kunden har både appen och webbklienten inloggad.",
	},
	{
		id: "TF-2475",
		subject: "Integration mot Fortnox ger felkod 502",
		customer: "Virtanen Rakennus Oy",
		customerType: "craftsman",
		channel: "email",
		priority: "critical",
		status: "escalated",
		line: "second",
		country: "Finland",
		assigneeId: "a6",
		createdAt: "2026-09-02T13:44:00.000Z",
		slaMinutesLeft: 25,
		craftsmanId: "h5",
		description:
			"Alla anrop mot bokföringsintegrationen svarar 502 sedan i går kväll. Inga fakturor går igenom.",
	},
	{
		id: "TF-2474",
		subject: "Frågor om uppsägning av abonnemang",
		customer: "Erik Sundström",
		customerType: "private",
		channel: "phone",
		priority: "low",
		status: "resolved",
		line: "first",
		country: "Sverige",
		assigneeId: "a1",
		createdAt: "2026-09-02T11:10:00.000Z",
		slaMinutesLeft: 0,
		craftsmanId: null,
		description:
			"Kunden fick uppsägningstiden förklarad och valde att behålla abonnemanget.",
	},
	{
		id: "TF-2473",
		subject: "Kan inte ladda upp bilder på arbetsorder",
		customer: "Hansen Snekkeri",
		customerType: "craftsman",
		channel: "chat",
		priority: "high",
		status: "inProgress",
		line: "first",
		country: "Norge",
		assigneeId: "a3",
		createdAt: "2026-09-02T09:26:00.000Z",
		slaMinutesLeft: 71,
		craftsmanId: "h6",
		description:
			"Uppladdningen avbryts vid filer över 5 MB. Reproducerat på både iOS och Android.",
	},
	{
		id: "TF-2472",
		subject: "Önskar utbildning för nya medarbetare",
		customer: "Ek & Söner Måleri",
		customerType: "craftsman",
		channel: "email",
		priority: "low",
		status: "waiting",
		line: "first",
		country: "Sverige",
		assigneeId: "a2",
		createdAt: "2026-09-01T14:05:00.000Z",
		slaMinutesLeft: 480,
		craftsmanId: "h3",
		description:
			"Tre nya medarbetare behöver en genomgång av tidrapportering. Väntar på förslag på datum.",
	},
	{
		id: "TF-2471",
		subject: "Appen kraschar vid start på Android 15",
		customer: "Sara Nilsson",
		customerType: "private",
		channel: "chat",
		priority: "high",
		status: "escalated",
		line: "second",
		country: "Sverige",
		assigneeId: "a7",
		createdAt: "2026-09-01T10:40:00.000Z",
		slaMinutesLeft: 33,
		craftsmanId: null,
		description:
			"Kraschloggen pekar på en nullreferens i startflödet. Endast Android 15 är drabbat.",
	},
	{
		id: "TF-2470",
		subject: "Dubbeldebitering i augusti",
		customer: "Petri Koskinen",
		customerType: "private",
		channel: "phone",
		priority: "medium",
		status: "resolved",
		line: "first",
		country: "Finland",
		assigneeId: "a4",
		createdAt: "2026-09-01T08:15:00.000Z",
		slaMinutesLeft: 0,
		craftsmanId: null,
		description:
			"Dubbeldragningen återbetalades och kundens betalmetod uppdaterades.",
	},
];

export const SUPPORT_TICKETS_SEED: SupportTicket[] = TICKET_SEEDS.map(
	(seed) => ({
		...seed,
		actions: [
			{
				id: `${seed.id}-a0`,
				at: seed.createdAt,
				authorId: null,
				text: "",
				messageKey: CREATED_KEY_BY_CHANNEL[seed.channel],
				type: "comment",
			},
		],
	}),
);
