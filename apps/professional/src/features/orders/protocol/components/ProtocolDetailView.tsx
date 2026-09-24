"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
	ArrowLeft,
	Info,
	Video,
	Plus,
	MoreVertical,
	PencilLine,
	Trash2,
	Save,
	Send,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TablePagination } from "@/components/table/TablePagination";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_CONSTANTS } from "../constants/protocol.constants";
import {
	getProtocolFullDetailAction,
	updateProtocolFullAction,
	createPointAction,
	updatePointAction,
	deletePointAction,
} from "@/api-actions/orders/protocols";
import type {
	ProtocolItem,
	ProtocolDetailData,
	ProtocolMeetingPoint,
} from "../types/protocol.types";
import { CreateMeetingPointModal } from "./CreateMeetingPointModal";
import { EditMeetingPointModal } from "./EditMeetingPointModal";
import { MeetingAccordionCard, ProjectInfoCard } from "./ProtocolSharedComponents";

/* -------------------------------------------------------------------------- */
/* Sub-component: Points Table Card                                           */
/* -------------------------------------------------------------------------- */
interface PointsSectionProps {
	points: ProtocolMeetingPoint[];
	onAddPoint: () => void;
	onEditPoint: (point: ProtocolMeetingPoint) => void;
	onDeletePoint: (pointId: string) => void;
}

