import type { ActionResult } from "@/types/api";

export interface SupplierDetail {
	type: "supplier";
	id: string;
	initials: string;
	name: string;
	category: string;
	location: string;
	rating: number;
	reviewCount: number;
	isVerified: boolean;
	isTopSupplier: boolean;
	isOnline: boolean;
	phone: string;
	email: string;
	website: string;
	languages: string;
	responseTime: string;
	lastActive: string;
	completedProjects: number;
	ongoingProjects: number;
	hasRotRut: boolean;
	description: string;
	certifications: number;
	mainMunicipality: string;
	additionalMunicipalities: number;
}

export interface ToolDetail {
	type: "tool";
	id: string;
	name: string;
	logoUrl: string;
	status: "connected" | "disconnected" | "pending";
	category: string;
	description: string;
	website: string;
	apiKey?: string;
	webhookUrl?: string;
	syncFrequency?: "hourly" | "daily" | "weekly";
	permissions: string[];
	activityLogs: {
		timestamp: string;
		status: "success" | "failed";
		message: string;
	}[];
}

const MOCK_SUPPLIERS_DETAILS: Record<string, SupplierDetail> = {
	"1": {
		type: "supplier",
		id: "1",
		initials: "PB",
		name: "Pelle bygg AB",
		category: "Bygg & Renovering",
		location: "Stockholm, Sweden",
		rating: 5.0,
		reviewCount: 48,
		isVerified: true,
		isTopSupplier: true,
		isOnline: true,
		phone: "08–580 50 50",
		email: "info@pellebygg.se",
		website: "www.pellebygg.se",
		languages: "Svenska, English",
		responseTime: "~2 timmar",
		lastActive: "Aktiv senaste 2 dagar",
		completedProjects: 124,
		ongoingProjects: 6,
		hasRotRut: true,
		description:
			"Pelle bygg AB är ett välrenommerat byggföretag med över 15 års erfarenhet av renovering och nybyggnation i Stockholmsområdet. Vi specialiserar oss på badrum och kök men erbjuder ett komplett utbud av byggtjänster.",
		certifications: 3,
		mainMunicipality: "Stockholm",
		additionalMunicipalities: 2,
	},
	"2": {
		type: "supplier",
		id: "2",
		initials: "NB",
		name: "Nisse bygg AB",
		category: "Bygg & Renovering",
		location: "Göteborg, Sweden",
		rating: 4.8,
		reviewCount: 22,
		isVerified: true,
		isTopSupplier: false,
		isOnline: false,
		phone: "031–123 45 67",
		email: "info@nissebygg.se",
		website: "www.nissebygg.se",
		languages: "Svenska",
		responseTime: "~4 timmar",
		lastActive: "Aktiv senaste vecka",
		completedProjects: 85,
		ongoingProjects: 3,
		hasRotRut: true,
		description:
			"Nisse bygg AB erbjuder högkvalitativa renoveringstjänster med fokus på hållbarhet och noggrannhet. Vi har lång erfarenhet av både mindre reparationer och stora ombyggnationer.",
		certifications: 2,
		mainMunicipality: "Göteborg",
		additionalMunicipalities: 1,
	},
	"3": {
		type: "supplier",
		id: "3",
		initials: "CB",
		name: "CL bygg",
		category: "Måleri & Snickeri",
		location: "Malmö, Sweden",
		rating: 4.5,
		reviewCount: 15,
		isVerified: false,
		isTopSupplier: false,
		isOnline: true,
		phone: "040–987 65 43",
		email: "conny@clbygg.se",
		website: "www.clbygg.se",
		languages: "Svenska, English, Dansk",
		responseTime: "~1 timme",
		lastActive: "Aktiv nu",
		completedProjects: 45,
		ongoingProjects: 2,
		hasRotRut: false,
		description:
			"CL bygg drivs av Conny Larson och fokuserar på personlig service och högsta hantverkskvalitet inom måleri, snickeri och golvläggning.",
		certifications: 1,
		mainMunicipality: "Malmö",
		additionalMunicipalities: 3,
	},
};

