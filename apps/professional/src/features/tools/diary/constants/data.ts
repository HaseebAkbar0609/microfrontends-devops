import type { RecordMeta } from "@/features/my-pages/shared/api";
import localizationConstants from "@/utils/translation/constants";

export interface DiaryEntry extends RecordMeta {
  date: string; title: string; projectName: string; description: string; read: boolean;
}
export const MONTH_KEYS = [
  localizationConstants.monthJanuary, localizationConstants.monthFebruary, localizationConstants.monthMarch,
  localizationConstants.monthApril, localizationConstants.monthMay, localizationConstants.monthJune,
  localizationConstants.monthJuly, localizationConstants.monthAugust, localizationConstants.monthSeptember,
  localizationConstants.monthOctober, localizationConstants.monthNovember, localizationConstants.monthDecember,
] as const;
export const WEEKDAY_KEYS = [
  localizationConstants.weekdayShortSun, localizationConstants.weekdayShortMon, localizationConstants.weekdayShortTue,
  localizationConstants.weekdayShortWed, localizationConstants.weekdayShortThu, localizationConstants.weekdayShortFri,
  localizationConstants.weekdayShortSat,
] as const;
