export interface Discount {
  id: string;
  supplier: string;
  category: string;
  title: string;
  description: string;
  discountPct: number;
  brandInitials: string;
}

export const DISCOUNT_SUPPLIERS = [
  "Byggmax",
  "Hornbach",
  "Biltema",
  "K-rauta",
  "Bauhaus",
  "Colorama",
] as const;

export const DISCOUNT_CATEGORIES = [
  "Bygg",
  "Badrum",
  "El",
  "VVS",
  "Kök",
] as const;

export const DUMMY_DISCOUNTS: Discount[] = [
  {
    id: "1",
    supplier: "Byggmax",
    category: "Bygg",
    title: "Frys",
    description:
      "Räkna med att renoveringen tar längre tid och kostar mer än vad du initialt tänkt. Planera en buffert för både tid och pengar.",
    discountPct: 25,
    brandInitials: "BM",
  },
  {
    id: "2",
    supplier: "Hornbach",
    category: "Badrum",
    title: "Badrumskakel",
    description:
      "Ge ditt badrum ett nytt utseende med moderna kakelplattor i olika stilar och färger som passar alla hem.",
    discountPct: 15,
    brandInitials: "HB",
  },
  {
    id: "3",
    supplier: "Biltema",
    category: "El",
    title: "Elinstallation",
    description:
      "Spara pengar på din elinstallation med certifierade elektriker och högkvalitativa material till reducerat pris.",
    discountPct: 20,
    brandInitials: "BT",
  },
  {
    id: "4",
    supplier: "K-rauta",
    category: "VVS",
    title: "VVS-rör",
    description:
      "Komplett sortiment av VVS-rör och kopplingar för ditt renoveringsprojekt till marknadens bästa pris.",
    discountPct: 30,
    brandInitials: "KR",
  },
  {
    id: "5",
    supplier: "Bauhaus",
    category: "Kök",
    title: "Köksbänk",
    description:
      "Uppgradera ditt kök med en stilren och hållbar köksbänk i rostfritt stål eller laminat.",
    discountPct: 10,
    brandInitials: "BH",
  },
  {
    id: "6",
    supplier: "Colorama",
    category: "Bygg",
    title: "Målarfärg",
    description:
      "Förnya ditt hem med våra prisvärda målarfärger i ett brett urval av nyanser och finish.",
    discountPct: 18,
    brandInitials: "CL",
  },
  {
    id: "7",
    supplier: "Hornbach",
    category: "Bygg",
    title: "Isolering",
    description:
      "Energieffektivisera ditt hem med kvalitetsisolering som håller värmen inne och minskar energiförbrukningen.",
    discountPct: 22,
    brandInitials: "HB",
  },
  {
    id: "8",
    supplier: "K-rauta",
    category: "El",
    title: "LED-belysning",
    description:
      "Byt till energisnål LED-belysning och sänk din elräkning med upp till 80% jämfört med glödlampor.",
    discountPct: 35,
    brandInitials: "KR",
  },
];
