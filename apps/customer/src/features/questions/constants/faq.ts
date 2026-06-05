export type FaqLanguage = "en" | "sv";

export type LocalizedText = {
  en: string;
  sv: string;
};

export type FaqCategory =
  | "offert"
  | "hitta-konsult"
  | "aktiva-projekt"
  | "arkiverade-projekt"
  | "kostnadskalkylator"
  | "inspiration"
  | "erbjudanden"
  | "sakerhet-konto";

export type FaqItem = {
  question: LocalizedText;
  answer: LocalizedText;
  category: FaqCategory;
};

export const FAQ_CATEGORY_OPTIONS = [
  {
    label: {
      en: "Quote & Find Tradespeople",
      sv: "Offert & Hitta Hantverkare",
    },
    value: "offert",
  },
  {
    label: { en: "Find Consultant", sv: "Hitta Konsult" },
    value: "hitta-konsult",
  },
  {
    label: { en: "Active Projects", sv: "Aktiva Projekt" },
    value: "aktiva-projekt",
  },
  {
    label: { en: "Archived Projects", sv: "Arkiverade Projekt" },
    value: "arkiverade-projekt",
  },
  {
    label: { en: "Cost Calculator", sv: "Kostnadskalkylator" },
    value: "kostnadskalkylator",
  },
  { label: { en: "Inspiration", sv: "Inspiration" }, value: "inspiration" },
  { label: { en: "Offers", sv: "Erbjudanden" }, value: "erbjudanden" },
  {
    label: { en: "Security & Account", sv: "Säkerhet & Konto" },
    value: "sakerhet-konto",
  },
] satisfies { label: LocalizedText; value: FaqCategory }[];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: {
      en: "What happens when I accept a quote?",
      sv: "Vad händer när jag accepterar en offert?",
    },
    answer: {
      en: "When you choose a tradesperson, the project is automatically moved to Active Projects. There you get access to tools for following the project's progress.",
      sv: "När du väljer en hantverkare flyttas projektet automatiskt till Aktiva Projekt. Där får du tillgång till verktyg för att följa hela projektets utveckling.",
    },
    category: "aktiva-projekt",
  },
  {
    question: {
      en: "What can I do in Active Projects?",
      sv: "Vad kan jag göra i Aktiva Projekt?",
    },
    answer: {
      en: "You can follow schedules, manage budgets, approve change orders, upload documents, create agreements with BankID, communicate with contractors and more.",
      sv: "Du kan bland annat följa tidplaner, hantera budget och kostnader, godkänna ÄTA-arbeten, ladda upp dokument, skapa digitala avtal med BankID och kommunicera med entreprenören.",
    },
    category: "aktiva-projekt",
  },
  {
    question: {
      en: "Can I follow the project on mobile?",
      sv: "Kan jag följa projektet i mobilen?",
    },
    answer: {
      en: "Yes. Through TimeFlow Home you can access project information from your mobile device.",
      sv: "Ja. Via TimeFlow Home får du tillgång till projektets information direkt i mobilen, var du än befinner dig.",
    },
    category: "aktiva-projekt",
  },
  {
    question: { en: "What is a change order (ÄTA)?", sv: "Vad är ÄTA?" },
    answer: {
      en: "ÄTA stands for changes, additions and deductions to the original scope of work.",
      sv: "ÄTA står för Ändrings-, Tilläggs- och Avgående arbeten. Om projektets omfattning förändras kan entreprenören skicka ett ÄTA-förslag som du får granska och godkänna.",
    },
    category: "aktiva-projekt",
  },

  {
    question: {
      en: "What are Archived Projects?",
      sv: "Vad är Arkiverade Projekt?",
    },
    answer: {
      en: "Completed projects can be moved to the archive where documentation and history are stored.",
      sv: "När ett projekt är avslutat kan det flyttas till arkivet. Där sparas dokumentation och historik för framtida behov.",
    },
    category: "arkiverade-projekt",
  },
  {
    question: {
      en: "Why archive projects?",
      sv: "Varför är det bra att arkivera projekt?",
    },
    answer: {
      en: "Archived information can be useful for home sales, insurance claims, warranties and future renovations.",
      sv: "Du får full spårbarhet över utfört arbete, avtal, dokument och kommunikation. Informationen kan vara värdefull vid bostadsförsäljning, försäkringsärenden och garantifrågor.",
    },
    category: "arkiverade-projekt",
  },
  {
    question: {
      en: "How long are projects stored?",
      sv: "Hur länge sparas mina projekt?",
    },
    answer: {
      en: "You decide whether information should remain stored. We periodically ask for confirmation in accordance with GDPR.",
      sv: "Du bestämmer själv om informationen ska finnas kvar. För att följa GDPR skickar vi regelbundet en bekräftelseförfrågan där du kan godkänna fortsatt lagring.",
    },
    category: "arkiverade-projekt",
  },

  {
    question: {
      en: "What is the Cost Calculator?",
      sv: "Vad är Kostnadskalkylatorn?",
    },
    answer: {
      en: "The Cost Calculator helps estimate costs for common construction and renovation projects.",
      sv: "Kostnadskalkylatorn hjälper dig att uppskatta kostnader för vanliga bygg- och renoveringsprojekt.",
    },
    category: "kostnadskalkylator",
  },
  {
    question: {
      en: "What projects can I estimate?",
      sv: "Vilka projekt kan jag beräkna?",
    },
    answer: {
      en: "Examples include bathrooms, kitchens, extensions, decks, roofing, painting and flooring.",
      sv: "Exempelvis badrumsrenovering, köksrenovering, tillbyggnad, altan, takbyte, målningsarbeten och golvläggning.",
    },
    category: "kostnadskalkylator",
  },
  {
    question: {
      en: "Are the calculations exact?",
      sv: "Är kalkylerna exakta?",
    },
    answer: {
      en: "No. Estimates are indicative and based on typical market prices.",
      sv: "Nej. Kalkylerna är vägledande och baseras på normala marknadspriser.",
    },
    category: "kostnadskalkylator",
  },
  {
    question: {
      en: "Can I use it for budgeting?",
      sv: "Kan jag använda kalkylatorn för att sätta min budget?",
    },
    answer: {
      en: "Yes. It is designed to provide a realistic estimate for planning project finances.",
      sv: "Ja. Kalkylatorn är utformad för att ge en realistisk uppskattning och hjälpa dig planera projektets ekonomi.",
    },
    category: "kostnadskalkylator",
  },

  {
    question: { en: "What is Inspiration?", sv: "Vad är Inspiration?" },
    answer: {
      en: "A collection of articles, guides, ideas and tips related to construction and renovation.",
      sv: "Här hittar du artiklar, guider, idéer och tips kring renovering, byggprojekt, energieffektivisering och smarta lösningar för hemmet.",
    },
    category: "inspiration",
  },
  {
    question: {
      en: "Does Inspiration cost anything?",
      sv: "Kostar det något att använda Inspirationsdelen?",
    },
    answer: {
      en: "No. All content is available to registered users at no extra cost.",
      sv: "Nej. Allt innehåll är tillgängligt för registrerade användare utan extra kostnad.",
    },
    category: "inspiration",
  },
  {
    question: {
      en: "Can I get ideas for my project?",
      sv: "Kan jag få idéer inför mitt projekt?",
    },
    answer: {
      en: "Yes. Inspiration helps you discover solutions, materials and ideas before requesting quotes.",
      sv: "Absolut. Inspiration är skapad för att hjälpa dig hitta lösningar, materialval och idéer innan du tar in offerter.",
    },
    category: "inspiration",
  },

  {
    question: { en: "What are Offers?", sv: "Vad är Erbjudanden?" },
    answer: {
      en: "Users gain access to discounts and offers from TimeFlow partners.",
      sv: "Som användare i TimeFlow får du tillgång till rabatter och erbjudanden från våra samarbetspartners.",
    },
    category: "erbjudanden",
  },
  {
    question: {
      en: "How do I use the discounts?",
      sv: "Hur tar jag del av rabatterna?",
    },
    answer: {
      en: "Discounts may be redeemed through discount codes, QR codes or partner identification.",
      sv: "Rabatterna kan användas genom rabattkod, QR-kod eller genom att identifiera dig som TimeFlow-användare hos våra partners.",
    },
    category: "erbjudanden",
  },
  {
    question: {
      en: "What kinds of offers exist?",
      sv: "Vilka typer av erbjudanden finns?",
    },
    answer: {
      en: "Examples include building materials, kitchens, bathrooms, tools, insurance and energy solutions.",
      sv: "Exempelvis byggmaterial, kök och badrum, verktyg, inredning, försäkringar, konsulttjänster och energilösningar.",
    },
    category: "erbjudanden",
  },
  {
    question: {
      en: "Will more offers be added?",
      sv: "Kommer det fler erbjudanden?",
    },
    answer: {
      en: "Yes. We continuously negotiate new discounts and benefits.",
      sv: "Ja. Vi arbetar kontinuerligt med att förhandla fram nya rabatter och bättre villkor för våra användare.",
    },
    category: "erbjudanden",
  },

  {
    question: { en: "Is my data secure?", sv: "Är min data säker?" },
    answer: {
      en: "Yes. Security and privacy are core parts of TimeFlow.",
      sv: "Ja. Säkerhet och dataskydd är centrala delar av TimeFlow. Kommunikation sker krypterat och endast behöriga personer har tillgång till informationen.",
    },
    category: "sakerhet-konto",
  },
  {
    question: {
      en: "Where is my information stored?",
      sv: "Var lagras min information?",
    },
    answer: {
      en: "Customer data is stored in secure modern datacenters with backup and monitoring.",
      sv: "All kunddata lagras inom moderna och säkra datacenter med hög säkerhetsnivå, regelbunden backup och kontinuerlig övervakning.",
    },
    category: "sakerhet-konto",
  },
  {
    question: {
      en: "What happens if I close my account?",
      sv: "Vad händer om jag stänger mitt konto?",
    },
    answer: {
      en: "Your information is retained for up to 6 months before permanent deletion.",
      sv: "Om du avslutar ditt konto sparas informationen i upp till 6 månader. Därefter raderas informationen permanent enligt våra rutiner.",
    },
    category: "sakerhet-konto",
  },
  {
    question: {
      en: "Can I use TimeFlow in other countries?",
      sv: "Kan jag använda TimeFlow i andra länder?",
    },
    answer: {
      en: "Not currently. TimeFlow is presently focused on the Swedish market.",
      sv: "Inte idag. TimeFlow är för närvarande anpassat för den svenska marknaden.",
    },
    category: "sakerhet-konto",
  },
  {
    question: {
      en: "Do I need to download an app?",
      sv: "Behöver jag ladda ner någon app?",
    },
    answer: {
      en: "No. TimeFlow works in the browser, but a mobile app is also available.",
      sv: "Nej. Du kan använda TimeFlow direkt i webbläsaren. För en ännu bättre upplevelse finns även appen TimeFlow Home.",
    },
    category: "sakerhet-konto",
  },
];
