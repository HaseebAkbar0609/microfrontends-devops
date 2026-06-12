import localizationConstants from "@/utils/translation/constants";

export const leadTabs = [
  { value: "granskning", labelKey: localizationConstants.reviewTab },
  { value: "bevakning", labelKey: localizationConstants.monitoringTab },
  { value: "hantering", labelKey: localizationConstants.handlingTab },
  { value: "accepterad", labelKey: localizationConstants.acceptedTab },
  { value: "betalda", labelKey: localizationConstants.paidTab },
  { value: "arkiv", labelKey: localizationConstants.archiveTab },
  { value: "settings", labelKey: localizationConstants.settings },
] as const;

export const filterOptions = ["all", "B2C", "B2B", "Express", "Hyra IN", "Hyra UT"] as const;

export const leadDetailTabs = [
  { value: "overview", labelKey: localizationConstants.overviewTab },
  { value: "request", labelKey: localizationConstants.requestTab },
  { value: "activity", labelKey: localizationConstants.activityTab },
  { value: "notes", labelKey: localizationConstants.notesTab },
] as const;

export const leadDetailCategoryOptions = [
  "Elektriker",
  "Bygg",
  "Tak",
  "Rör",
  "Trädgård",
  "Målare",
  "Snickeri",
  "Golvläggning",
] as const;

export const leadDetailRegionOptions = [
  "Stockholm",
  "Uppsala",
  "Göteborg",
  "Malmö",
  "Västerås",
  "Örebro",
  "Linköping",
  "Karlstad",
  "Umeå",
] as const;
