/**
 * TimeFlow Tidsstudie — central konfiguration.
 * Alla standardantaganden ligger här, aldrig hårdkodade i UI-komponenter.
 */

export const WORKDAYS_PER_MONTH = 21;
export const WEEKS_PER_MONTH = 4.33;

export type CalculationFrequency =
  | "per_activity"
  | "per_person_day"
  | "per_week"
  | "per_project_month";

/** En volymfråga inom ett arbetsområde. */
export interface TimeStudyItem {
  id: string;
  volumeLabel: string;
  volumeUnit: string;
  defaultVolume: number;
  /** Minuter per volymenhet, traditionellt arbetssätt. */
  traditionalMinutes: number;
  /** Minuter per volymenhet, med TimeFlow. */
  timeFlowMinutes: number;
  calculationFrequency: CalculationFrequency;
  /** Vad enheten i "Justera tider" avser, t.ex. "per offert". */
  adjustUnitLabel: string;
  /** Om volymen ska förifyllas från ROI-kalkylatorn. */
  syncFrom?: "workers" | "totalUsers" | "admins";
}

export interface TimeStudyArea {
  id: string;
  title: string;
  help: string;
  items: TimeStudyItem[];
  traditionalIncludes: string[];
  timeFlowIncludes: string[];
  qualitativeBenefits: string[];
}

export const FREQUENCY_MULTIPLIER: Record<CalculationFrequency, number> = {
  per_activity: 1,
  per_person_day: WORKDAYS_PER_MONTH,
  per_week: WEEKS_PER_MONTH,
  per_project_month: 1,
};