const MOCK_TOOLS_DETAILS: Record<string, ToolDetail> = {
	"jira": {
		type: "tool",
		id: "jira",
		name: "Jira",
		logoUrl: "/images/logos/jira.svg",
		status: "connected",
		category: "Projektverktyg",
		description: "Synka dina Jira-tickets och projekt direkt med TimeFlow för att spåra tid, resurser och framsteg automatiskt.",
		website: "https://www.atlassian.com/software/jira",
		apiKey: "••••••••••••••••••••••••••••",
		webhookUrl: "https://api.timeflowsystem.com/webhooks/jira/12345",
		syncFrequency: "hourly",
		permissions: [
			"Läs behörighet för projekt och ärenden",
			"Skriv behörighet för tidrapporter",
			"Läs användarprofiler och roller"
		],
		activityLogs: [
			{ timestamp: "Idag, 14:32", status: "success", message: "Automatiskt synk slutförd. 12 ärenden uppdaterade." },
			{ timestamp: "Igår, 14:32", status: "success", message: "Automatiskt synk slutförd. 8 ärenden uppdaterade." },
			{ timestamp: "2026-07-06, 14:32", status: "failed", message: "Synk misslyckades: API-gräns uppnådd." }
		]
	},
	"slack": {
		type: "tool",
		id: "slack",
		name: "Slack",
		logoUrl: "/images/logos/slack.svg",
		status: "connected",
		category: "Kommunikation",
		description: "Få notifieringar om projektstatus, nya meddelanden och uppdateringar direkt i dina Slack-kanaler.",
		website: "https://slack.com",
		apiKey: "••••••••••••••••••••••••••••",
		webhookUrl: "https://api.timeflowsystem.com/webhooks/slack/12345",
		syncFrequency: "daily",
		permissions: [
			"Skicka meddelanden till valda kanaler",
			"Läs kanalnamn och information"
		],
		activityLogs: [
			{ timestamp: "Idag, 09:00", status: "success", message: "Daglig statusrapport skickad till #projektsynk." },
			{ timestamp: "Igår, 09:00", status: "success", message: "Daglig statusrapport skickad till #projektsynk." }
		]
	},
	"github": {
		type: "tool",
		id: "github",
		name: "GitHub",
		logoUrl: "/images/logos/github.svg",
		status: "disconnected",
		category: "Kod & Versionshantering",
		description: "Koppla dina GitHub-repositories för att spåra commits, pull requests och länkade issues mot dina projekt.",
		website: "https://github.com",
		permissions: [
			"Läs behörighet för publika och privata repositories",
			"Läs commit-loggar och pull requests"
		],
		activityLogs: []
	}
};

export async function getSupplierOrToolByIdAPIAction(
	id: string,
): Promise<ActionResult<SupplierDetail | ToolDetail>> {
	try {
		// Simulate network latency
		await new Promise((resolve) => setTimeout(resolve, 500));

		const lowerId = id.toLowerCase();
		if (lowerId in MOCK_TOOLS_DETAILS) {
			return { success: true, data: MOCK_TOOLS_DETAILS[lowerId], error: null };
		}

		if (id in MOCK_SUPPLIERS_DETAILS) {
			return { success: true, data: MOCK_SUPPLIERS_DETAILS[id], error: null };
		}

		// Fallback helper to search by name/partial matching if ID is not direct
		const supplierByInitials = Object.values(MOCK_SUPPLIERS_DETAILS).find(
			(s) => s.id === id || s.name.toLowerCase().includes(lowerId)
		);
		if (supplierByInitials) {
			return { success: true, data: supplierByInitials, error: null };
		}

		return { success: false, data: null, error: "Kunde inte hitta verktyget eller leverantören." };
	} catch {
		return { success: false, data: null, error: "Ett fel uppstod vid hämtning av detaljer." };
	}
}
