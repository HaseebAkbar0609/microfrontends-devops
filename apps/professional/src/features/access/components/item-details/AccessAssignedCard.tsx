"use client";

import { useMemo } from "react";
import { Eye, UserPlus } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { ACCESS_EMPTY_CELL } from "../../constants/access.constants";
import type { AccessItemExtra } from "../../types/accessItemDetails.types";
import type { AccessItem, AccessItemStatusId } from "../../types/accessItems.types";
import { AccessSectionCard } from "../details/AccessSectionCard";
import { AccessItemStatusSelect } from "./AccessItemStatusSelect";

interface AccessAssignedCardProps {
	item: AccessItem;
	holderName: string;
	extra: AccessItemExtra;
	onStatusChange: (status: AccessItemStatusId) => void;
	onViewDocument: () => void;
	onEdit: () => void;
}

/** "Assigned Access" card: one row with company, person, a status dropdown and the document. */
export function AccessAssignedCard({ item, holderName, extra, onStatusChange, onViewDocument, onEdit }: AccessAssignedCardProps) {
	const t = useTranslate();

	const columns = useMemo<DataTableColumn<AccessItem>[]>(
		() => [
			{
				key: "company",
				label: localizationConstants.accessAssignedCompany,
				cellClassName: "text-slate-500",
				render: () => extra.company || ACCESS_EMPTY_CELL,
			},
			{ key: "person", label: localizationConstants.accessAssignedPerson, cellClassName: "text-slate-500", render: () => holderName },
			{
				key: "status",
				label: localizationConstants.accessColStatus,
				render: (row) => <AccessItemStatusSelect item={row} onChange={onStatusChange} />,
			},
			{
				key: "document",
				label: localizationConstants.accessAssignedDocument,
				render: () =>
					extra.assignmentDocument ? (
						<span className="flex items-center gap-2 text-slate-900">
							<PdfFileIcon className="h-9 w-7" />
							{extra.assignmentDocument}
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="cursor-pointer"
								aria-label={t(localizationConstants.accessViewLabel, { name: extra.assignmentDocument })}
								onClick={onViewDocument}
							>
								<Eye className="h-4 w-4" aria-hidden />
							</Button>
						</span>
					) : (
						ACCESS_EMPTY_CELL
					),
			},
		],
		[extra.company, extra.assignmentDocument, holderName, onStatusChange, onViewDocument, t],
	);

	return (
		<AccessSectionCard
			icon={<UserPlus className="h-5 w-5" aria-hidden />}
			title={localizationConstants.accessItemSectionAssigned}
			onEdit={onEdit}
		>
			<div className="p-4">
				<DataTable data={[item]} columns={columns} rowKey={(row) => row.id} />
			</div>
		</AccessSectionCard>
	);
}