export const TIME_STUDY_AREAS: TimeStudyArea[] = [
  {
    id: "offert",
    title: "Offert och kalkyl",
    help: "Från kunduppgifter till skickad och signerad offert.",
    items: [
      {
        id: "offert.count",
        volumeLabel: "Hur många offerter skapar ni per månad?",
        volumeUnit: "offerter/mån",
        defaultVolume: 20,
        traditionalMinutes: 75,
        timeFlowMinutes: 40,
        calculationFrequency: "per_activity",
        adjustUnitLabel: "min per offert",
      },
    ],
    traditionalIncludes: [
      "Kunduppgifter från e-post eller anteckningar",
      "Kalkyl i Excel",
      "Manuell prisberäkning",
      "Word- eller PDF-offert",
      "Manuell kontroll",
      "Separat utskick och uppföljning",
    ],
    timeFlowIncludes: [
      "Kunduppgifter i samma system",
      "Kalkyl och prislistor",
      "Offertmallar",
      "Återanvändning av tidigare uppgifter",
      "Calculation PRO",
      "QuickAiCalc",
      "Digital signering",
      "Omvandling från offert till order eller projekt",
    ],
    qualitativeBenefits: ["Jämnare offertkvalitet", "Snabbare svar till kund"],
  },
  {
    id: "order",
    title: "Order och projekt",
    help: "Skapa order samt hålla överblick över aktiva projekt.",
    items: [
      {
        id: "order.count",
        volumeLabel: "Hur många nya order skapar ni per månad?",
        volumeUnit: "order/mån",
        defaultVolume: 20,
        traditionalMinutes: 20,
        timeFlowMinutes: 8,
        calculationFrequency: "per_activity",
        adjustUnitLabel: "min per order",
      },
      {
        id: "order.projects",
        volumeLabel: "Hur många aktiva projekt hanterar ni?",
        volumeUnit: "projekt",
        defaultVolume: 5,
        traditionalMinutes: 60,
        timeFlowMinutes: 25,
        calculationFrequency: "per_project_month",
        adjustUnitLabel: "min per projekt/mån",
      },
    ],
    traditionalIncludes: [
      "Registrera kund och adress",
      "Kopiera information från offert",
      "Skapa arbetsbeskrivning",
      "Lägga till dokument",
      "Tilldela ansvarig",
      "Informera hantverkaren",
    ],
    timeFlowIncludes: [
      "Projekt- och orderuppgifter samlade",
      "Arbetsbeskrivning och tidsplan",
      "Ansvariga personer",
      "Dokument och bilder",
      "Tid, material och ÄTA",
      "Kunduppgifter och projektstatus",
    ],
    qualitativeBenefits: ["Färre missförstånd i överlämning", "Tydligare ansvar"],
  },
  {
    id: "bemanning",
    title: "Bemanning och planering",
    help: "Planering och omplanering av personal.",
    items: [
      {
        id: "bemanning.hours",
        volumeLabel: "Hur många timmar lägger arbetsledningen på bemanningsplanering varje vecka?",
        volumeUnit: "h/vecka",
        defaultVolume: 3,
        traditionalMinutes: 60,
        timeFlowMinutes: 30,
        calculationFrequency: "per_week",
        adjustUnitLabel: "min per angiven timme/vecka",
      },
    ],
    traditionalIncludes: [
      "Excel, kalendrar och whiteboard",
      "Telefonsamtal, SMS och e-post",
      "Manuell kontroll av tillgänglighet",
      "Återkommande omplanering",
    ],
    timeFlowIncludes: [
      "Visuell bemanningsplan",
      "Koppling mellan person, order och projekt",
      "Överblick över tillgänglighet",
      "Snabbare omplanering",
      "Tydligare arbetsfördelning",
      "Bättre kapacitetsöverblick",
    ],
    qualitativeBenefits: ["Mindre stress i planeringen", "Bättre nyttjandegrad"],
  },
  {
    id: "tid-material",
    title: "Tid och material",
    help: "Rapportering av tid och material från fält.",
    items: [
      {
        id: "tid.workers",
        volumeLabel: "Hur många arbetare ska rapportera tid och material?",
        volumeUnit: "arbetare",
        defaultVolume: 3,
        traditionalMinutes: 15,
        timeFlowMinutes: 7,
        calculationFrequency: "per_person_day",
        adjustUnitLabel: "min per arbetare/dag",
        syncFrom: "workers",
      },
    ],
    traditionalIncludes: [
      "Tidrapportering och rättning av tider",
      "Materialregistrering",
      "Kvitton",
      "Överföring till arbetsledning",
      "Kompletteringar från kontoret",
    ],
    timeFlowIncludes: [
      "Tid direkt mot rätt order eller projekt",
      "Material direkt mot rätt arbete",
      "Mobil rapportering",
      "Färre kompletteringar",
      "Bättre fakturaunderlag",
      "Bättre projektuppföljning",
    ],
    qualitativeBenefits: ["Mer korrekt underlag", "Snabbare attest"],
  },
  {
    id: "ata",
    title: "ÄTA-hantering",
    help: "Ändrings-, tilläggs- och avgående arbeten.",
    items: [
      {
        id: "ata.count",
        volumeLabel: "Hur många ÄTA-arbeten hanterar ni per månad?",
        volumeUnit: "ÄTA/mån",
        defaultVolume: 5,
        traditionalMinutes: 45,
        timeFlowMinutes: 20,
        calculationFrequency: "per_activity",
        adjustUnitLabel: "min per ÄTA",
      },
    ],
    traditionalIncludes: [
      "Beskriva arbetet",
      "Hitta underlag",
      "Ta och skicka bilder",
      "Skapa Word- eller PDF-dokument",
      "Skicka e-post och följa upp kunden",
      "Dokumentera godkännande",
      "Skapa fakturaunderlag",
    ],
    timeFlowIncludes: [
      "ÄTA direkt i projektet",
      "Bilder och dokument",
      "Pris och beskrivning",
      "Digitalt kundgodkännande",
      "Spårbar historik",
      "Koppling till fakturering",
      "Kundportal",
    ],
    qualitativeBenefits: [
      "Färre missade ÄTA",
      "Snabbare godkännande",
      "Bättre dokumentation",
      "Minskad risk för missförstånd och tvister",
    ],
  },
  {
    id: "dokument",
    title: "Dokument och kommunikation",
    help: "Att hitta rätt information, dokument och svar.",
    items: [
      {
        id: "dokument.people",
        volumeLabel:
          "Hur många personer behöver regelbundet hitta projektinformation, dokument eller svar på frågor?",
        volumeUnit: "personer",
        defaultVolume: 5,
        traditionalMinutes: 10,
        timeFlowMinutes: 5,
        calculationFrequency: "per_person_day",
        adjustUnitLabel: "min per person/dag",
        syncFrom: "totalUsers",
      },
    ],
    traditionalIncludes: [
      "Leta i SharePoint och mappar",
      "Söka i e-post",
      "Kontrollera rätt dokumentversion",
      "Ringa arbetsledaren eller skicka SMS",
      "Fråga vad som ska göras",
      "Skicka statusinformation till kunden",
    ],
    timeFlowIncludes: [
      "Dokument kopplade till rätt order eller projekt",
      "Arbetsbeskrivningar",
      "Ritningar och bilder",
      "Frågor och svar i rätt projekt",
      "Kunduppgifter och tidsplan",
      "Kundportal",
      "Samlad kommunikationshistorik",
    ],
    qualitativeBenefits: ["Mindre avbrott", "En version av sanningen"],
  },
  {
    id: "faktura",
    title: "Fakturering",
    help: "Från utfört arbete till klart fakturaunderlag.",
    items: [
      {
        id: "faktura.count",
        volumeLabel: "Hur många fakturaunderlag skapar ni per månad?",
        volumeUnit: "underlag/mån",
        defaultVolume: 20,
        traditionalMinutes: 30,
        timeFlowMinutes: 12,
        calculationFrequency: "per_activity",
        adjustUnitLabel: "min per fakturaunderlag",
      },
    ],
    traditionalIncludes: [
      "Samla in tider",
      "Kontrollera material",
      "Hitta ÄTA och kontrollera godkännanden",
      "Samla kvitton",
      "Kontrollera projektinformation",
      "Överföra uppgifter till ekonomisystem",
    ],
    timeFlowIncludes: [
      "Tid och material i projektet",
      "Godkända ÄTA",
      "Samlat fakturaunderlag",
      "AutoEkonomi-integration",
      "Färre manuella överföringar",
      "Snabbare kontroll och fakturering",
    ],
    qualitativeBenefits: [
      "Kortare tid från utfört arbete till fakturering",
      "Förbättrat kassaflöde",
      "Mindre kapitalbindning",
    ],
  },
  {
    id: "prognos",
    title: "Prognos och ekonomisk uppföljning",
    help: "Budget mot utfall och prognos per projekt.",
    items: [
      {
        id: "prognos.projects",
        volumeLabel: "Hur många aktiva projekt följer ni ekonomiskt varje månad?",
        volumeUnit: "projekt",
        defaultVolume: 5,
        traditionalMinutes: 90,
        timeFlowMinutes: 40,
        calculationFrequency: "per_project_month",
        adjustUnitLabel: "min per projekt/mån",
      },
    ],
    traditionalIncludes: [
      "Samla tid och material",
      "Kontrollera fakturering",
      "Uppdatera Excel",
      "Jämföra budget och utfall",
      "Beräkna återstående kostnad",
      "Skapa rapporter",
      "Sammanställa information från flera system",
    ],
    timeFlowIncludes: [
      "Budget mot utfall",
      "Intäkter och kostnader",
      "Återstående arbete och prognos",
      "Täckningsbidrag",
      "Projektets förväntade slutresultat",
      "Avvikelseanalys",
      "Bättre beslutsunderlag",
    ],
    qualitativeBenefits: [
      "Snabbare beslut",
      "Tidigare upptäckt av avvikelser",
      "Bättre kontroll över täckningsbidrag",
      "Bättre marginalstyrning",
      "Färre ekonomiska överraskningar",
    ],
  },
];

