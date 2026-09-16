"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ataUrls } from "../ataNav";
import { deleteBlockReason, editBlockReason, sendBlockReason } from "../ataRules";
import type { AtaListRow } from "../ataView";
import { ATA_ATTESTED_LABELS } from "../projectAta.config";
import { AtaRowMenu } from "./AtaRowMenu";
import { AtaStatusBadge } from "./AtaStatusBadge";

/* Narrower padding below xl keeps the eight columns on a tablet held sideways. */
const CELL = "px-3 py-3 text-sm text-slate-900 xl:px-4";
const NUMBER_CELL = `${CELL} whitespace-nowrap tabular-nums`;

export interface AtaTableRowProps {
	row: AtaListRow;
	/** "Äta 100" — names the row for a screen reader. */
	label: string;
	onEdit: () => void;
	onDelete: () => void;
	onSend: () => void;
}

export function AtaTableRow({ row, label, onEdit, onDelete, onSend }: AtaTableRowProps) {
	const t = useTranslate();
	const { ata } = row;

	return (
		<TableRow>
			<TableCell className={NUMBER_CELL}>{ata.createdDate}</TableCell>
			<TableCell className={NUMBER_CELL}>{ata.number}</TableCell>
			<TableCell className={CELL}>
				{row.linked || (
					<>
						<span aria-hidden className="text-slate-400">
							—
						</span>
						<span className="sr-only">
							<Translate text={localizationConstants.projectAtaNoLinkedAta} />
						</span>
					</>
				)}
			</TableCell>
			<TableCell className={NUMBER_CELL}>{formatCurrency(row.amount)}</TableCell>
			<TableCell className={CELL}>
				<AtaStatusBadge status={ata.status} />
			</TableCell>
			<TableCell className={CELL}>
				<Translate text={ATA_ATTESTED_LABELS[ata.attested]} />
			</TableCell>
			<TableCell className="px-3 py-3 xl:px-4">
				<Button
					asChild
					variant="secondary"
					className="h-9 cursor-pointer bg-slate-100 px-3 text-sm font-medium text-slate-900 hover:bg-slate-200"
				>
					<Link href={ataUrls.view(ata.projectId, ata.id)}>
						<Translate text={localizationConstants.ataViewDetails} />
					</Link>
				</Button>
			</TableCell>
			<TableCell className="w-12 px-2 py-3 text-right">
				<AtaRowMenu
					ariaLabel={t(localizationConstants.projectAtaRowActions, { label })}
					editReason={editBlockReason(ata.status)}
					deleteReason={deleteBlockReason(ata.status)}
					sendReason={sendBlockReason(ata.status, ata.lineItems)}
					onEdit={onEdit}
					onDelete={onDelete}
					onSend={onSend}
				/>
			</TableCell>
		</TableRow>
	);
}

export default AtaTableRow;
