import localizationConstants from "@/utils/translation/constants";
import type { RecordMeta } from "../../shared/api";

export const EMPLOYMENT_TAB_IDS = ["contract", "sickReport", "leave", "payslip", "documents"] as const;
export type EmploymentTabId = (typeof EMPLOYMENT_TAB_IDS)[number];
export const EMPLOYMENT_TABS = [
  { id: "contract", label: localizationConstants.myPagesEmpTabContract },
  { id: "sickReport", label: localizationConstants.myPagesEmpTabSickReport },
  { id: "leave", label: localizationConstants.myPagesEmpTabLeave },
  { id: "payslip", label: localizationConstants.myPagesEmpTabPayslip },
  { id: "documents", label: localizationConstants.myPagesEmpTabDocuments },
] as const;
export type LeaveStatus = "review" | "approved" | "rejected";
export type Absence = RecordMeta & {
  type: "sick" | "vab" | "leave";
  startDate: string; endDate: string | null; message: string; status: LeaveStatus;
};
export const LEAVE_STATUS_KEY: Record<LeaveStatus, string> = {
  review: localizationConstants.myPagesEmpStatusReview,
  approved: localizationConstants.myPagesEmpStatusApproved,
  rejected: localizationConstants.myPagesEmpStatusRejected,
};
export const ABSENCE_TYPE_KEY: Record<Absence["type"], string> = {
  sick: localizationConstants.myPagesEmpTypeSick,
  vab: localizationConstants.myPagesEmpTypeVab,
  leave: localizationConstants.myPagesEmpTabLeave,
};
export type EmploymentDocument = {
  id: string; kind: "contract" | "payslip" | "document";
  title: string; fileName: string; version: string; period: string | null;
  requiresAcknowledgement: boolean; acknowledgedAt: number | null; readAt: number | null; createdAt: number;
};