function PointsSection({
	points,
	onAddPoint,
	onEditPoint,
	onDeletePoint,
}: PointsSectionProps) {
	const [deletingPointId, setDeletingPointId] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const totalPages = Math.max(1, Math.ceil(points.length / pageSize));
	const startIndex = (currentPage - 1) * pageSize;
	const currentPoints = points.slice(startIndex, startIndex + pageSize);

	return (
		<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs w-full flex flex-col gap-0 pb-0">
			<div className="flex h-14 min-h-14 w-full items-center justify-between border-b border-slate-200 bg-slate-200 px-5">
				<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
					<Translate text={localizationConstants.protocolPointsTableTitle} />
				</span>
				<Button
					type="button"
					onClick={onAddPoint}
					className="h-9 gap-1.5 rounded-lg bg-slate-900 px-4 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer shadow-none"
				>
					<Translate text={localizationConstants.protocolCreatePoint} />
					<Plus className="h-3.5 w-3.5 shrink-0 text-white" />
				</Button>
			</div>

			{points.length === 0 ? (
				<div className="text-center py-12 px-4 text-slate-400 text-xs">
					<Translate text={localizationConstants.protocolEmptyPoints} />
				</div>
			) : (
				<Table className="w-full min-w-187.5 text-left">
					<TableHeader>
						<TableRow className="border-b border-slate-200 text-xs text-slate-500 font-medium">
							<TableHead className="py-3.5 px-6 w-20 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
								<Translate text={localizationConstants.protocolPointColNr} />
							</TableHead>
							<TableHead className="py-3.5 px-4 min-w-60 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
								<Translate text={localizationConstants.protocolPointSubject} />
							</TableHead>
							<TableHead className="py-3.5 px-4 min-w-35 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
								<Translate text={localizationConstants.protocolPointColDecision} />
							</TableHead>
							<TableHead className="py-3.5 px-4 min-w-35 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
								<Translate text={localizationConstants.protocolFieldResponsible} />
							</TableHead>
							<TableHead className="py-3.5 px-4 w-12 text-right font-sans text-sm font-medium text-slate-500 whitespace-nowrap"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="divide-y divide-slate-100 text-sm">
						{currentPoints.map((point) => (
							<TableRow
								key={point.id}
								className="hover:bg-slate-50/50 transition-colors group"
							>
								<TableCell className="py-4 px-6 text-slate-900 align-middle whitespace-nowrap font-sans text-sm font-normal">
									{point.nr || ""}
								</TableCell>

								<TableCell className="py-4 px-4 align-middle whitespace-nowrap">
									<div className="font-sans text-sm font-semibold text-slate-900 whitespace-nowrap">
										{point.subject}
									</div>
									{point.description && (
										<div className="font-sans text-xs text-slate-400 mt-0.5 leading-normal whitespace-nowrap">
											{point.description}
										</div>
									)}
								</TableCell>

								<TableCell className="py-4 px-4 text-slate-900 align-middle whitespace-nowrap font-sans text-sm font-normal">
									{point.decision || "—"}
								</TableCell>

								<TableCell className="py-4 px-4 text-slate-900 align-middle whitespace-nowrap font-sans text-sm font-normal">
									{point.responsible || "—"}
								</TableCell>

								<TableCell className="py-3.5 px-4 align-top text-right whitespace-nowrap">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
											>
												<MoreVertical className="h-4 w-4 shrink-0" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="w-40 bg-white border border-slate-200 shadow-md rounded-lg p-1 z-50 text-xs"
										>
											<DropdownMenuItem
												onClick={() => onEditPoint(point)}
												className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-normal text-black cursor-pointer rounded-md hover:bg-slate-100 transition-colors"
											>
												<PencilLine className="h-4 w-4 shrink-0 text-black" />
												<Translate text={localizationConstants.btnRedigera} />
											</DropdownMenuItem>

											<DropdownMenuItem
												onClick={() => setDeletingPointId(point.id)}
												className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-normal text-black cursor-pointer rounded-md hover:bg-slate-100 transition-colors"
											>
												<Trash2 className="h-4 w-4 shrink-0 text-black" />
												<Translate text={localizationConstants.btnRadera} />
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			<div className="px-5 border-t border-slate-200">
				<TablePagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={setCurrentPage}
					onPageSizeChange={(size) => {
						setPageSize(size);
						setCurrentPage(1);
					}}
				/>
			</div>

			<AlertDialog
				open={!!deletingPointId}
				onOpenChange={(val) => !val && setDeletingPointId(null)}
			>
				<AlertDialogContent className="w-[calc(100vw-2rem)] max-w-md bg-white border border-slate-200 shadow-xl rounded-xl p-5 sm:p-6">
					<AlertDialogHeader>
						<AlertDialogTitle className="font-sans text-lg font-semibold text-slate-900">
							<Translate text={localizationConstants.protocolDeletePointConfirmTitle} />
						</AlertDialogTitle>
						<AlertDialogDescription className="font-sans text-sm text-slate-500">
							<Translate text={localizationConstants.protocolDeletePointConfirmDesc} />
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2">
						<AlertDialogCancel
							onClick={() => setDeletingPointId(null)}
							className="rounded-lg border-slate-200 hover:bg-slate-50 text-slate-900 text-sm cursor-pointer shadow-none"
						>
							<Translate text={localizationConstants.protocolCancelAction} />
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (deletingPointId) {
									onDeletePoint(deletingPointId);
									setDeletingPointId(null);
								}
							}}
							className="bg-red-600! hover:bg-red-700! text-white! rounded-lg text-sm border-0 cursor-pointer shadow-none font-medium"
						>
							<Translate text={localizationConstants.protocolDeleteAction} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	);
}

/* -------------------------------------------------------------------------- */
/* Main Container: ProtocolDetailView                                         */
/* -------------------------------------------------------------------------- */
export interface ProtocolDetailViewProps {
	protocolId: string;
	orderId?: string;
	onBack: () => void;
	onEditProtocol?: (protocol: ProtocolItem) => void;
}

export function ProtocolDetailView({
	protocolId,
	orderId = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	onBack,
	onEditProtocol,
}: ProtocolDetailViewProps) {
	const t = useTranslate();
	const [detailData, setDetailData] = useState<ProtocolDetailData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const [isCreatePointOpen, setIsCreatePointOpen] = useState(false);
	const [editingPoint, setEditingPoint] = useState<ProtocolMeetingPoint | null>(null);

	useEffect(() => {
		let isMounted = true;
		const loadDetail = async () => {
			setIsLoading(true);
			try {
				const result = await getProtocolFullDetailAction(orderId, protocolId);
				if (isMounted) {
					if (result.success && result.data) {
						setDetailData(result.data);
					} else {
						toast.error(t(localizationConstants.protocolLoadError));
					}
				}
			} catch {
				if (isMounted) {
					toast.error(t(localizationConstants.protocolLoadError));
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		loadDetail();
		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [protocolId, orderId]);

	const handleAddPointClick = () => {
		setEditingPoint(null);
		setIsCreatePointOpen(true);
	};

	const handleEditPointClick = (point: ProtocolMeetingPoint) => {
		setEditingPoint(point);
	};

	const handleSaveNewPoint = async (point: ProtocolMeetingPoint) => {
		if (!detailData) return;
		const result = await createPointAction(orderId, protocolId, {
			nr: point.nr,
			subject: point.subject,
			description: point.description,
			decision: point.decision,
			responsible: point.responsible,
			status: point.status,
		});
		if (result.success && result.data) {
			setDetailData({
				...detailData,
				points: [...detailData.points, result.data],
			});
			toast.success(t(localizationConstants.protocolPointSavedToast));
		} else {
			toast.error(t(localizationConstants.protocolPointCreateError));
		}
	};

	const handleSaveEditedPoint = async (point: ProtocolMeetingPoint) => {
		if (!detailData) return;
		const result = await updatePointAction(orderId, protocolId, point.id, {
			subject: point.subject,
			description: point.description,
			decision: point.decision,
			responsible: point.responsible,
			status: point.status,
		});
		if (result.success && result.data) {
			const updatedPoints = detailData.points.map((p) => (p.id === point.id ? result.data! : p));
			setDetailData({
				...detailData,
				points: updatedPoints,
			});
			toast.success(t(localizationConstants.protocolPointSavedToast));
		} else {
			toast.error(t(localizationConstants.protocolPointUpdateError));
		}
	};

	const handleDeletePoint = async (pointId: string) => {
		if (!detailData) return;
		const result = await deletePointAction(orderId, protocolId, pointId);
		if (result.success) {
			setDetailData({
				...detailData,
				points: detailData.points.filter((p) => p.id !== pointId),
			});
			toast.success(t(localizationConstants.protocolPointDeletedToast));
		} else {
			toast.error(t(localizationConstants.protocolPointDeleteError));
		}
	};

	const handleSaveProtocol = async () => {
		if (!detailData) return;
		setIsSaving(true);
		const result = await updateProtocolFullAction(orderId, protocolId, {
			information: detailData.meetingInfo.information,
		});
		if (result.success) {
			toast.success(t(localizationConstants.protocolSavedToast));
		} else {
			toast.error(t(localizationConstants.protocolSaveError));
		}
		setIsSaving(false);
	};

	const handleSendProtocol = () => {
		toast.success(t(localizationConstants.protocolSentToast));
	};

	const nextPointNr = useMemo(() => {
		if (!detailData || detailData.points.length === 0) return PROTOCOL_CONSTANTS.DEFAULT_POINT_NR;
		const count = String(detailData.points.length + 1).padStart(3, "0");
		return count;
	}, [detailData]);

	if (isLoading) {
		return (
			<div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-12 -mr-4 sm:-mr-6 -mt-px px-3 sm:px-6 pt-5 sm:pt-7 pb-0 bg-slate-50">
				<div className="flex items-center gap-2 pb-1 animate-pulse">
					<Skeleton className="size-7 rounded-md" />
					<Skeleton className="h-7 w-48" />
				</div>
				<div className="space-y-4 w-full pl-0 sm:pl-7 pt-4">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
						<div className="order-2 lg:order-1 lg:col-span-9 space-y-4 sm:space-y-6">
							<Skeleton className="h-64 w-full rounded-lg" />
							<Skeleton className="h-48 w-full rounded-lg" />
							<Skeleton className="h-64 w-full rounded-lg" />
						</div>
						<div className="order-1 lg:order-2 lg:col-span-3">
							<Skeleton className="h-48 w-full rounded-lg" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-12 -mr-4 sm:-mr-6 -mt-px -mb-4 px-3 sm:px-6 pt-5 sm:pt-7 pb-0 bg-slate-50 justify-between">
			<div className="space-y-4 w-full pb-8">
				<div className="flex items-start gap-2 pb-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onBack}
						className="size-7 shrink-0 rounded-md text-slate-900 hover:bg-slate-100 cursor-pointer flex items-center justify-center p-0 shadow-none -mt-1"
						aria-label={t(localizationConstants.goBackButton)}
					>
						<ArrowLeft className="size-5 text-slate-900" aria-hidden="true" />
					</Button>
					<div className="flex flex-col">
						<h1 className="font-sans text-lg sm:text-xl md:text-2xl font-semibold leading-[100%] tracking-[-0.6px] text-slate-900">
							<Translate text={localizationConstants.protocolViewTitle} />
						</h1>
						<span className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-500 mt-0.5">
							<Translate text={localizationConstants.protocolStandard} />
						</span>
					</div>
				</div>

				<div className="space-y-4 w-full pl-0 sm:pl-7">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
						<div className="order-2 lg:order-1 lg:col-span-9 space-y-4 sm:space-y-6">
							<MeetingAccordionCard
								titleKey={localizationConstants.protocolMeetingInfo}
								icon={
									<Info
										className="h-6 w-6 size-6 text-slate-800 shrink-0"
										strokeWidth={1.75}
									/>
								}
								info={detailData?.meetingInfo}
							/>

							<MeetingAccordionCard
								titleKey={localizationConstants.protocolNextMeeting}
								icon={
									<Video
										className="h-6 w-6 size-6 text-slate-800 shrink-0"
										strokeWidth={1.75}
									/>
								}
								info={detailData?.nextMeeting}
							/>

							<PointsSection
								points={detailData?.points || []}
								onAddPoint={handleAddPointClick}
								onEditPoint={handleEditPointClick}
								onDeletePoint={handleDeletePoint}
							/>
						</div>

						<div className="order-1 lg:order-2 lg:col-span-3 lg:mt-[56px] w-full">
							<ProjectInfoCard
								projectNumber={detailData?.protocol.projectNumber}
								projectName={detailData?.protocol.projectName}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-auto sticky -bottom-4 -mx-3 sm:-mx-6 -mb-4 px-4 sm:px-6 py-3 bg-white border-t border-slate-200 z-30 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-3 shadow-md">
				<div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 w-full lg:w-auto">
					<Button
						type="button"
						variant="ghost"
						onClick={onBack}
						className="w-full sm:w-auto sm:min-w-35 h-10 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-slate-900 text-sm font-medium border-0 cursor-pointer shadow-none flex items-center justify-center shrink-0"
					>
						<Translate text={localizationConstants.protocolCancelAction} />
					</Button>

					<Button
						type="button"
						variant="outline"
						onClick={() =>
							onEditProtocol?.(detailData?.protocol || ({} as ProtocolItem))
						}
						className="w-full sm:w-auto sm:min-w-[140px] h-[40px] px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-sm font-medium gap-2 cursor-pointer shadow-none flex items-center justify-center shrink-0"
					>
						<PencilLine className="h-4 w-4 shrink-0 text-slate-900" />
						<Translate text={localizationConstants.protocolEditProtocolAction} />
					</Button>
				</div>

				<div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-2 w-full lg:w-auto">
					<Button
						type="button"
						variant="ghost"
						disabled={isSaving}
						onClick={handleSaveProtocol}
						className="w-full sm:w-auto sm:min-w-[140px] h-[40px] px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-slate-900 text-sm font-medium border-0 gap-2 cursor-pointer shadow-none flex items-center justify-center shrink-0"
					>
						<Save className="h-4 w-4 shrink-0 text-slate-900" />
						<Translate text={localizationConstants.protocolSaveAction} />
					</Button>

					<Button
						type="button"
						variant="ghost"
						disabled
						onClick={handleSendProtocol}
						className="!bg-slate-900 !text-white !opacity-100 hover:!bg-slate-800 w-full sm:w-auto sm:min-w-[140px] h-[40px] px-4 py-2 rounded-lg text-sm font-medium border-0 gap-2 cursor-pointer shadow-none flex items-center justify-center shrink-0"
					>
						<Send className="h-4 w-4 shrink-0 text-white" />
						<Translate text={localizationConstants.protocolSendAction} />
					</Button>
				</div>
			</div>

			<CreateMeetingPointModal
				open={isCreatePointOpen}
				onClose={() => setIsCreatePointOpen(false)}
				onSave={handleSaveNewPoint}
				nextPointNr={nextPointNr}
				subtitleTranslationKey={localizationConstants.protocolCreateStandard}
			/>

			<EditMeetingPointModal
				open={!!editingPoint}
				onClose={() => setEditingPoint(null)}
				onSave={handleSaveEditedPoint}
				point={editingPoint}
				subtitleTranslationKey={localizationConstants.protocolCreateStandard}
			/>
		</div>
	);
}

export default ProtocolDetailView;
