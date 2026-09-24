"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, Pencil, Save, Send, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyPagesQuery } from "../../shared/api";
import { MyPagesQueryState, useMyPagesAction } from "../../shared/feedback";
import { ConfirmRecordDelete } from "../../shared/ConfirmRecordDelete";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { MeetingPoint, PointStatus, ProtocolType } from "../constants/data";
import { PointValues } from "../schemas/protocol.schema";
import {
	addPoint,
	getProtocol,
	removePoint,
	setPointStatus,
	updateProtocol,
	updatePoint,
} from "../services/protocolService";
import MeetingInfoCard from "./MeetingInfoCard";
import PointFormDialog from "./PointFormDialog";
import PointsTable from "./PointsTable";

const TYPE_SUBTITLE_KEY: Record<ProtocolType, string> = {
	standard: localizationConstants.protocolCreateStandard,
	action: localizationConstants.protocolCreateAction,
};

const LIST_ROUTE = "/tools/my-pages/protocol";

const ProtocolViewPage = ({ protocolId }: { protocolId: string }) => {
	const router = useRouter();
	const queryResult = useMyPagesQuery(["protocol", protocolId], () => getProtocol(protocolId));
	const protocol = queryResult.data;
	const action = useMyPagesAction();
	const [pointDialogOpen, setPointDialogOpen] = useState(false);
	const [editingPoint, setEditingPoint] = useState<MeetingPoint | null>(null);
	const [deletingPoint, setDeletingPoint] = useState<MeetingPoint | null>(null);

	if (!protocol) return <MyPagesQueryState query={queryResult} />;

	const openCreatePoint = () => {
		setEditingPoint(null);
		setPointDialogOpen(true);
	};

	const openEditPoint = (point: MeetingPoint) => {
		setEditingPoint(point);
		setPointDialogOpen(true);
	};

	const handleSavePoint = (values: PointValues) => action.run(async () => {
		if (editingPoint) {
			await updatePoint(protocol, editingPoint.id, {
				nr: values.nr,
				subject: values.title,
				description: values.description,
				decision: values.decision,
				responsible: values.responsible,
			});
		} else {
			await addPoint(protocol, {
				id: crypto.randomUUID(),
				nr: values.nr,
				subject: values.title,
				description: values.description,
				decision: values.decision,
				responsible: values.responsible,
				status: "notDone",
			});
		}
	}, localizationConstants.protocolPointSavedToast);

	const handleDeletePoint = (point: MeetingPoint) => {
		setDeletingPoint(point);
	};

	const handlePointStatus = (point: MeetingPoint, status: PointStatus) => {
		void action.run(() => setPointStatus(protocol, point.id, status));
	};

	const handleSave = () => {
		void action.run(() => updateProtocol(protocol, {}), localizationConstants.protocolSavedToast);
	};

	const handleSend = async () => {
		if (await action.run(() => updateProtocol(protocol, { status: "sent" }), localizationConstants.protocolSentToast)) router.push(LIST_ROUTE);
	};

	return (
		<div className="flex flex-col gap-5">
			<MyPagesQueryState query={queryResult} />
			{!protocol.canEdit && <p className="text-sm text-slate-500"><Translate text={localizationConstants.myPagesReadOnly} /></p>}
			<ConfirmRecordDelete open={!!deletingPoint} pending={action.pending} onClose={() => setDeletingPoint(null)} onConfirm={async () => {
				if (deletingPoint && await action.run(() => removePoint(protocol, deletingPoint.id), localizationConstants.protocolPointDeletedToast)) setDeletingPoint(null);
			}} />
			<div className="flex items-start gap-3">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => router.push(LIST_ROUTE)}
					className="mt-0.5 h-8 w-8 rounded-md text-slate-700"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div>
					<h2 className="text-2xl font-bold text-slate-900">
						<Translate
							text={localizationConstants.protocolViewTitle}
						/>
					</h2>
					<p className="mt-1 text-sm text-slate-500">
						<Translate text={TYPE_SUBTITLE_KEY[protocol.type]} />
					</p>
				</div>
			</div>

			<MeetingInfoCard
				icon={Info}
				titleKey={localizationConstants.protocolMeetingInfo}
				details={protocol.meeting}
			/>
			<MeetingInfoCard
				icon={Video}
				titleKey={localizationConstants.protocolNextMeeting}
				details={protocol.nextMeeting}
			/>

			<fieldset disabled={!protocol.canEdit || action.pending}><PointsTable
				type={protocol.type}
				points={protocol.points}
				onCreate={openCreatePoint}
				onEdit={openEditPoint}
				onDelete={handleDeletePoint}
				onStatusChange={handlePointStatus}
			/></fieldset>

			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<Button
						type="button"
						variant="secondary"
						onClick={() => router.push(LIST_ROUTE)}
						className="h-11 rounded-md bg-slate-100 px-6 text-sm font-medium text-slate-900 hover:bg-slate-200"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() =>
							router.push(`${LIST_ROUTE}/${protocol.id}/edit`)
						}
						className="h-11 gap-2 rounded-md border-slate-200 bg-white px-6 text-sm font-medium text-slate-900 hover:bg-slate-50"
					>
						<Pencil className="h-4 w-4" />
						<Translate
							text={localizationConstants.protocolEditAction}
						/>
					</Button>
				</div>
				<div className="flex items-center gap-3">
					<Button
						type="button"
						variant="secondary"
						onClick={handleSave}
						disabled={!protocol.canEdit || action.pending}
						className="h-11 gap-2 rounded-md bg-slate-100 px-6 text-sm font-medium text-slate-900 hover:bg-slate-200"
					>
						<Save className="h-4 w-4" />
						<Translate text={localizationConstants.save} />
					</Button>
					<Button
						type="button"
					onClick={handleSend}
					disabled={!protocol.canEdit || action.pending}
						className="h-11 gap-2 rounded-md bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-900/90"
					>
						<Send className="h-4 w-4" />
						<Translate text={localizationConstants.protocolSend} />
					</Button>
				</div>
			</div>

			<PointFormDialog
				open={pointDialogOpen}
				type={protocol.type}
				editingPoint={editingPoint}
				onClose={() => setPointDialogOpen(false)}
				onSave={handleSavePoint}
			/>
		</div>
	);
};

export default ProtocolViewPage;