export interface ItemOverride {
  traditionalMinutes?: number;
  timeFlowMinutes?: number;
}

export interface ItemResult {
  item: TimeStudyItem;
  volume: number;
  traditionalMinutes: number;
  timeFlowMinutes: number;
  traditionalHours: number;
  timeFlowHours: number;
  savedHours: number;
}

export interface AreaResult {
  area: TimeStudyArea;
  items: ItemResult[];
  traditionalHours: number;
  timeFlowHours: number;
  savedHours: number;
}

export interface TimeStudyResult {
  areas: AreaResult[];
  traditionalHours: number;
  timeFlowHours: number;
  savedHours: number;
  savedHoursPerUser: number;
  savedDaysPerMonth: number;
  savedHoursPerYear: number;
}

export function computeItem(
  item: TimeStudyItem,
  volume: number,
  override?: ItemOverride,
): ItemResult {
  const trad = override?.traditionalMinutes ?? item.traditionalMinutes;
  const tf = override?.timeFlowMinutes ?? item.timeFlowMinutes;
  const mult = FREQUENCY_MULTIPLIER[item.calculationFrequency];
  const v = Math.max(0, volume);
  const traditionalHours = (v * trad * mult) / 60;
  const timeFlowHours = (v * tf * mult) / 60;
  return {
    item,
    volume: v,
    traditionalMinutes: trad,
    timeFlowMinutes: tf,
    traditionalHours,
    timeFlowHours,
    savedHours: Math.max(0, traditionalHours - timeFlowHours),
  };
}

export function computeTimeStudy(params: {
  selectedAreaIds: string[];
  volumes: Record<string, number>;
  overrides: Record<string, ItemOverride>;
  userCount: number;
}): TimeStudyResult {
  const { selectedAreaIds, volumes, overrides, userCount } = params;
  const areas: AreaResult[] = TIME_STUDY_AREAS.filter((a) =>
    selectedAreaIds.includes(a.id),
  ).map((area) => {
    const items = area.items.map((item) =>
      computeItem(item, volumes[item.id] ?? item.defaultVolume, overrides[item.id]),
    );
    return {
      area,
      items,
      traditionalHours: items.reduce((s, i) => s + i.traditionalHours, 0),
      timeFlowHours: items.reduce((s, i) => s + i.timeFlowHours, 0),
      savedHours: items.reduce((s, i) => s + i.savedHours, 0),
    };
  });

  const traditionalHours = areas.reduce((s, a) => s + a.traditionalHours, 0);
  const timeFlowHours = areas.reduce((s, a) => s + a.timeFlowHours, 0);
  const savedHours = Math.max(0, traditionalHours - timeFlowHours);
  const users = Math.max(1, userCount);

  return {
    areas,
    traditionalHours,
    timeFlowHours,
    savedHours,
    savedHoursPerUser: savedHours / users,
    savedDaysPerMonth: savedHours / 8,
    savedHoursPerYear: savedHours * 12,
  };
}

export const formatHours = (h: number) =>
  h.toLocaleString("sv-SE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
