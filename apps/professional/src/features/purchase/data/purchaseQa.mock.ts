import type { PurchaseQaMessage } from "../types/purchase.types";

/**
 * Questions on the purchase module's Fråga/Svar board, taken from the frame.
 *
 * The frame repeats one message on every card — the same placeholder habit as
 * the suppliers and complaints frames — so these are varied enough to tell
 * apart, and spread across two companies and three roles so the Företag and
 * Kund filters have something to narrow.
 *
 * Display dates are literal strings; `new Date()` in a mock desynchronises the
 * server and client render.
 */
export const MOCK_PURCHASE_QA: PurchaseQaMessage[] = [
	{
		id: "qa-1",
		sender: "Kalle Svensson",
		company: "Pelles Måleri",
		badge: "UE",
		message: "Hej, undrar om ni skickar över kontrollplan",
		date: "12 augusti",
		status: "new",
		archived: false,
	},
	{
		id: "qa-2",
		sender: "Kalle Svensson",
		company: "Pelles Måleri",
		badge: "Fråga",
		message: "När kan vi räkna med leverans av köksstommarna?",
		date: "12 augusti",
		status: "new",
		archived: false,
	},
	{
		id: "qa-3",
		sender: "Anna Lind",
		company: "Fastighetsbolaget",
		badge: "Beställare",
		message: "Kan ni bekräfta att bänkskivan är beställd?",
		date: "13 augusti",
		status: "opened",
		archived: false,
	},
	{
		id: "qa-4",
		sender: "Erik Johansson",
		company: "Fastighetsbolaget",
		badge: "Beställare",
		message: "Behöver vi en ny offert för den utökade ytan?",
		date: "14 augusti",
		status: "answered",
		archived: false,
		answerUser: "Stefan Eriksson",
		answerText: "Hej, jag skickar över en uppdaterad offert i morgon.",
		answerDate: "14 augusti",
	},
	{
		id: "qa-5",
		sender: "Kalle Svensson",
		company: "Pelles Måleri",
		badge: "UE",
		message: "Har ni fått bilderna på skadan?",
		date: "15 augusti",
		status: "answered",
		archived: false,
		answerUser: "Stefan Eriksson",
		answerText: "Ja, de kom fram. Vi återkommer med besked.",
		answerDate: "15 augusti",
	},
	{
		id: "qa-6",
		sender: "Anna Lind",
		company: "Fastighetsbolaget",
		badge: "Fråga",
		message: "Gäller samma leveransadress som förra gången?",
		date: "2 augusti",
		status: "answered",
		archived: true,
		answerUser: "Stefan Eriksson",
		answerText: "Ja, ingen ändring.",
		answerDate: "2 augusti",
	},
];
