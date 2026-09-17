"use client";

import Link from "next/link";
import { CircleCheck, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { padAtaNumber } from "../../ataMath";
import { supplierApproveBlockReason } from "../../ataRules";
import { ataUrls } from "../../ataNav";
import { AtaActionMenu, AtaMenuAction } from "../../list/AtaRowMenu";
import { AtaStatusBadge } from "../../list/AtaStatusBadge";
import { ATA_ATTESTED_LABELS } from "../../projectAta.config";
import type { SupplierAtaRow } from "../types";
import { SupplierLinkPill } from "./SupplierLinkPill";

const CELL = "px-4 py-3 text-sm text-slate-900";
const NUMBER_CELL = `${CELL} whitespace-nowrap tabular-nums`;

export interface SupplierAtaTableRowProps {
	row: SupplierAtaRow;
	/** "Pelle Målare 004" — names the row for a screen reader. */
	label: string;
	onApprove: () => void;
}

export function SupplierAtaTableRow({ row, label, onApprove }: SupplierAtaTableRowProps) {
	const t = useTranslate();
	const router = useRouter();
	const { ata } = row;
	const viewUrl = ataUrls.supplierView(ata.projectId, ata.id);

	return (
		<TableRow>
			<TableCell className={NUMBER_CELL}>{ata.createdDate}</TableCell>
			<TableCell className={NUMBER_CELL}>{padAtaNumber(ata.number)}</TableCell>
			<TableCell className={CELL}>
				<SupplierLinkPill linkedNumber={row.linkedNumber} />
			</TableCell>
			<TableCell className={NUMBER_CELL}>{formatCurrency(row.amount)}</TableCell>
			<TableCell className={CELL}>
				<AtaStatusBadge status={ata.status} />
			</TableCell>
			<TableCell className={CELL}>
				<Translate text={ATA_ATTESTED_LABELS[ata.attested]} />
			</TableCell>
			<TableCell className={NUMBER_CELL}>
				{ata.attestDate || (
					<>
						<span aria-hidden className="text-slate-400">—</span>
						<span className="sr-only"><Translate text={localizationConstants.projectAtaSupplierNotAttested} /></span>
					</>
				)}
			</TableCell>
			<TableCell className="px-4 py-3">
				<Button asChild variant="secondary" className="h-9 cursor-pointer bg-slate-100 px-3 text-sm font-medium text-slate-900 hover:bg-slate-200">
					<Link href={viewUrl}>
						<Translate text={localizationConstants.ataViewDetails} />
					</Link>
				</Button>
			</TableCell>
			<TableCell className="w-12 border-l border-slate-200 px-2 py-3 text-right">
				<AtaActionMenu ariaLabel={t(localizationConstants.projectAtaRowActions, { label })}>
					<AtaMenuAction icon={Eye} labelKey={localizationConstants.ataViewDetails} reasonKey={null} onSelect={() => router.push(viewUrl)} />
					<AtaMenuAction
						icon={CircleCheck}
						labelKey={localizationConstants.viewAtaBtnApprove}
						reasonKey={supplierApproveBlockReason(ata.status, ata.lineItems)}
						onSelect={onApprove}
					/>
				</AtaActionMenu>
			</TableCell>
		</TableRow>
	);
}

export default SupplierAtaTableRow;
