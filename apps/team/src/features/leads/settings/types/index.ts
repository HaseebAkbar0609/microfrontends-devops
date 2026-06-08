import type { TranslationKeys } from "@/utils/translation/constants";

export type LeadSettingsTabValue =
  | "pipeline"
  | "categories"
  | "routing"
  | "notifications"
  | "permissions";

export type LeadSettingsTabItem = {
  value: LeadSettingsTabValue;
  labelKey: TranslationKeys;
};

export type ScheduleDay = {
  id: string;
  labelKey: TranslationKeys;
  time: string;
};

export type StageSection = {
  id: string;
  titleKey: TranslationKeys;
  subtitleKey: TranslationKeys;
  schedule: ScheduleDay[];
};

export type CategoryItem = {
  id: string;
  nameKey: string;
  isActive: boolean;
};

export type RoutingRule = {
  id: string;
  labelKey: TranslationKeys;
  checked: boolean;
};

export type ReminderRule = {
  id: string;
  labelKey: TranslationKeys;
  checked: boolean;
};

export type PermissionRole = {
  id: string;
  labelKey: TranslationKeys;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
};
