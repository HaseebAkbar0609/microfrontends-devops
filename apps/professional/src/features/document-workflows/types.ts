export type Flow = "archive" | "approval";
export type ArchiveCommand = "request_archive" | "approve_archive" | "reject_archive" | "archive_immediately" | "request_restore" | "approve_restore" | "reject_restore";
export type ApprovalCommand = "submit" | "start_review" | "approve" | "reject" | "request_changes" | "cancel" | "resubmit" | "revise";
export type Command = ArchiveCommand | ApprovalCommand;
export interface ArchivePolicy { allow_immediate: boolean; restore_after: number | null; restore_before: number | null }
export interface ApprovalPolicy { approver_ids: string[]; required_approvals: number; allow_self_approval: boolean; publish_on_approval: boolean }
export interface Workflow<P> { id: string; state: string; version: number; policy: P; cycle?: number; submitted_by?: string | null }
export interface WorkflowContext {
  actor_id: string; can_manage: boolean; eligible_approvers: { id: string; name: string }[];
  archive: Workflow<ArchivePolicy> | null; approval: Workflow<ApprovalPolicy> | null;
  approved_count: number; allowed_commands: { archive: ArchiveCommand[]; approval: ApprovalCommand[] };
}
export interface HistoryEvent { id: string; actor_id: string; command: string; previous_state: string | null; new_state: string; occurred_at: number; reason: string; version: number }
export interface HistoryPage { items: HistoryEvent[]; page: number; page_size: number; total: number }
export interface Target { id: string; projectId: string; name: string; fileUrl: string | null }
export type Write = { flow: Flow; command?: Command; policy?: ArchivePolicy | ApprovalPolicy; reason?: string };
