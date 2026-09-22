"use client";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import localizationConstants from "@/utils/translation/constants";
import type { MeetingKind } from "../types";
import { MeetingPointDialog } from "./MeetingPointDialog";
import type { PointsPage } from "./usePointsPage";
import type { ProtocolViewState } from "./useProtocolView";
import type { ProtocolViewDialogState } from "./useProtocolViewDialogs";

const M = localizationConstants;

export interface ProtocolViewDialogsProps {
	kind: MeetingKind;
	view: ProtocolViewState;
	dialogs: ProtocolViewDialogState;
	pointsPage: PointsPage;
}

/**
 * Every dialog the protocol opens. The point dialog mounts only while open, so
 * each opening starts from the point; the confirms stay mounted so they
 * animate closed.
 */
export function ProtocolViewDialogs({ kind, view, dialogs, pointsPage }: ProtocolViewDialogsProps) {
	const { dialog, close } = dialogs;
	const onOpenChange = (open: boolean) => !open && close();
	const point = dialog && "point" in dialog ? dialog.point : undefined;

	return (
		<>
			{(dialog?.kind === "addPoint" || dialog?.kind === "editPoint") && (
				<MeetingPointDialog
					kind={kind}
					point={point}
					nextNr={view.nextPointNr}
					people={view.people}
					onClose={close}
					onSave={(values) => {
						const saved = view.savePoint(values, point?.id);
						pointsPage.reveal(saved.id, saved.points);
						close();
					}}
				/>
			)}

			<ConfirmActionDialog
				open={dialog?.kind === "deletePoint"}
				onOpenChange={onOpenChange}
				title={M.protocolDeletePointConfirmTitle}
				description={M.protocolDeletePointConfirmDesc}
				confirmLabel={M.btnRadera}
				subject={point?.title}
				destructive
				onConfirm={() => {
					if (point) view.removePoint(point.id);
					close();
				}}
			/>

			<ConfirmActionDialog
				open={dialog?.kind === "send"}
				onOpenChange={onOpenChange}
				title={M.projectProtocolSendTitle}
				description={M.projectProtocolSendBody}
				confirmLabel={M.btnSkicka}
				subject={view.meeting?.details.title}
				onConfirm={() => {
					close();
					view.send();
				}}
			/>

			<ConfirmActionDialog
				open={dialog?.kind === "discard"}
				onOpenChange={onOpenChange}
				title={M.projectProtocolDiscardTitle}
				description={M.projectProtocolDiscardBody}
				confirmLabel={M.projectProtocolDiscardConfirm}
				destructive
				onConfirm={() => {
					const target = dialog?.kind === "discard" ? dialog.then : "list";
					close();
					view.leave(target);
				}}
			/>
		</>
	);
}

export default ProtocolViewDialogs;
