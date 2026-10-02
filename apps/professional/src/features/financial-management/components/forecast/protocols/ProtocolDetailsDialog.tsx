"use client";

import { ExternalLink } from "lucide-react";

import { DetailRow } from "@/components/dialog/DetailRow";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecordFileIcon } from "@/features/project/production/components/RecordFileIcon";
import { formatFileSize } from "@/utils/formatFileSize";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	PROTOCOL_FILE_RULES,
	PROTOCOL_TYPE_LABELS,
} from "../../../constants/forecastProtocols.constants";
import type { ForecastProtocol } from "../../../types/forecastProtocols.types";

export interface ProtocolDetailsDialogProps {
	protocol: ForecastProtocol;
	/** Opens the held file in a new tab; refused on one holding none. */
	onOpenFile: () => void;
	onClose: () => void;
}

/**
 * What "Visa detaljer" opens: the protocol as the register holds it, including
 * the size the table has no column for. The file opens from here too, or says
 * why it cannot — a seeded protocol, and a new one after a reload, holds none.
 */
export function ProtocolDetailsDialog({ protocol, onOpenFile, onClose }: ProtocolDetailsDialogProps) {
	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.forecastProtocolsDetailsTitle} />
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col">
					<DetailRow labelKey={localizationConstants.projectProtocolColDate}>
						<span className="tabular-nums">{protocol.date}</span>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.projectProtocolColType}>
						<Translate text={PROTOCOL_TYPE_LABELS[protocol.type]} />
					</DetailRow>

					<DetailRow labelKey={localizationConstants.projectProtocolColPdf}>
						<div className="flex items-center gap-2.5">
							<RecordFileIcon fileName={protocol.fileName} types={PROTOCOL_FILE_RULES.types} />
							<span className="truncate" title={protocol.fileName}>
								{protocol.fileName}
							</span>
						</div>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastProtocolsDetailSize}>
						{protocol.fileSize === undefined ? (
							<span className="text-slate-500">
								<Translate text={localizationConstants.forecastProtocolsSizeUnknown} />
							</span>
						) : (
							<span className="tabular-nums">{formatFileSize(protocol.fileSize)}</span>
						)}
					</DetailRow>
				</div>

				{!protocol.url && (
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.projectProtocolNoFile} />
					</p>
				)}

				<DialogFooter className="gap-2 sm:gap-3">
					<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
						<Translate text={localizationConstants.buttonClose} />
					</Button>
					<Button
						type="button"
						onClick={onOpenFile}
						disabled={!protocol.url}
						className="cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800 disabled:cursor-not-allowed"
					>
						<ExternalLink className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.forecastProtocolsOpenFile} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default ProtocolDetailsDialog;
