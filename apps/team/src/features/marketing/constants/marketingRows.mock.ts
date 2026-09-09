// Generated for TFS-990 from the Marketing Hub Deluxe prototype. Edit by hand.

import type { MarketingRowsBySection } from "../types";

/**
 * Seed rows until the API lands; only `useMarketingRegisters` reads this file.
 *
 * Every row carries a stable id - the prototype keyed rows on their array
 * index and addressed edit and delete the same way, so deleting one row made
 * the rows below it inherit the wrong form state. Select values are stored as
 * option ids; the remaining cell text is record content and stays literal.
 */
export const MARKETING_ROWS_SEED: MarketingRowsBySection = {
	"strategi:marknadsplan": [
		{
			id: "marknadsplan-1",
			values: { "id": "M#101", "namn": "Mail utskick", "kategori": "campaign", "kanal": "Sociala medier", "ansvarig": "Lindsey Philips", "start": "2026-02-06", "slut": "2026-03-06", "status": "ongoing" },
		},
		{
			id: "marknadsplan-2",
			values: { "id": "M#102", "namn": "Annonsering", "kategori": "crm", "kanal": "Flowtalk", "ansvarig": "Abram Siphron", "start": "2026-02-06", "slut": "2026-04-01", "status": "ongoing" },
		},
		{
			id: "marknadsplan-3",
			values: { "id": "M#103", "namn": "Event mässa", "kategori": "event", "kanal": "Automation", "ansvarig": "Jocelyn Gouse", "start": "2026-03-10", "slut": "2026-03-12", "status": "planned" },
		},
		{
			id: "marknadsplan-4",
			values: { "id": "M#104", "namn": "Radio reklam", "kategori": "tools", "kanal": "Mailer", "ansvarig": "Wilson Dokidis", "start": "2026-02-20", "slut": "2026-03-20", "status": "sent" },
		},
		{
			id: "marknadsplan-5",
			values: { "id": "M#105", "namn": "Sponsring", "kategori": "campaign", "kanal": "Flowtalk", "ansvarig": "Carla Calzoni", "start": "2026-04-01", "slut": "2026-06-30", "status": "planned" },
		},
		{
			id: "marknadsplan-6",
			values: { "id": "M#106", "namn": "TV-reklam", "kategori": "campaign", "kanal": "Flowtalk", "ansvarig": "Lindsey Philips", "start": "2026-05-02", "slut": "2026-05-30", "status": "paused" },
		},
	],
	"strategi:budget": [
		{
			id: "budget-1",
			values: { "post": "Digital annonsering", "kanal": "Google Ads", "period": "2026 Q1", "budget": 180000, "utfall": 142500, "ansvarig": "Abram Siphron" },
		},
		{
			id: "budget-2",
			values: { "post": "Sociala medier", "kanal": "Meta", "period": "2026 Q1", "budget": 120000, "utfall": 98000, "ansvarig": "Lindsey Philips" },
		},
		{
			id: "budget-3",
			values: { "post": "Mässor & event", "kanal": "Event", "period": "2026 Q1", "budget": 250000, "utfall": 210400, "ansvarig": "Jocelyn Gouse" },
		},
		{
			id: "budget-4",
			values: { "post": "Produktion & film", "kanal": "Byrå", "period": "2026 Q1", "budget": 90000, "utfall": 112000, "ansvarig": "Carla Calzoni" },
		},
		{
			id: "budget-5",
			values: { "post": "SEO & innehåll", "kanal": "Organiskt", "period": "2026 Q1", "budget": 75000, "utfall": 61000, "ansvarig": "Wilson Dokidis" },
		},
		{
			id: "budget-6",
			values: { "post": "Print & tryck", "kanal": "Offline", "period": "2026 Q1", "budget": 45000, "utfall": 30500, "ansvarig": "Lindsey Philips" },
		},
	],
	"innehall:dokument": [
		{
			id: "dokument-1",
			values: { "namn": "Kampanjbilder vår 2026", "typ": "image", "kategori": "Kampanj", "uppdaterad": "2026-02-11", "agare": "Design", "lank": "https://drive.google.com" },
		},
		{
			id: "dokument-2",
			values: { "namn": "Produktbroschyr.pdf", "typ": "pdf", "kategori": "Säljmaterial", "uppdaterad": "2026-01-28", "agare": "Marknad", "lank": "https://drive.google.com" },
		},
		{
			id: "dokument-3",
			values: { "namn": "Reklamfilm 30s", "typ": "video", "kategori": "Kampanj", "uppdaterad": "2026-02-02", "agare": "Byrå Nord", "lank": "https://vimeo.com" },
		},
		{
			id: "dokument-4",
			values: { "namn": "Avtal mediebyrå", "typ": "contract", "kategori": "Juridik", "uppdaterad": "2025-12-15", "agare": "Ledning", "lank": "https://drive.google.com" },
		},
		{
			id: "dokument-5",
			values: { "namn": "Mall nyhetsbrev", "typ": "template", "kategori": "E-post", "uppdaterad": "2026-02-09", "agare": "Marknad", "lank": "https://mailchimp.com" },
		},
	],
	"innehall:bilder": [
		{
			id: "bilder-1",
			values: { "namn": "Kampanjbilder vår 2026", "kategori": "campaign", "format": "jpg", "uppdaterad": "2026-02-11", "agare": "Design", "lank": "https://drive.google.com" },
		},
		{
			id: "bilder-2",
			values: { "namn": "Produktfoto vit bakgrund", "kategori": "product", "format": "png", "uppdaterad": "2026-01-20", "agare": "Design", "lank": "https://drive.google.com" },
		},
		{
			id: "bilder-3",
			values: { "namn": "Event mässa 2026", "kategori": "event", "format": "jpg", "uppdaterad": "2026-03-12", "agare": "Marknad", "lank": "https://drive.google.com" },
		},
	],
	"innehall:videor": [
		{
			id: "videor-1",
			values: { "namn": "Reklamfilm vår 2026 30s", "kategori": "commercial", "langd": 30, "uppdaterad": "2026-02-02", "agare": "Byrå Nord", "lank": "https://vimeo.com" },
		},
		{
			id: "videor-2",
			values: { "namn": "Produktvideo nyhet", "kategori": "productVideo", "langd": 90, "uppdaterad": "2026-02-15", "agare": "Marknad", "lank": "https://vimeo.com" },
		},
		{
			id: "videor-3",
			values: { "namn": "Tutorial – så kommer du igång", "kategori": "tutorial", "langd": 180, "uppdaterad": "2026-01-30", "agare": "Innehåll", "lank": "https://youtube.com" },
		},
	],
	"innehall:profil": [
		{
			id: "profil-1",
			values: { "element": "Primärfärg", "typ": "colour", "varde": "#0F3D3E", "anvandning": "Bakgrund, rubriker", "lank": "https://drive.google.com" },
		},
		{
			id: "profil-2",
			values: { "element": "Accentfärg", "typ": "colour", "varde": "#E4572E", "anvandning": "Knappar, CTA", "lank": "https://drive.google.com" },
		},
		{
			id: "profil-3",
			values: { "element": "Rubriktypsnitt", "typ": "typeface", "varde": "Space Grotesk", "anvandning": "H1–H3", "lank": "https://fonts.google.com" },
		},
		{
			id: "profil-4",
			values: { "element": "Brödtypsnitt", "typ": "typeface", "varde": "DM Sans", "anvandning": "Löpande text", "lank": "https://fonts.google.com" },
		},
		{
			id: "profil-5",
			values: { "element": "Logotyp primär", "typ": "logotype", "varde": "logo-primary.svg", "anvandning": "Ljus bakgrund", "lank": "https://drive.google.com" },
		},
	],
	"innehall:maillistor": [
		{
			id: "maillistor-1",
			values: { "lista": "Nyhetsbrev alla", "segment": "B2B + B2C", "antal": 12450, "oppning": 38, "klick": 6, "senast": "2026-02-12" },
		},
		{
			id: "maillistor-2",
			values: { "lista": "Kunder aktiva", "segment": "Befintliga kunder", "antal": 3210, "oppning": 52, "klick": 11, "senast": "2026-02-05" },
		},
		{
			id: "maillistor-3",
			values: { "lista": "Leads mässa", "segment": "Prospekt", "antal": 840, "oppning": 44, "klick": 9, "senast": "2026-01-30" },
		},
		{
			id: "maillistor-4",
			values: { "lista": "Återförsäljare", "segment": "Partner", "antal": 260, "oppning": 61, "klick": 18, "senast": "2026-02-01" },
		},
	],
	"insikter:rapporter": [
		{
			id: "rapporter-1",
			values: { "namn": "Webbtrafik februari", "kalla": "googleAnalytics", "period": "2026-02", "besokare": 14100, "konverteringar": 281, "konvgrad": 2.0, "resultat": "Starkaste månaden hittills, organiskt +15%", "lank": "https://analytics.google.com", "sparad": "2026-03-02" },
		},
		{
			id: "rapporter-2",
			values: { "namn": "Webbtrafik januari", "kalla": "googleAnalytics", "period": "2026-01", "besokare": 12600, "konverteringar": 244, "konvgrad": 1.9, "resultat": "Kampanj M#101 gav tydlig lyft i trafik", "lank": "https://analytics.google.com", "sparad": "2026-02-02" },
		},
		{
			id: "rapporter-3",
			values: { "namn": "Sökord Q4", "kalla": "googleSearchConsole", "period": "2025-Q4", "besokare": 13100, "konverteringar": 0, "konvgrad": 0, "resultat": "Förbättrad position på 8 av 12 prioriterade sökord", "lank": "https://search.google.com/search-console", "sparad": "2026-01-10" },
		},
	],
	"insikter:seo": [
		{
			id: "seo-1",
			values: { "sokord": "marknadsföring stockholm", "kategori": "tradespeople", "volym": 2400, "position": 8, "svarighet": 46, "sida": "/tjanster", "prioritet": "high" },
		},
		{
			id: "seo-2",
			values: { "sokord": "digital byrå", "kategori": "tradespeople", "volym": 1300, "position": 14, "svarighet": 52, "sida": "/om-oss", "prioritet": "high" },
		},
		{
			id: "seo-3",
			values: { "sokord": "seo-analys pris", "kategori": "privateIndividual", "volym": 720, "position": 4, "svarighet": 28, "sida": "/seo", "prioritet": "medium" },
		},
		{
			id: "seo-4",
			values: { "sokord": "marknadsplan mall", "kategori": "tradespeople", "volym": 1900, "position": 22, "svarighet": 34, "sida": "/blogg/marknadsplan", "prioritet": "high" },
		},
		{
			id: "seo-5",
			values: { "sokord": "annonsering google", "kategori": "privateIndividual", "volym": 880, "position": 11, "svarighet": 41, "sida": "/google-ads", "prioritet": "medium" },
		},
		{
			id: "seo-6",
			values: { "sokord": "grafisk profil pris", "kategori": "privateIndividual", "volym": 320, "position": 6, "svarighet": 22, "sida": "/design", "prioritet": "low" },
		},
	],
	"insikter:konkurrenter": [
		{
			id: "konkurrenter-1",
			values: { "bolag": "Nordic Media AB", "webb": "https://nordicmedia.se", "segment": "Fullservice", "styrka": "Stark SEO", "svaghet": "Höga priser", "bevakning": "2026-02-10" },
		},
		{
			id: "konkurrenter-2",
			values: { "bolag": "Kampanjhuset", "webb": "https://kampanjhuset.se", "segment": "Performance", "styrka": "Snabb leverans", "svaghet": "Smal kompetens", "bevakning": "2026-02-04" },
		},
		{
			id: "konkurrenter-3",
			values: { "bolag": "Studio Vind", "webb": "https://studiovind.se", "segment": "Design", "styrka": "Starkt varumärke", "svaghet": "Litet team", "bevakning": "2026-01-22" },
		},
	],
	"organisation:organisation": [
		{
			id: "organisation-1",
			values: { "namn": "Lindsey Philips", "roll": "marketingManager", "team": "management", "ansvarsomrade": "Strategi, budget & teamledning", "epost": "lindsey@foretaget.se", "telefon": "070-111 22 33", "anstalld": "2021-03-15", "sysselsattning": 100 },
		},
		{
			id: "organisation-2",
			values: { "namn": "Abram Siphron", "roll": "performanceManager", "team": "digital", "ansvarsomrade": "Google Ads & annonsering", "epost": "abram@foretaget.se", "telefon": "070-222 33 44", "anstalld": "2022-08-01", "sysselsattning": 100 },
		},
		{
			id: "organisation-3",
			values: { "namn": "Jocelyn Gouse", "roll": "marketingCoordinator", "team": "campaign", "ansvarsomrade": "Event, mässor & kampanjer", "epost": "jocelyn@foretaget.se", "telefon": "070-333 44 55", "anstalld": "2023-01-09", "sysselsattning": 80 },
		},
		{
			id: "organisation-4",
			values: { "namn": "Wilson Dokidis", "roll": "seoSpecialist", "team": "digital", "ansvarsomrade": "SEO, sökord & webbanalys", "epost": "wilson@foretaget.se", "telefon": "070-444 55 66", "anstalld": "2022-05-23", "sysselsattning": 100 },
		},
		{
			id: "organisation-5",
			values: { "namn": "Carla Calzoni", "roll": "contentLead", "team": "content", "ansvarsomrade": "Texter, blogg & nyhetsbrev", "epost": "carla@foretaget.se", "telefon": "070-555 66 77", "anstalld": "2024-02-05", "sysselsattning": 50 },
		},
	],
	"organisation:byraer": [
		{
			id: "byraer-1",
			values: { "bolag": "Byrå Nord AB", "omrade": "Film & produktion", "kontakt": "Jocelyn Gouse", "epost": "jocelyn@byranord.se", "telefon": "070-123 45 67", "avtal": "2026-12-31", "arskostnad": 420000 },
		},
		{
			id: "byraer-2",
			values: { "bolag": "SearchLab", "omrade": "SEO & SEM", "kontakt": "Wilson Dokidis", "epost": "wilson@searchlab.se", "telefon": "070-222 33 44", "avtal": "2026-06-30", "arskostnad": 260000 },
		},
		{
			id: "byraer-3",
			values: { "bolag": "Social Studio", "omrade": "Sociala medier", "kontakt": "Carla Calzoni", "epost": "carla@socialstudio.se", "telefon": "070-555 66 77", "avtal": "2027-01-31", "arskostnad": 180000 },
		},
		{
			id: "byraer-4",
			values: { "bolag": "PrintPartner", "omrade": "Tryck & profil", "kontakt": "Abram Siphron", "epost": "abram@printpartner.se", "telefon": "070-888 99 00", "avtal": "2026-09-30", "arskostnad": 95000 },
		},
	],
	"organisation:system": [
		{
			id: "system-1",
			values: { "system": "Google Analytics 4", "typ": "analytics", "konto": "marknad@foretaget.se", "kostnad": 0, "ansvarig": "Wilson Dokidis", "lank": "https://analytics.google.com" },
		},
		{
			id: "system-2",
			values: { "system": "Google Ads", "typ": "advertising", "konto": "123-456-7890", "kostnad": 0, "ansvarig": "Abram Siphron", "lank": "https://ads.google.com" },
		},
		{
			id: "system-3",
			values: { "system": "Meta Business", "typ": "socialTools", "konto": "Företaget AB", "kostnad": 0, "ansvarig": "Lindsey Philips", "lank": "https://business.facebook.com" },
		},
		{
			id: "system-4",
			values: { "system": "LinkedIn Sida", "typ": "socialTools", "konto": "/company/foretaget", "kostnad": 0, "ansvarig": "Lindsey Philips", "lank": "https://linkedin.com" },
		},
		{
			id: "system-5",
			values: { "system": "Instagram", "typ": "socialTools", "konto": "@foretaget", "kostnad": 0, "ansvarig": "Lindsey Philips", "lank": "https://instagram.com" },
		},
		{
			id: "system-6",
			values: { "system": "Mailchimp", "typ": "email", "konto": "marknad@foretaget.se", "kostnad": 890, "ansvarig": "Marknad", "lank": "https://mailchimp.com" },
		},
		{
			id: "system-7",
			values: { "system": "HubSpot", "typ": "crm", "konto": "Företaget AB", "kostnad": 4200, "ansvarig": "Sälj", "lank": "https://hubspot.com" },
		},
		{
			id: "system-8",
			values: { "system": "Canva Teams", "typ": "design", "konto": "design@foretaget.se", "kostnad": 320, "ansvarig": "Design", "lank": "https://canva.com" },
		},
	],
	"kontakter:hantverkare": [
		{
			id: "hantverkare-1",
			values: { "foretag": "Trelleborg Bygg AB", "orgnr": "556123-4567", "bransch": "Byggnation", "ort": "Trelleborg", "kontakt": "Anna Ek", "epost": "anna@trelleborgbygg.se", "telefon": "070-111 22 33", "status": "active", "nyhetsbrev": "yes", "senast": "2026-02-18" },
		},
		{
			id: "hantverkare-2",
			values: { "foretag": "Väst El & VVS", "orgnr": "556987-1122", "bransch": "El & VVS", "ort": "Göteborg", "kontakt": "Per Nilsson", "epost": "per@vastelvvs.se", "telefon": "070-222 33 44", "status": "prospect", "nyhetsbrev": "yes", "senast": "2026-01-22" },
		},
		{
			id: "hantverkare-3",
			values: { "foretag": "Nord Måleri", "orgnr": "556444-8899", "bransch": "Måleri", "ort": "Umeå", "kontakt": "Jocelyn Gouse", "epost": "jocelyn@nordmaleri.se", "telefon": "070-333 44 55", "status": "quoted", "nyhetsbrev": "yes", "senast": "2026-02-09" },
		},
		{
			id: "hantverkare-4",
			values: { "foretag": "Syd Tak & Plåt", "orgnr": "969777-2211", "bransch": "Tak & plåt", "ort": "Malmö", "kontakt": "Sara Lund", "epost": "sara@sydtak.se", "telefon": "070-444 55 66", "status": "lead", "nyhetsbrev": "no", "senast": "2026-02-01" },
		},
		{
			id: "hantverkare-5",
			values: { "foretag": "Snickeri Öst", "orgnr": "556300-7788", "bransch": "Snickeri", "ort": "Norrköping", "kontakt": "Mats Berg", "epost": "mats@snickeriost.se", "telefon": "070-555 66 77", "status": "active", "nyhetsbrev": "yes", "senast": "2026-02-20" },
		},
	],
	"kontakter:privatpersoner": [
		{
			id: "privatpersoner-1",
			values: { "namn": "Karin Persson", "epost": "karin.persson@mail.se", "telefon": "070-901 11 22", "ort": "Lund", "intresse": "Köksrenovering", "kalla": "Google Ads", "status": "lead", "nyhetsbrev": "yes", "senast": "2026-02-14" },
		},
		{
			id: "privatpersoner-2",
			values: { "namn": "Johan Sjöberg", "epost": "johan.sjoberg@mail.se", "telefon": "070-902 33 44", "ort": "Malmö", "intresse": "Badrum", "kalla": "Webbformulär", "status": "quoted", "nyhetsbrev": "yes", "senast": "2026-02-10" },
		},
		{
			id: "privatpersoner-3",
			values: { "namn": "Elin Åkesson", "epost": "elin.akesson@mail.se", "telefon": "070-903 55 66", "ort": "Helsingborg", "intresse": "Solceller", "kalla": "Mässa", "status": "active", "nyhetsbrev": "yes", "senast": "2026-02-19" },
		},
		{
			id: "privatpersoner-4",
			values: { "namn": "Nils Hammar", "epost": "nils.hammar@mail.se", "telefon": "070-904 77 88", "ort": "Ystad", "intresse": "Fönsterbyte", "kalla": "Rekommendation", "status": "prospect", "nyhetsbrev": "no", "senast": "2026-01-28" },
		},
		{
			id: "privatpersoner-5",
			values: { "namn": "Maja Lindqvist", "epost": "maja.lindqvist@mail.se", "telefon": "070-905 99 00", "ort": "Trelleborg", "intresse": "Altan", "kalla": "Facebook", "status": "active", "nyhetsbrev": "yes", "senast": "2026-02-21" },
		},
	],
	"kontakter:nyhetsbrevsutskick": [
		{
			id: "nyhetsbrevsutskick-1",
			values: { "rubrik": "Vårkampanj för hantverkare", "malgrupp": "tradespeople", "segment": "active", "datum": "2026-03-04", "status": "planned", "mottagare": 0, "oppning": 0, "ansvarig": "Carla Calzoni", "innehall": "Vårens kampanjer, nya priser och tips inför säsongen." },
		},
		{
			id: "nyhetsbrevsutskick-2",
			values: { "rubrik": "Renoveringstips till våren", "malgrupp": "privateIndividuals", "segment": "active", "datum": "2026-02-19", "status": "sent", "mottagare": 2, "oppning": 46, "ansvarig": "Lindsey Philips", "innehall": "Fem enkla renoveringsprojekt att hinna med före sommaren." },
		},
		{
			id: "nyhetsbrevsutskick-3",
			values: { "rubrik": "Erbjudande till offererade kunder", "malgrupp": "all", "segment": "quoted", "datum": "2026-03-12", "status": "draft", "mottagare": 0, "oppning": 0, "ansvarig": "Abram Siphron", "innehall": "Ett riktat erbjudande till dig som redan fått en offert av oss." },
		},
	],
	"event:eventkalender": [
		{
			id: "eventkalender-1",
			values: { "namn": "Vårmässan 2026", "datum": "2026-03-15", "plats": "Malmömässan", "tema": "Hållbart byggande", "malgrupp": "Hantverkare", "ansvarig": "Jocelyn Gouse", "status": "planned" },
		},
		{
			id: "eventkalender-2",
			values: { "namn": "Kundkväll Lund", "datum": "2026-04-22", "plats": "Lund", "tema": "Renoveringstips", "malgrupp": "Privatpersoner", "ansvarig": "Carla Calzoni", "status": "planned" },
		},
		{
			id: "eventkalender-3",
			values: { "namn": "Partnerträff", "datum": "2026-02-10", "plats": "Stockholm", "tema": "Samarbete 2026", "malgrupp": "Byråer", "ansvarig": "Lindsey Philips", "status": "completed" },
		},
	],
	"event:eventinbjudningar": [
		{
			id: "eventinbjudningar-1",
			values: { "event": "Vårmässan 2026", "mottagare": "Trelleborg Bygg AB", "typ": "email", "status": "registered", "skickat": "2026-02-20", "svar": "2 deltagare" },
		},
		{
			id: "eventinbjudningar-2",
			values: { "event": "Vårmässan 2026", "mottagare": "Väst El & VVS", "typ": "email", "status": "opened", "skickat": "2026-02-21", "svar": "" },
		},
		{
			id: "eventinbjudningar-3",
			values: { "event": "Kundkväll Lund", "mottagare": "Karin Persson", "typ": "sms", "status": "sent", "skickat": "2026-03-01", "svar": "" },
		},
	],
	"event:eventprospekt": [
		{
			id: "eventprospekt-1",
			values: { "namn": "Höstmässan Göteborg", "datum": "2026-09-12", "budget": 125000, "plats": "Svenska Mässan", "tema": "Framtidens hantverk", "samarbetspartner": "Byrå Nord AB", "program": "09:00 Registrering, 10:00 Föreläsning, 13:00 Workshop, 15:00 Mingel", "status": "planning" },
		},
		{
			id: "eventprospekt-2",
			values: { "namn": "Sommarträff kunder", "datum": "2026-06-18", "budget": 45000, "plats": "Trelleborg", "tema": "Sommarens projekt", "samarbetspartner": "Social Studio", "program": "Grillmingel, produktdemo och kundcase", "status": "idea" },
		},
	],
};
