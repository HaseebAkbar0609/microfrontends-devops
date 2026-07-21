import type { LeadQuoteRow } from "@/features/leads/types";

export const leadQuoteListByLeadId: Record<string, LeadQuoteRow[]> = {
	"L-2025-001": [
		{
			id: "quote-1",
			companyName: "Pelle Construction",
			contactPerson: "Peter Svensson",
			orgNumber: "58858357375",
			quotePrice: "57,000 SEK",
			status: "received",
		},
		{
			id: "quote-2",
			companyName: "CL Bygg",
			contactPerson: "Conny Larson",
			orgNumber: "982 234 2341",
			quotePrice: "0 SEK",
			status: "invited",
		},
		{
			id: "quote-3",
			companyName: "Nisse Bygg",
			contactPerson: "Peter Svensson",
			orgNumber: "982 234 2341",
			quotePrice: "26,000 SEK",
			status: "estimated",
		},
		{
			id: "quote-4",
			companyName: "Garage",
			contactPerson: "Nisse Olsson",
			orgNumber: "982 234 2341",
			quotePrice: "70,000 SEK",
			status: "waiting",
		},
		{
			id: "quote-5",
			companyName: "Backyard",
			contactPerson: "Conny Larson",
			orgNumber: "982 234 2341",
			quotePrice: "0 SEK",
			status: "waiting",
		},
		{
			id: "quote-6",
			companyName: "Backyard",
			contactPerson: "Conny Larson",
			orgNumber: "982 234 2341",
			quotePrice: "0 SEK",
			status: "waiting",
		},
		{
			id: "quote-7",
			companyName: "Backyard",
			contactPerson: "Conny Larson",
			orgNumber: "982 234 2341",
			quotePrice: "0 SEK",
			status: "waiting",
		},
	],
};

// Alias for the preview lead (apps/team/.../constants/previewLead.ts), which uses the
// "LEAD-2025-001" format shown in the Figma overview screenshot.
leadQuoteListByLeadId["LEAD-2025-001"] = leadQuoteListByLeadId["L-2025-001"];
