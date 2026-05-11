import localizationConstants from "@/utils/translation/constants";
import type {
  CategoryItem,
  LeadSettingsTabItem,
  PermissionRole,
  ReminderRule,
  RoutingRule,
  ScheduleDay,
  StageSection,
} from "@/features/leads/settings/types";

export const leadSettingsTabs: LeadSettingsTabItem[] = [
  { value: "pipeline", labelKey: localizationConstants.leadSettingsPipelineStagesTab },
  { value: "categories", labelKey: localizationConstants.leadSettingsCategoriesTab },
  { value: "routing", labelKey: localizationConstants.leadSettingsRoutingRulesTab },
  { value: "notifications", labelKey: localizationConstants.leadSettingsNotificationsTab },
  { value: "permissions", labelKey: localizationConstants.leadSettingsPermissionsTab },
];

const defaultSchedule: ScheduleDay[] = [
  { id: "mon", labelKey: localizationConstants.mondayLabel, time: "08:00" },
  { id: "tue", labelKey: localizationConstants.tuesdayLabel, time: "08:00" },
  { id: "wed", labelKey: localizationConstants.wednesdayLabel, time: "08:00" },
  { id: "thu", labelKey: localizationConstants.thursdayLabel, time: "08:00" },
  { id: "fri", labelKey: localizationConstants.fridayLabel, time: "08:00" },
];

export const stageSections: StageSection[] = [
  {
    id: "review",
    titleKey: localizationConstants.reviewStageTitle,
    subtitleKey: localizationConstants.reviewStageSubtitle,
    schedule: defaultSchedule,
  },
  {
    id: "monitor",
    titleKey: localizationConstants.monitorStageTitle,
    subtitleKey: localizationConstants.monitorStageSubtitle,
    schedule: defaultSchedule,
  },
];

export const categoryItems: CategoryItem[] = [
  { id: "builder", nameKey: localizationConstants.categoryBuilder, isActive: true },
  { id: "electrician", nameKey: localizationConstants.categoryElectrician, isActive: true },
  { id: "painter", nameKey: localizationConstants.categoryPainter, isActive: true },
  { id: "plumbing", nameKey: localizationConstants.categoryPlumbing, isActive: true },
  { id: "roofer", nameKey: localizationConstants.categoryRoofer, isActive: true },
  { id: "cleaning", nameKey: localizationConstants.categoryCleaningCompany, isActive: true },
];

export const routingRules: RoutingRule[] = [
  { id: "category-region", labelKey: localizationConstants.matchByCategoryRegion, checked: false },
  { id: "company-rating", labelKey: localizationConstants.considerCompanyRating, checked: false },
  { id: "response-rate", labelKey: localizationConstants.prioritizeByResponseRate, checked: false },
];

export const reminderRules: ReminderRule[] = [
  { id: "watch-48", labelKey: localizationConstants.reminderWatch48Hours, checked: false },
  { id: "notify-owner", labelKey: localizationConstants.notifyOwnerNewLead, checked: false },
];

export const reshipmentOptions = [
  { value: "7", labelKey: localizationConstants.daysOption7 },
  { value: "14", labelKey: localizationConstants.daysOption14 },
  { value: "21", labelKey: localizationConstants.daysOption21 },
];

export const permissionRoles: PermissionRole[] = [
  {
    id: "support",
    labelKey: localizationConstants.roleSupport,
    canView: true,
    canEdit: true,
    canDelete: true,
  },
  {
    id: "sales",
    labelKey: localizationConstants.roleSales,
    canView: true,
    canEdit: true,
    canDelete: true,
  },
  {
    id: "manager",
    labelKey: localizationConstants.roleManager,
    canView: true,
    canEdit: true,
    canDelete: true,
  },
  {
    id: "admin",
    labelKey: localizationConstants.roleAdmin,
    canView: false,
    canEdit: false,
    canDelete: false,
  },
];
