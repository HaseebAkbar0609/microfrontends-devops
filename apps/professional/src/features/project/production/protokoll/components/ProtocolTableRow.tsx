"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { RecordFileIcon } from "../../components/RecordFileIcon";
import { PROTOCOL_FILE_RULES } from "../projectProtocol.config";
import { protocolUrls } from "../protocolNav";
import { hasDetailsPage, hasMeeting, type ProtocolTypeLabel } from "../protocolView";
import type { ProjectProtocol } from "../types";
import { ProtocolRowMenu } from "./ProtocolRowMenu";

/* Narrower padding below lg keeps the columns upright on a tablet. */
const CELL = "px-3 py-3 text-sm text-slate-900 lg:px-4";
const DETAILS_BUTTON = "h-9 cursor-pointer bg-slate-100 px-3 text-sm font-medium text-slate-900 hover:bg-slate-200";

export interface ProtocolTableRowProps {
	protocol: ProjectProtocol;
	typeLabel: ProtocolTypeLabel;
	onOpen: () => void;
	onToggleArchive: () => void;
	onPrint: () => void;
	onDelete: () => void;
}

/**
 * One protocol: its day, its type, its file, "Visa detaljer" and the ⋮. The PDF
 * column prints the file's full name, as the frame does; a Standard or Action
 * protocol has no file and shows the missing-value mark. Every kind's Visa
 * detaljer is a link to its page; the button that opens the file instead
 * stays for a row without one.
 */
export function ProtocolTableRow({ protocol, typeLabel, onOpen, onToggleArchive, onPrint, onDelete }: ProtocolTableRowProps) {
	return (
		<TableRow>
			<TableCell className={`${CELL} whitespace-nowrap tabular-nums`}>{protocol.date}</TableCell>
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
				{/* The name tells a screen reader which protocol, since every row's
				    button reads the same. */}
				{hasDetailsPage(protocol) ? (
					<Button asChild variant="secondary" className={DETAILS_BUTTON}>
						<Link href={protocolUrls.view(protocol.projectId, protocol.id)}>
							<Translate text={localizationConstants.viewDetailsButton} />
							<span className="sr-only"> {protocol.name}</span>
						</Link>
					</Button>
				) : (
					<Button type="button" variant="secondary" onClick={onOpen} className={DETAILS_BUTTON}>
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

export default ProtocolTableRow;
