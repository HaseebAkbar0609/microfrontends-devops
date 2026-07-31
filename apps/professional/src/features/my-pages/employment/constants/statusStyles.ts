import { DocumentStatus, LeaveStatus } from "./mockData";

export const LEAVE_STATUS_CLASS: Record<LeaveStatus, string> = {
	review: "text-amber-600",
	approved: "text-green-600",
	rejected: "text-red-600",
};

export const DOCUMENT_STATUS_CLASS: Record<DocumentStatus, string> = {
	read: "bg-amber-50 text-amber-600",
	needsSign: "bg-blue-50 text-blue-600",
	notOpened: "text-slate-600",
	signed: "bg-green-50 text-green-600",
};
