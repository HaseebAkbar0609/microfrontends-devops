import axios from "axios";
import type { TranslationKeys } from "@/utils/translation/constants";
import type { Command, Flow } from "./types";

export const WORKFLOW_PAGE_SIZE = 10;
export const REASON_LIMIT = 2000;
export const ARCHIVED_STATES = ["archived", "restore_requested"];
export const EDITABLE_APPROVAL = ["draft", "rejected", "changes_requested", "cancelled"];
export const EDITABLE_ARCHIVE = ["active", "restored", "archive_rejected"];
export const stateKeys: Record<string, TranslationKeys> = {
  active: "dwActive", archive_requested: "dwArchiveRequested", archived: "dwArchived", restore_requested: "dwRestoreRequested",
  restored: "dwRestored", archive_rejected: "dwArchiveRejected", draft: "dwDraft", submitted_for_approval: "dwSubmitted",
  in_review: "dwInReview", approved: "dwApproved", rejected: "dwRejected", changes_requested: "dwChangesRequested", cancelled: "dwCancelled",
};
export const commandKeys: Record<Command, TranslationKeys> = {
  request_archive: "dwRequestArchive", approve_archive: "dwApproveArchive", reject_archive: "dwRejectArchive", archive_immediately: "dwArchiveImmediately",
  request_restore: "dwRequestRestore", approve_restore: "dwApproveRestore", reject_restore: "dwRejectRestore", submit: "dwSubmit", start_review: "dwStartReview",
  approve: "dwApprove", reject: "dwReject", request_changes: "dwRequestChanges", cancel: "dwCancel", resubmit: "dwResubmit", revise: "dwRevise",
};
export const needsReason = (flow: Flow, command: Command) => flow === "archive" || command === "reject" || command === "request_changes";
export function workflowError(error: unknown): TranslationKeys {
  const response = axios.isAxiosError(error) ? error.response : undefined;
  const code = response?.data?.message;
  if (code === "WORKFLOW_REASON_REQUIRED") return "dwReasonRequired";
  if (code === "WORKFLOW_APPROVERS_MISSING") return "dwReviewersRequired";
  if (code === "WORKFLOW_VERSION_CONFLICT" || code === "WORKFLOW_ALREADY_EXISTS") return "dwConflict";
  return response?.status === 403 ? "dwForbidden" : response?.status === 409 || response?.status === 400 || response?.status === 422 ? "dwInvalid" : "dwLoadError";
}
