import type { RecordMeta } from "@/features/my-pages/shared/api";
import localizationConstants from "@/utils/translation/constants";

export type TimeEntryType = "order" | "project" | "overhead";
export type TravelUnit = "time" | "km";
export type WorkDayStatus = "pending" | "approved";
export interface TimeRow {
  id: string; start: string; end: string; type: TimeEntryType; refNr: string; projectName: string;
  ata: boolean; ataNr: string; travelUnit: TravelUnit; travelValue: string;
  allowance: boolean; title: string; description: string;
}
export interface WorkDay extends RecordMeta { date: string; status: WorkDayStatus; rows: TimeRow[] }
export const TIME_TYPE_KEY: Record<TimeEntryType, string> = {
  order: localizationConstants.timeTypeOrder, project: localizationConstants.timeTypeProject,
  overhead: localizationConstants.timeTypeOverhead,
};
export const TIME_TYPE_CLASS: Record<TimeEntryType, string> = {
  order: "bg-blue-600 text-white", project: "bg-slate-900 text-white", overhead: "bg-green-600 text-white",
};
export const ATA_BADGE_CLASS = "bg-red-600 text-white";
export const WORK_DAY_STATUS_KEY: Record<WorkDayStatus, string> = {
  pending: localizationConstants.timeStatusPending, approved: localizationConstants.timeStatusApproved,
};
export const WORK_DAY_STATUS_CLASS: Record<WorkDayStatus, string> = {
  pending: "border border-slate-300 bg-slate-50 text-slate-600", approved: "bg-green-50 text-green-600",
};
export const STANDARD_WORKDAY = { start: "07:00", end: "16:00", hours: 8 };
