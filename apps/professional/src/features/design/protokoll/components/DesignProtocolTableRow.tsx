"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { RecordFileIcon } from "../../../project/production/components/RecordFileIcon";
import { PROTOCOL_FILE_RULES } from "../../../project/production/protokoll/projectProtocol.config";
import { ProtocolRowMenu } from "../../../project/production/protokoll/components/ProtocolRowMenu";
import { hasDetailsPage, hasMeeting, type ProtocolTypeLabel } from "../../../project/production/protokoll/protocolView";
import type { ProjectProtocol } from "../../../project/production/protokoll/types";
import { designProtocolUrls } from "../designProtocolNav";

const CELL = "px-3 py-3 text-sm text-slate-900 lg:px-4";
const DETAILS_BUTTON = "h-9 cursor-pointer bg-slate-100 px-3 text-sm font-medium text-slate-900 hover:bg-slate-200";

export interface DesignProtocolTableRowProps {
	protocol: ProjectProtocol;
	typeLabel: ProtocolTypeLabel;
	onOpen: () => void;
	onToggleArchive: () => void;
	onPrint: () => void;
	onDelete: () => void;
}

export function DesignProtocolTableRow({
	protocol,
	typeLabel,
	onOpen,
	onToggleArchive,
	onPrint,
	onDelete,
}: DesignProtocolTableRowProps) {
	return (
		<TableRow>
			<TableCell className={`${CELL} whitespace-nowrap tabular-nums`}>
				{protocol.date}
			</TableCell>
			<TableCell className={CELL}>{typeLabel(protocol.type)}</TableCell>
			<TableCell className={`${CELL} max-w-64`}>
				{protocol.fileName ? (
					<span className="flex min-w-0 items-center gap-3" title={protocol.fileName}>
						<RecordFileIcon fileName={protocol.fileName} types={PROTOCOL_FILE_RULES.types} />
						<span className="truncate">{protocol.fileName}</span>
					</span>
				) : (
					<>
						<span aria-hidden className="text-slate-400">
							—
						</span>
						<span className="sr-only">
							<Translate text={localizationConstants.purchaseInfoValueMissing} />
						</span>
					</>
				)}
			</TableCell>
			<TableCell className={CELL}>
				{hasDetailsPage(protocol) ? (
					<Button asChild variant="secondary" className={DETAILS_BUTTON}>
						<Link
							href={designProtocolUrls.view(protocol.projectId, protocol.id)}
						>
							<Translate text={localizationConstants.viewDetailsButton} />
							<span className="sr-only"> {protocol.name}</span>
						</Link>
					</Button>
				) : (
					<Button
						type="button"
						variant="secondary"
						onClick={onOpen}
						className={DETAILS_BUTTON}
					>
						<Translate text={localizationConstants.viewDetailsButton} />
						<span className="sr-only"> {protocol.name}</span>
					</Button>
				)}
			</TableCell>
			<TableCell className="w-12 px-1 py-3 text-right lg:px-2">
				<ProtocolRowMenu
					label={protocol.name}
					archived={protocol.archived}
					canOpen={Boolean(protocol.url) || hasMeeting(protocol)}
					canPrint={Boolean(protocol.url)}
					onOpen={onOpen}
					onToggleArchive={onToggleArchive}
					onPrint={onPrint}
					onDelete={onDelete}
				/>
			</TableCell>
		</TableRow>
	);
}

export default DesignProtocolTableRow;
