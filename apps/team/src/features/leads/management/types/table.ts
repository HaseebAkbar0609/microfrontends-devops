import type { TranslationKeys } from "@/utils/translation/constants";
import type {
	AcceptedLeadRow,
	ArchiveLeadRow,
	HandlingLeadRow,
	LeadRow,
	MonitoringLeadRow,
	PaidLeadRow,
} from "@/features/leads/types";

export type LeadManagementRow =
	| LeadRow
	| MonitoringLeadRow
	| HandlingLeadRow
	| AcceptedLeadRow
	| PaidLeadRow
	| ArchiveLeadRow;

export type LeadTableCell =
	| {
			kind: "text" | "strong";
			value: string;
	  }
	| {
			kind: "pill";
			value: string;
			suffixKey?: TranslationKeys;
	  }
	| {
			kind: "status";
			valueKey: TranslationKeys;
	  };
