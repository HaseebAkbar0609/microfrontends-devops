"use client";

import Link from "next/link";
import { Eye, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { TableCell, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { RowActionMenu, RowMenuAction } from "../../components/RowActionMenu";
import type { WarrantyCommitment } from "../types";
import { warrantyUrls } from "../warrantyNav";

/* Narrower padding below lg keeps both columns upright on a tablet. */
const CELL = "px-3 py-3 text-sm text-slate-900 lg:px-4";

export interface WarrantyTableRowProps {
	commitment: WarrantyCommitment;
	onEdit: () => void;
	onDelete: () => void;
}

/**
 * One commitment: its day, its name, and the ⋮ the frame draws. The row opens
 * the commitment's page for the pointer, and the name is a link, so the
 * keyboard and a screen reader reach it too.
 */
export function WarrantyTableRow({ commitment, onEdit, onDelete }: WarrantyTableRowProps) {
	const t = useTranslate();
	const router = useRouter();
	const viewUrl = warrantyUrls.view(commitment.projectId, commitment.id);

	return (
		<TableRow
			onClick={(event) => {
				/* The name's link and the ⋮ handle their own clicks. */
				if ((event.target as HTMLElement).closest("a,button")) return;
				router.push(viewUrl);
			}}
			className="cursor-pointer"
		>
			<TableCell className={`${CELL} whitespace-nowrap tabular-nums`}>{commitment.date}</TableCell>
			<TableCell className={`${CELL} whitespace-normal`}>
				<Link href={viewUrl} className="rounded hover:underline focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none">
					{commitment.name}
				</Link>
			</TableCell>
			<TableCell className="w-12 px-1 py-3 text-right lg:px-2">
				<RowActionMenu ariaLabel={t(localizationConstants.projectWarrantyRowActions, { label: commitment.name })}>
					<RowMenuAction
						icon={Eye}
						labelKey={localizationConstants.projectWarrantyViewDetails}
						reasonKey={null}
						onSelect={() => router.push(viewUrl)}
					/>
					<RowMenuAction icon={PencilLine} labelKey={localizationConstants.projectWarrantyRowEdit} reasonKey={null} onSelect={onEdit} />
					<RowMenuAction icon={Trash2} labelKey={localizationConstants.projectWarrantyRowDelete} reasonKey={null} destructive onSelect={onDelete} />
				</RowActionMenu>
			</TableCell>
		</TableRow>
	);
}

export default WarrantyTableRow;
