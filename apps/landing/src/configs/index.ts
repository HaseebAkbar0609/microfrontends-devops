export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

interface HeaderMenuStateType {
  label: string;
  path: string;
}

export const HeaderMenu: Record<string, HeaderMenuStateType[]> = {
  professional: [
    { label: "Varför TimeFlow", path: "/professional/#" },
    { label: "Moduler", path: "/professional/#" }, // Dropdown handled in Header
    { label: "Branscher", path: "/professional/#" },
    { label: "Prissättning", path: "/professional/pricing" },
    { label: "Om oss", path: "/professional/about-us" },
    { label: "Boka en demo",path: "/professional/book_a_demo" },
    { label: "Se systemet", path: "/professional/system-overview" },
    // { label: "On-demand Webinar", path: "/professional/on_demand_webinar" },
  ],
  "professional-landing": [
    { label: "Om oss", path: "/professional/about-us" },
    { label: "Nyheter", path: "/professional/newsroom" },
    { label: "Kontakta oss", path: "/professional-landing/#contact" },
  ],
  consumer: [
    { label: "Hitta hantverkare", path: "/consumer/#" },
    { label: "Projektverktyg", path: "/consumer/project-tools" },
    { label: "Kvalitetssäkring", path: "/consumer/quality-assurance" },
    { label: "AI-Hantverkaren", path: "/consumer/#" },
    { label: "Om Oss", path: "/consumer/about-us" },
  ],
  "consumer-landing": [
    { label: "Hitta hantverkare", path: "/consumer/#industries" },
    { label: "Nyheter", path: "/consumer-landing/#" },
    { label: "Kontakta Oss", path: "/consumer-landing/#contact-us" },
  ],
};

export const months: Record<string, string> = {
  "01": "JANUARI",
  "02": "FEBRUARI",
  "03": "MARS",
  "04": "APRIL",
  "05": "MAJ",
  "06": "JUNI",
  "07": "JULI",
  "08": "AUGUSTI",
  "09": "SEPTEMBER",
  "10": "OKTOBER",
  "11": "NOVEMBER",
  "12": "DECEMBER",
};

interface FooterMenuStateType {
  label: string;
  path?: string;
}

export const FooterMenu: Record<string, Record<string, FooterMenuStateType[]>> = {
  professional: {
    TimeFlow: [
      { label: "Moduler", path: "/#smart-features"},
      { label: "APP TimeFlow Work", path: "AppWork" },
      { label: "Prissättning", path: "pricing" },
      { label: "Funktioner",  path: "/#smart-features"},
      { label: "Jämför projektverktyg",  path: "comparison" },
    ],
    Företag: [
      { label: "Om oss", path: "about-us" },
      { label: "Kontakta oss" , path: "/#contact"},
      { label: "Support", path: "support" },
      { label: "Nyhetsrum", path: "newsroom" },
      { label: "Cookies", path: "cookie" },
      { label: "Intergritetspolicy", path: "terms" },
    ],
    Resurser: [
      { label: "Kunskap", path: "kunskap" },
      { label: "Nyhetsbrev" },
      { label: "Varför TimeFlow", path: "cases" },
      { label: "FAQ", path: "faq" },
      { label: "Se systemet",path: "system-overview"},
      { label: "Boka demo", path: "book_a_demo" },
      // { label: "On Demand Webinar",path: "on_demand_webinar"},
    ],
    "Få hjälp inom": [
      { label: "Bygg & Betong", path: "Construction_Concrete" },
      { label: "Mark & Schakt", path: "Land_Excavation" },
      { label: "Tak & Fasad", path: "Yes_Fasad" },
      { label: "Installationer", path: "Installations" },
      { label: "Beläggning", path: "Coating" },
      { label: "Städ & Underhåll", path: "Cleaning_Maintenance"},
      { label: "Konsult & Arkitekt", path: "Consultant_Architect" },
      { label: "Specialföretag ", path: "Special_Company" },
    ],
  },
  consumer: {
    "TimeFlow för konsument": [
      { label: "Hitta hantverkare nära dig" },
      { label: "Få offert" },
      { label: "App TimeFlow HOME" },
      { label: "Projektverktyg" },
    ],
    Företag: [
      { label: "Om oss", path: "about-us" },
      { label: "Kundservice" },
      { label: "Om Cookies" },
      { label: "Användarvillkor" },
      { label: "Intergritetspolicy" },
    ],
    Resurser: [
      { label: "Inspiration" },
      { label: "Nyhetsbrev" },
      { label: "Al-hantverkaren" },
      { label: "FAQ", path: "faq" },
    ],
    "Få hjälp inom": [
      { label: "Bygg & Betong", path:"construction-concrete" },
      { label: "Mark & Schakt",path:"land-excavation" },
      { label: "Tak & Fasad" , path:"yes-fasad"},
      { label: "Installationer", path:"installations" },
      { label: "Beläggning", path:"coating" },
      { label: "Städ & Underhåll", path:"cleaning-maintenance" },
      { label: "Konsult & Arkitekt", path:"consultant-architect" },
      { label: "Specialföretag", path:"special-company" },
    ],
  },
}; 