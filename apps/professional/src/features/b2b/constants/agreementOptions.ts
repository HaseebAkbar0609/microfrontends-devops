// Static UI option lists for the Create Agreement form (template catalog
// entries, standard attachment tags) -- not business records, so unlike
// agreementMock.ts these aren't backend-sourced data and don't need an API.
// No template-file repository exists anywhere in this codebase; these are
// checklist labels, not files the "Ladda ner mallar" action can actually
// produce yet (see the API contract doc's Milestone 6 notes).

export const B2B_AVAILABLE_TEMPLATES = [
  { id: "tmpl-1", label: "Document 1.pdf", type: "pdf" as const, namn: "Standardavtal ABT 06" },
  { id: "tmpl-2", label: "Document 2.doc", type: "doc" as const, namn: "Underentreprenad Mall" },
  { id: "tmpl-3", label: "Kvalitetsplan.pdf", type: "pdf" as const, namn: "Kvalitetskontroll Mall" },
];

export const B2B_STANDARD_ATTACHMENTS = [
  "Document 1",
  "Document 2",
  "Allmänna bestämmelser ABT 06",
  "Miljö- och arbetsmiljöplan",
  "Kvalitetsplan & Kontrollprogram",
  "Tidplan & Leveransvillkor",
  "Ritningsförteckning",
  "ÄTA-rutin och prislista",
];
