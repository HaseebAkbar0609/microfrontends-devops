import type { ModuleRichContent } from "./types";

export const orderContent: ModuleRichContent = {
  "heroDesc": "Digital orderhantering – från beställning till faktura. TimeFlows Order-modul är navet för hela företagets service- och orderverksamhet, med automatiserade processer, mobil arbetsorder och full integration mot hela TimeFlow.",
  "subhero": "Här hanteras allt från inkommande beställningar och resursplanering till utförande, dokumentation och fakturering. Oavsett om ordern kommer från en godkänd offert, kundportalen, hemsidan eller registreras internt får du ett komplett arbetsflöde med full kontroll över varje uppdrag.",
  "steps": {
    "label": "Detta ingår i Order",
    "title": "Från beställning till faktura – i sex steg.",
    "steps": [
      {
        "title": "Order från flera kanaler",
        "desc": "Skapa order på det sätt som passar verksamheten bäst.",
        "items": [
          "Godkänd offert",
          "Kundportal",
          "Företagets hemsida",
          "Telefonorder",
          "E-post",
          "CRM",
          "Intern registrering",
          "Återkommande serviceavtal",
          "B2B-förfrågningar"
        ],
        "note": "All kundinformation, historik och dokument följer automatiskt med till ordern."
      },
      {
        "title": "Order-Direkt™",
        "desc": "Låt kunden skapa order själv.",
        "items": [
          "Beskriva uppdraget",
          "Ladda upp bilder",
          "Bifoga dokument",
          "Välja tjänst",
          "Ange önskat datum",
          "Markera prioritet",
          "Ange kontaktperson",
          "Se orderstatus",
          "Kommunicera med entreprenören"
        ],
        "note": "Ordern skapas automatiskt i TimeFlow och är direkt redo för planering och tilldelning, utan manuell registrering."
      },
      {
        "title": "Resursplanering",
        "desc": "Planera hela uppdraget direkt från ordern.",
        "items": [
          "👷 Personal",
          "🚛 Fordon",
          "🚜 Maskiner",
          "📦 Material",
          "📅 Bokningar",
          "🏢 Avdelningar",
          "🤝 Underentreprenörer",
          "📍 Arbetsplatser"
        ],
        "note": "Systemet visar resursbeläggning i realtid och hjälper till att undvika dubbelbokningar."
      },
      {
        "title": "Mobil arbetsorder",
        "desc": "Teknikerna får hela arbetsordern direkt i TimeFlow Work.",
        "items": [
          "Se arbetsbeskrivning",
          "Navigera till arbetsplatsen",
          "Registrera arbetstid",
          "Rapportera material",
          "Fotografera arbetet",
          "Utföra egenkontroller",
          "Samla kundsignatur",
          "Rapportera avvikelser",
          "Avsluta ordern"
        ],
        "note": "All information synkroniseras direkt med kontoret."
      },
      {
        "title": "Utförande och dokumentation",
        "desc": "Samla all dokumentation kring ordern.",
        "items": [
          "Bilder före och efter",
          "Arbetsrapporter",
          "Materialförbrukning",
          "Kundsignatur",
          "KMA-kontroller",
          "Avvikelser",
          "ÄTA-arbeten",
          "Garantidokumentation"
        ],
        "note": "Allt lagras automatiskt på ordern."
      },
      {
        "title": "Fakturering och ekonomi",
        "desc": "När arbetet är klart kan ordern faktureras med ett klick.",
        "items": [
          "Arbetstid",
          "Material",
          "Maskinkostnader",
          "Milersättning",
          "UE-kostnader",
          "Tilläggsarbeten",
          "Avtalade priser"
        ],
        "note": "Ordern överförs sedan direkt till ekonomisystemet."
      }
    ]
  },
  "smart": {
    "label": "Smarta funktioner",
    "title": "Automatisering som spar tid och minskar fel.",
    "features": [
      {
        "title": "Order-Direkt™",
        "desc": "Kunder kan själva registrera serviceärenden och beställningar via hemsidan eller kundportalen. Ordern skapas automatiskt i TimeFlow och kan direkt planeras och tilldelas rätt resurser."
      },
      {
        "title": "Automatisk offert → order",
        "desc": "När kunden accepterar en offert skapas ordern automatiskt med alla dokument, kalkyler och kunduppgifter."
      },
      {
        "title": "Service- och återkommande order",
        "desc": "Skapa återkommande servicebesök, abonnemang och periodiska underhållsarbeten med automatiskt genererade order."
      },
      {
        "title": "Realtidsuppföljning",
        "desc": "Följ varje order från registrering till fakturering med status, ekonomi, tidsåtgång och resursbeläggning i realtid."
      }
    ]
  },
  "integrations": {
    "label": "Integrationer",
    "title": "Integrerat med hela TimeFlow.",
    "items": [
      "Offert – automatisk överföring från godkänd offert",
      "CRM – kundregister, kontaktpersoner och historik",
      "Kalkyl – kalkyler och prisunderlag",
      "Projekt – omvandla order till projekt",
      "Tidplan – planering av resurser och aktiviteter",
      "Personal – bemanning och schemaläggning",
      "Maskiner & Fordon – bokning och resursplanering",
      "Inköp – materialbeställningar direkt från ordern",
      "Lager – materialreservation och uttag",
      "B2B – underentreprenörer och leverantörer",
      "KMA – egenkontroller, avvikelser och arbetsmiljö",
      "Dokument – arbetsorder, bilder och bilagor",
      "ÄTA – registrering av tilläggs- och ändringsarbeten",
      "Ekonomi & Fakturering – automatisk fakturering och bokföring",
      "Ledningsstöd – orderstatistik och nyckeltal i Business Health Score"
    ]
  },
  "sections": [
    {
      "label": "Order Dashboard",
      "title": "Full överblick över verksamheten.",
      "intro": "Ordermodulen innehåller en kraftfull dashboard där företaget får full överblick över verksamheten.",
      "items": [
        "Aktiva order",
        "Nya order idag",
        "Pågående servicejobb",
        "Avslutade order",
        "Fakturerbara order",
        "Ej fakturerade order",
        "Ordervärde",
        "Beläggning",
        "Personalstatus",
        "Materialstatus",
        "Akuta order",
        "Garantijobb",
        "Kundnöjdhet",
        "Ledtider",
        "Faktureringsgrad"
      ]
    },
  ],
  "pricing": {
    "trialDays": 30,
    "planName": "Start",
    "price": {
      "amount": 2995,
      "currency": "SEK",
      "unit": "month"
    }
  },
  "summary": {
    "label": "Order",
    "title": "Ett komplett ordersystem för hantverksbranschen",
    "text": "Order-modulen är utvecklad för företag som vill digitalisera hela sin orderhantering. Med stöd för Order-Direkt™, automatiska arbetsflöden, mobil arbetsorder, resursplanering och full integration med resten av TimeFlow blir administrationen minimal och kontrollen maximal. Resultatet är snabbare handläggning, bättre resursutnyttjande, nöjdare kunder och ett effektivare företag. 🚀"
  },
  "ctaTitle": "Redo att testa Order-modulen?"
};
