import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type {
	AcceptedLeadRow,
	ArchiveLeadRow,
	HandlingLeadRow,
	LeadRow,
	LeadStatus,
	MonitoringLeadRow,
	PaidLeadRow,
} from "@/features/leads/types";
import type {
	LeadManagementRow,
	LeadTableCell,
} from "@/features/leads/management/types";

type LeadCollections = {
	granskning: LeadRow[];
	bevakning: MonitoringLeadRow[];
	hantering: HandlingLeadRow[];
	accepterad: AcceptedLeadRow[];
	betalda: PaidLeadRow[];
	arkiv: ArchiveLeadRow[];
};

type LeadTableConfig = {
	titleKey: TranslationKeys;
	headerKeys: TranslationKeys[];
	columnCount: number;
	isSelectable: boolean;
	showCreateButton: boolean;
	showResendButton: boolean;
};

const LEAD_TABLE_CONFIG: Record<LeadStatus, LeadTableConfig> = {
	granskning: {
		titleKey: localizationConstants.leadsReviewTitle,
		headerKeys: [
			localizationConstants.statusLabel,
			localizationConstants.dateLabel,
			localizationConstants.leadIdLabel,
			localizationConstants.customerLabel,
			localizationConstants.typeLabel,
			localizationConstants.categoryLabel,
			localizationConstants.cityLabel,
			localizationConstants.matchesLabel,
		],
		columnCount: 9,
		isSelectable: false,
		showCreateButton: true,
		showResendButton: false,
	},
	bevakning: {
		titleKey: localizationConstants.leadsMonitoringTitle,
		headerKeys: [
			localizationConstants.dateLabel,
			localizationConstants.leadIdLabel,
			localizationConstants.customerLabel,
			localizationConstants.typeLabel,
			localizationConstants.categoryLabel,
			localizationConstants.cityLabel,
			localizationConstants.matchesLabel,
			localizationConstants.tagsLabel,
		],
		columnCount: 10,
		isSelectable: true,
		showCreateButton: false,
		showResendButton: true,
	},
	hantering: {
		titleKey: localizationConstants.leadsHandlingTitle,
		headerKeys: [
			localizationConstants.dateLabel,
			localizationConstants.leadIdLabel,
			localizationConstants.customerLabel,
			localizationConstants.typeLabel,
			localizationConstants.categoryLabel,
			localizationConstants.cityLabel,
			localizationConstants.matchesLabel,
			localizationConstants.tagsLabel,
			localizationConstants.repeatLabel,
		],
		columnCount: 10,
		isSelectable: true,
		showCreateButton: false,
		showResendButton: false,
	},
	accepterad: {
		titleKey: localizationConstants.leadsAcceptedTitle,
		headerKeys: [
			localizationConstants.acceptedDateLabel,
			localizationConstants.leadIdLabel,
			localizationConstants.customerLabel,
			localizationConstants.supplierLabel,
			localizationConstants.typeLabel,
			localizationConstants.categoryLabel,
			localizationConstants.cityLabel,
			localizationConstants.offerLabel,
			localizationConstants.commissionLabel,
			localizationConstants.reminderLabel,
			localizationConstants.statusLabel,
		],
		columnCount: 12,
		isSelectable: false,
		showCreateButton: false,
		showResendButton: false,
	},
	betalda: {
		titleKey: localizationConstants.leadsPaidTitle,
		headerKeys: [
			localizationConstants.acceptedDateLabel,
			localizationConstants.leadIdLabel,
			localizationConstants.customerLabel,
			localizationConstants.supplierLabel,
			localizationConstants.cityLabel,
			localizationConstants.commissionLabel,
			localizationConstants.paymentDateLabel,
		],
		columnCount: 8,
		isSelectable: false,
		showCreateButton: false,
		showResendButton: false,
	},
	arkiv: {
		titleKey: localizationConstants.leadsArchiveTitle,
		headerKeys: [
			localizationConstants.dateLabel,
			localizationConstants.leadIdLabel,
			localizationConstants.customerLabel,
			localizationConstants.typeLabel,
			localizationConstants.categoryLabel,
			localizationConstants.cityLabel,
			localizationConstants.tagsLabel,
		],
		columnCount: 9,
		isSelectable: true,
		showCreateButton: true,
		showResendButton: false,
	},
};

export const LEAD_PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

export function getLeadRowsForTab(
	activeTab: LeadStatus,
	collections: LeadCollections
) {
	return collections[activeTab];
}

export function getLeadTableConfig(
	activeTab: LeadStatus,
	translate: (key: TranslationKeys) => string
) {
	const config = LEAD_TABLE_CONFIG[activeTab];

	return {
		...config,
		headers: config.headerKeys.map(translate),
	};
}

export function filterLeadRows(
	rows: LeadManagementRow[],
	searchQuery: string,
	typeFilter: string
) {
	const query = searchQuery.trim().toLowerCase();

	return rows.filter((row) => {
		const rowType = "type" in row ? row.type : null;
		const matchesType =
			typeFilter === "all" || (rowType ? rowType === typeFilter : false);
		const matchesSearch =
			query.length === 0 || getSearchableValues(row).some((value) => value.includes(query));

		return matchesType && matchesSearch;
	});
}

function getSearchableValues(row: LeadManagementRow) {
	const values = [
		"date" in row ? row.date : null,
		"acceptedDate" in row ? row.acceptedDate : null,
		"leadId" in row ? row.leadId : null,
		"customer" in row ? row.customer : null,
		"supplier" in row ? row.supplier : null,
		"type" in row ? row.type : null,
		"category" in row ? row.category : null,
		"city" in row ? row.city : null,
	];

	return values
		.filter((value): value is string => Boolean(value))
		.map((value) => value.toLowerCase());
}

export function getLeadRowCells(
	activeTab: LeadStatus,
	row: LeadManagementRow
): LeadTableCell[] {
	switch (activeTab) {
		case "accepterad": {
			const acceptedRow = row as AcceptedLeadRow;
			return [
				{ kind: "text", value: acceptedRow.acceptedDate },
				{ kind: "text", value: acceptedRow.leadId },
				{ kind: "strong", value: acceptedRow.customer },
				{ kind: "strong", value: acceptedRow.supplier },
				{ kind: "text", value: acceptedRow.type },
				{ kind: "text", value: acceptedRow.category },
				{ kind: "text", value: acceptedRow.city },
				{ kind: "text", value: acceptedRow.offer },
				{ kind: "text", value: acceptedRow.commission },
				{ kind: "text", value: acceptedRow.reminder },
				{ kind: "payment", value: acceptedRow.status },
			];
		}
		case "betalda": {
			const paidRow = row as PaidLeadRow;
			return [
				{ kind: "text", value: paidRow.acceptedDate },
				{ kind: "text", value: paidRow.leadId },
				{ kind: "strong", value: paidRow.customer },
				{ kind: "strong", value: paidRow.supplier },
				{ kind: "text", value: paidRow.city },
				{ kind: "text", value: paidRow.commission },
				{ kind: "text", value: paidRow.paymentDate },
			];
		}
		case "hantering": {
			const handlingRow = row as HandlingLeadRow;
			return [
				{ kind: "text", value: handlingRow.date },
				{ kind: "text", value: handlingRow.leadId },
				{ kind: "strong", value: handlingRow.customer },
				{ kind: "text", value: handlingRow.type },
				{ kind: "text", value: handlingRow.category },
				{ kind: "text", value: handlingRow.city },
				{
					kind: "pill",
					value: handlingRow.matches,
					suffixKey: localizationConstants.userLabel,
				},
				{ kind: "text", value: handlingRow.taken },
				{ kind: "text", value: handlingRow.repeat },
			];
		}
		case "arkiv": {
			const archiveRow = row as ArchiveLeadRow;
			return [
				{ kind: "text", value: archiveRow.date },
				{ kind: "text", value: archiveRow.leadId },
				{ kind: "strong", value: archiveRow.customer },
				{ kind: "text", value: archiveRow.type },
				{ kind: "text", value: archiveRow.category },
				{ kind: "text", value: archiveRow.city },
				{ kind: "pill", value: archiveRow.tags },
			];
		}
		case "bevakning": {
			const monitoringRow = row as MonitoringLeadRow;
			return [
				{ kind: "text", value: monitoringRow.date },
				{ kind: "text", value: monitoringRow.leadId },
				{ kind: "strong", value: monitoringRow.customer },
				{ kind: "text", value: monitoringRow.type },
				{ kind: "text", value: monitoringRow.category },
				{ kind: "text", value: monitoringRow.city },
				{
					kind: "pill",
					value: monitoringRow.matches,
					suffixKey: localizationConstants.userLabel,
				},
				{ kind: "pill", value: monitoringRow.tags },
			];
		}
		case "granskning":
		default: {
			const leadRow = row as LeadRow;
			return [
				{ kind: "text", value: leadRow.date },
				{ kind: "text", value: leadRow.leadId },
				{ kind: "strong", value: leadRow.customer },
				{ kind: "text", value: leadRow.type },
				{ kind: "text", value: leadRow.category },
				{ kind: "text", value: leadRow.city },
				{
					kind: "pill",
					value: leadRow.matches,
					suffixKey: localizationConstants.userLabel,
				},
			];
		}
	}
}
