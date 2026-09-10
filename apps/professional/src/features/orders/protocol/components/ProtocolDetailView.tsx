"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
	ArrowLeft,
	ChevronUp,
	Info,
	Video,
	Plus,
	MoreVertical,
	PencilLine,
	Archive,
	Trash2,
	Save,
	Send,
} from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_CONSTANTS } from "../constants/protocol.constants";
import { protocolsApi } from "../api/protocols.api";
import type {
	ProtocolItem,
	ProtocolDetailData,
	ProtocolMeetingPoint,
	ProtocolMeetingInfo,
} from "../types/protocol.types";
import { CreateMeetingPointModal } from "./CreateMeetingPointModal";
import { EditMeetingPointModal } from "./EditMeetingPointModal";

/* -------------------------------------------------------------------------- */
/* Sub-component: InfoItem matching project standard                         */
/* -------------------------------------------------------------------------- */
function InfoItem({ label, value }: { label: string; value?: string | number }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
				{label}
			</span>
			<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
				{value !== undefined && value !== null && String(value).trim() !== "" ? String(value) : "—"}
			</span>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Sub-component: Meeting Accordion Card matching project standard            */
/* -------------------------------------------------------------------------- */
interface MeetingAccordionCardProps {
	titleKey: string;
	icon: React.ReactNode;
	info?: ProtocolMeetingInfo;
	defaultOpen?: boolean;
}

function MeetingAccordionCard({
	titleKey,
	icon,
	info,
	defaultOpen = true,
}: MeetingAccordionCardProps) {
	const t = useTranslate();
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const startDateTime =
		[info?.startTime, info?.startDate].filter(Boolean).join(" | ") ||
		"15:00 | 2024-12-17";
	const endDateTime =
		[info?.endTime, info?.endDate].filter(Boolean).join(" | ") ||
		"17:00 | 2024-12-17";
	const participantsStr =
		info?.participants?.join(", ") || "Robert Hellgren, Thao Nghiem";

	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs w-full flex flex-col">
			{/* Card Header matching project standard */}
			<Button
				type="button"
				variant="ghost"
				onClick={() => setIsOpen((prev) => !prev)}
				className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between px-6 sm:px-8 py-0 text-left transition-colors hover:bg-slate-50 font-normal rounded-none shadow-none focus:outline-none"
				aria-expanded={isOpen}
			>
				<div className="flex items-center gap-3">
					<span className="flex items-center shrink-0 text-slate-800">{icon}</span>
					<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
						{t(titleKey)}
					</span>
				</div>
				<ChevronUp
					size={18}
					className={cn(
						"text-zinc-500 transition-transform duration-200 shrink-0",
						!isOpen && "rotate-180"
					)}
					aria-hidden={true}
				/>
			</Button>

			{/* Card Body */}
			{isOpen && (
				<div className="border-t border-slate-200 px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
					{/* Column 1 */}
					<div className="space-y-4">
						<InfoItem label={t(localizationConstants.protocolFieldHost)} value={info?.host || PROTOCOL_CONSTANTS.DEFAULT_RESPONSIBLE} />
						<InfoItem label={t(localizationConstants.protocolPointSubject)} value={info?.topic || "-"} />
						<InfoItem label={t(localizationConstants.protocolFieldTitle)} value={info?.rubrik || PROTOCOL_CONSTANTS.DEFAULT_POINT_SUBJECT} />
						<InfoItem label={t(localizationConstants.protocolFieldAddress)} value={info?.address || "-"} />
						<InfoItem label={t(localizationConstants.protocolFieldInformation)} value={info?.information || "-"} />
					</div>

					{/* Column 2 */}
					<div className="space-y-4">
						<InfoItem label={t(localizationConstants.protocolFieldStartTime)} value={startDateTime} />
						<InfoItem label={t(localizationConstants.protocolFieldNumber)} value={info?.protocolNumber || "000-01"} />
						<InfoItem label={t(localizationConstants.protocolFieldCategory)} value={info?.category || PROTOCOL_CONSTANTS.DEFAULT_CATEGORY} />
						<InfoItem label={t(localizationConstants.protocolFieldPostalCode)} value={info?.postalCode || PROTOCOL_CONSTANTS.DEFAULT_POSTAL_CODE} />
						<InfoItem label={t(localizationConstants.protocolFieldComment)} value={info?.comment || "-"} />
					</div>

					{/* Column 3 */}
					<div className="space-y-4">
						<InfoItem label={t(localizationConstants.protocolFieldEndTime)} value={endDateTime} />
						<InfoItem label={t(localizationConstants.protocolFieldParticipants)} value={participantsStr} />
						<InfoItem label={t(localizationConstants.protocolFieldLocation)} value={info?.location || PROTOCOL_CONSTANTS.DEFAULT_LOCATION} />
						<InfoItem label={t(localizationConstants.protocolFieldCity)} value={info?.city || PROTOCOL_CONSTANTS.DEFAULT_CITY} />
					</div>
				</div>
			)}
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Sub-component: Project Information Sidebar Card                           */
/* -------------------------------------------------------------------------- */
function ProjectInfoCard({
	projectNumber = PROTOCOL_CONSTANTS.DEFAULT_PROJECT_NUMBER,
	projectName = PROTOCOL_CONSTANTS.DEFAULT_PROJECT_NAME,
}: {
	projectNumber?: string;
	projectName?: string;
}) {
	const t = useTranslate();
	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs p-5 sm:p-6 h-fit space-y-4">
			<h3 className="font-sans text-base font-semibold leading-6 tracking-normal text-slate-900">
				<Translate text={localizationConstants.protocolProjectInfoTitle} />
			</h3>
			<div className="space-y-4">
				<InfoItem label={t(localizationConstants.protocolProjectNr)} value={projectNumber} />
				<InfoItem label={t(localizationConstants.protocolProjectName)} value={projectName} />
			</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Sub-component: Status Legend Popover                                        */
/* -------------------------------------------------------------------------- */
const STATUS_OPTIONS = [
	{ key: "in_progress", color: "bg-orange-500", inactiveColor: "bg-orange-300", translationKey: "protocolPointStatusOngoing" as const },
	{ key: "completed", color: "bg-green-600", inactiveColor: "bg-green-300", translationKey: "protocolPointStatusDone" as const },
	{ key: "not_started", color: "bg-red-600", inactiveColor: "bg-red-300", translationKey: "protocolPointStatusNotDone" as const },
] as const;

function StatusLegendPopover() {
	const [isOpen, setIsOpen] = useState(false);
	const t = useTranslate();

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onMouseEnter={() => setIsOpen(true)}
					onMouseLeave={() => setIsOpen(false)}
					onFocus={() => setIsOpen(true)}
					onBlur={() => setIsOpen(false)}
					className="h-4 w-4 cursor-pointer shrink-0 p-0 hover:bg-slate-200"
					aria-label={t(localizationConstants.ariaLabelStatusLegend)}
				>
					<Info className="h-4 w-4 text-slate-500" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				sideOffset={4}
				onMouseEnter={() => setIsOpen(true)}
				onMouseLeave={() => setIsOpen(false)}
				className="w-36 p-0 rounded-lg shadow-lg border-0"
			>
				<div className="relative bg-slate-900 text-white rounded-lg py-2 px-3">
					<div className="absolute -top-[5px] left-3 h-0 w-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-slate-900" />
					<p className="text-xs font-medium mb-2 font-sans leading-4 tracking-normal">
						<Translate text={localizationConstants.protocolPointStatusPick} />
					</p>
					<div className="flex flex-col gap-1.5">
						{STATUS_OPTIONS.map((opt) => (
							<div key={opt.key} className="flex items-center gap-2">
								<span className={cn("h-3.5 w-3.5 rounded-[3px] shrink-0", opt.color)} />
								<span className="text-xs font-medium font-sans leading-4 tracking-normal">
									<Translate text={localizationConstants[opt.translationKey]} />
								</span>
							</div>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

/* -------------------------------------------------------------------------- */
/* Sub-component: Status Circles for a row                                    */
/* -------------------------------------------------------------------------- */
function StatusCircles({
	status,
	onChangeStatus,
	pointId,
}: {
	status?: string;
	onChangeStatus: (pointId: string, status: string) => void;
	pointId: string;
}) {
	const t = useTranslate();
	return (
		<div className="flex items-center gap-5">
			{STATUS_OPTIONS.map((opt) => {
				const isActive = status === opt.key;
				const bgColor = isActive ? opt.color : opt.inactiveColor;
				const colorMap: Record<string, string> = {
					"bg-orange-500": "#f97316",
					"bg-orange-300": "#fdba74",
					"bg-green-600": "#16a34a",
					"bg-green-300": "#86efac",
					"bg-red-600": "#dc2626",
					"bg-red-300": "#fca5a5",
				};
				return (
					<Button
						key={opt.key}
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => onChangeStatus(pointId, opt.key)}
						style={{ backgroundColor: colorMap[bgColor] || "transparent" }}
						className={cn(
							"h-3.5 w-3.5 rounded-[3px] flex items-center justify-center cursor-pointer shrink-0 p-0 border border-solid",
							"focus-visible:ring-0 focus-visible:ring-offset-0",
							isActive ? "border-slate-900" : "border-slate-400"
						)}
						aria-label={t(localizationConstants[opt.translationKey])}
					>
						{isActive && (
							<span className="flex items-center justify-center leading-none" style={{ width: "8px", height: "5.5px" }}>
								<svg
									viewBox="0 0 12 8"
									fill="none"
									stroke="white"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									style={{ width: "100%", height: "100%" }}
								>
									<polyline points="1 4 4.5 7 11 1" />
								</svg>
							</span>
						)}
					</Button>
				);
			})}
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Sub-component: Points Table Card                                           */
/* -------------------------------------------------------------------------- */
interface PointsSectionProps {
	points: ProtocolMeetingPoint[];
	onAddPoint: () => void;
	onEditPoint: (point: ProtocolMeetingPoint) => void;
	onDeletePoint: (pointId: string) => void;
	onChangeStatus: (pointId: string, status: string) => void;
}

function PointsSection({
	points,
	onAddPoint,
	onEditPoint,
	onDeletePoint,
	onChangeStatus,
}: PointsSectionProps) {
	const [deletingPointId, setDeletingPointId] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const totalPages = Math.max(1, Math.ceil(points.length / pageSize));
	const startIndex = (currentPage - 1) * pageSize;
	const currentPoints = points.slice(startIndex, startIndex + pageSize);

	return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs w-full flex flex-col">
      {/* Header bar */}
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

      {/* Points Table */}
      {points.length === 0 ? (
        <div className="text-center py-12 px-4 text-slate-400 text-xs">
          <Translate text={localizationConstants.protocolEmptyPoints} />
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-187.5 text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 font-medium">
                <th className="py-3.5 px-6 w-20 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
                  <Translate text={localizationConstants.protocolPointColNr} />
                </th>
                <th className="py-3.5 px-4 min-w-60 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
                  <Translate
                    text={localizationConstants.protocolPointSubject}
                  />
                </th>
                <th className="py-3.5 px-4 min-w-35 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
                  <Translate
                    text={localizationConstants.protocolPointColDecision}
                  />
                </th>
                <th className="py-3.5 px-4 min-w-35 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
                  <Translate
                    text={localizationConstants.protocolFieldResponsible}
                  />
                </th>
                <th className="py-3.5 px-4 font-sans text-sm font-medium text-slate-500 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Translate
                      text={localizationConstants.protocolPointColStatus}
                    />
                    <StatusLegendPopover />
                  </div>
                </th>
                <th className="py-3.5 px-4 w-12 text-right font-sans text-sm font-medium text-slate-500 whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {currentPoints.map((point) => (
                <tr
                  key={point.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  {/* Nr */}
                  <td className="py-4 px-6 text-slate-900 align-middle whitespace-nowrap font-sans text-sm font-normal">
                    {point.nr || "0001"}
                  </td>

                  {/* Ämne & Description */}
                  <td className="py-4 px-4 align-middle whitespace-nowrap">
                    <div className="font-sans text-sm font-semibold text-slate-900 whitespace-nowrap">
                      {point.subject}
                    </div>
                    {point.description && (
                      <div className="font-sans text-xs text-slate-400 mt-0.5 leading-normal whitespace-nowrap">
                        {point.description}
                      </div>
                    )}
                  </td>

                  {/* Beslut */}
                  <td className="py-4 px-4 text-slate-900 align-middle whitespace-nowrap font-sans text-sm font-normal">
                    {point.decision || "—"}
                  </td>

                  {/* Ansvarig */}
                  <td className="py-4 px-4 text-slate-900 align-middle whitespace-nowrap font-sans text-sm font-normal">
                    {point.responsible || "—"}
                  </td>

                  {/* Status Circles */}
                  <td className="py-4 px-4 align-middle whitespace-nowrap">
                    <StatusCircles
                      status={point.status}
                      onChangeStatus={onChangeStatus}
                      pointId={point.id}
                    />
                  </td>

                  {/* Row Actions */}
                  <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
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
                          onClick={() => {
                            const nextStatus =
                              point.status === "completed"
                                ? "in_progress"
                                : point.status === "in_progress"
                                  ? "not_started"
                                  : "completed";
                            onChangeStatus(point.id, nextStatus);
                          }}
                          className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-normal text-black cursor-pointer rounded-md hover:bg-slate-100 transition-colors"
                        >
                          <Archive className="h-4 w-4 shrink-0 text-black" />
                          <Translate
                            text={localizationConstants.protocolChangeStatus}
                          />
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
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

      {/* Delete Point Confirmation Dialog */}
      <AlertDialog
        open={!!deletingPointId}
        onOpenChange={(val) => !val && setDeletingPointId(null)}
      >
        <AlertDialogContent className="w-[calc(100vw-2rem)] max-w-md bg-white border border-slate-200 shadow-xl rounded-xl p-5 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans text-lg font-semibold text-slate-900">
              <Translate
                text={localizationConstants.protocolDeletePointConfirmTitle}
              />
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans text-sm text-slate-500">
              <Translate
                text={localizationConstants.protocolDeletePointConfirmDesc}
              />
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
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Container: ProtocolDetailView                                        */
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

	// Modal states
	const [isCreatePointOpen, setIsCreatePointOpen] = useState(false);
	const [editingPoint, setEditingPoint] = useState<ProtocolMeetingPoint | null>(null);

	// Load detail data
	useEffect(() => {
		let isMounted = true;
		const loadDetail = async () => {
			setIsLoading(true);
			try {
				const data = await protocolsApi.getProtocolFullDetail(protocolId, orderId);
				if (isMounted) {
					setDetailData(data);
				}
			} catch (err) {
				console.error("Failed to load protocol details", err);
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
	}, [protocolId, orderId]);

	// Meeting point handlers
	const handleAddPointClick = () => {
		setEditingPoint(null);
		setIsCreatePointOpen(true);
	};

	const handleEditPointClick = (point: ProtocolMeetingPoint) => {
		setEditingPoint(point);
	};

	const handleSaveNewPoint = async (point: ProtocolMeetingPoint) => {
		if (!detailData) return;
		try {
			const saved = await protocolsApi.createPoint(protocolId, {
				nr: point.nr,
				subject: point.subject,
				description: point.description,
				decision: point.decision,
				responsible: point.responsible,
				status: point.status,
			}, orderId);
			setDetailData({
				...detailData,
				points: [...detailData.points, saved],
			});
			toast.success(t(localizationConstants.protocolPointSavedToast));
		} catch (err) {
			console.error("Failed to create point", err);
			toast.error(t(localizationConstants.protocolPointSavedToast));
		}
	};

	const handleSaveEditedPoint = async (point: ProtocolMeetingPoint) => {
		if (!detailData) return;
		try {
			const saved = await protocolsApi.updatePoint(protocolId, point.id, {
				subject: point.subject,
				description: point.description,
				decision: point.decision,
				responsible: point.responsible,
				status: point.status,
			}, orderId);
			const updatedPoints = detailData.points.map((p) => (p.id === point.id ? saved : p));
			setDetailData({
				...detailData,
				points: updatedPoints,
			});
			toast.success(t(localizationConstants.protocolPointSavedToast));
		} catch (err) {
			console.error("Failed to update point", err);
			toast.error(t(localizationConstants.protocolPointSavedToast));
		}
	};

	const handleDeletePoint = async (pointId: string) => {
		if (!detailData) return;
		try {
			await protocolsApi.deletePoint(protocolId, pointId, orderId);
			setDetailData({
				...detailData,
				points: detailData.points.filter((p) => p.id !== pointId),
			});
			toast.success(t(localizationConstants.protocolPointDeletedToast));
		} catch (err) {
			console.error("Failed to delete point", err);
			toast.error(t(localizationConstants.protocolPointDeletedToast));
		}
	};

	const handleChangeStatus = async (pointId: string, status: string) => {
		if (!detailData) return;
		try {
			const saved = await protocolsApi.updatePointStatus(protocolId, pointId, status, orderId);
			setDetailData({
				...detailData,
				points: detailData.points.map((p) => (p.id === pointId ? { ...p, ...saved } : p)),
			});
			toast.success(t(localizationConstants.protocolPointSavedToast));
		} catch (err) {
			console.error("Failed to update point status", err);
			toast.error(t(localizationConstants.protocolPointSavedToast));
		}
	};

	const handleSaveProtocol = async () => {
		if (!detailData) return;
		setIsSaving(true);
		try {
			await protocolsApi.updateProtocol(
				protocolId,
				{
					notes: detailData.meetingInfo.information,
				},
				orderId
			);
			toast.success(t(localizationConstants.protocolSavedToast));
		} catch (err) {
			console.error("Failed to save protocol", err);
		} finally {
			setIsSaving(false);
		}
	};

	const handleSendProtocol = () => {
		toast.success(t(localizationConstants.protocolSentToast));
	};

	const nextPointNr = useMemo(() => {
		if (!detailData || detailData.points.length === 0) return "008";
		const count = String(detailData.points.length + 1).padStart(3, "0");
		return count;
	}, [detailData]);

	if (isLoading) {
		return (
      <div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-13 -mr-4 sm:-mr-6 -mt-px px-3 sm:px-6 pt-5 sm:pt-7 pb-0 bg-slate-50">
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
    <div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-13 -mr-4 sm:-mr-6 -mt-px -mb-4 px-3 sm:px-6 pt-5 sm:pt-7 pb-0 bg-slate-50 justify-between">
      <div className="space-y-4 w-full pb-8">
        {/* Back button & Page Title */}
        <div className="flex items-center gap-2 pb-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="size-7 shrink-0 rounded-md text-slate-900 hover:bg-slate-100 cursor-pointer flex items-center justify-center p-0 shadow-none"
            aria-label={t(localizationConstants.goBackButton)}
          >
            <ArrowLeft className="size-5 text-slate-900" aria-hidden="true" />
          </Button>
          <h1 className="font-sans text-lg sm:text-xl md:text-2xl font-semibold leading-[100%] tracking-[-0.6px] text-slate-900">
            <Translate text={localizationConstants.protocolViewTitle} />
          </h1>
        </div>

        {/* Cards Container with left margin */}
        <div className="space-y-4 w-full pl-0 sm:pl-7">
          {/* Main Grid Layout: Left Column (Mötesinformation, Nästa möte, Mötespunkter) + Right Sidebar (Project info) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
            {/* Left Column */}
            <div className="order-2 lg:order-1 lg:col-span-9 space-y-4 sm:space-y-6">
              {/* Mötesinformation Accordion */}
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

              {/* Nästa möte Accordion */}
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

              {/* Mötespunkter Table */}
              <PointsSection
                points={detailData?.points || []}
                onAddPoint={handleAddPointClick}
                onEditPoint={handleEditPointClick}
                onDeletePoint={handleDeletePoint}
                onChangeStatus={handleChangeStatus}
              />
            </div>

            {/* Right Sidebar */}
            <div className="order-1 lg:order-2 lg:col-span-3 lg:mt-[56px] w-full">
              <ProjectInfoCard
                projectNumber={detailData?.protocol.projectNumber || "5001"}
                projectName={
                  detailData?.protocol.projectName || "Kv Skatan, Storgatan 10"
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar — Sticky to bottom */}
      <div className="mt-auto sticky -bottom-4 -mx-3 sm:-mx-6 -mb-4 px-4 sm:px-6 py-3 bg-white border-t border-slate-200 z-30 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-3 shadow-md">
        {/* Left Buttons: Avbryt & Ändra */}
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
            <Translate
              text={localizationConstants.protocolEditProtocolAction}
            />
          </Button>
        </div>

        {/* Right Buttons: Spara & Skicka */}
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
            onClick={handleSendProtocol}
            className="w-full sm:w-auto sm:min-w-[140px] h-[40px] px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium border-0 gap-2 cursor-pointer shadow-none flex items-center justify-center shrink-0"
          >
            <Send className="h-4 w-4 shrink-0 text-white" />
            <Translate text={localizationConstants.protocolSendAction} />
          </Button>
        </div>
      </div>

      {/* 1. Create Meeting Point Modal (Separate component) */}
      <CreateMeetingPointModal
        open={isCreatePointOpen}
        onClose={() => setIsCreatePointOpen(false)}
        onSave={handleSaveNewPoint}
        nextPointNr={nextPointNr}
      />

      {/* 2. Edit Meeting Point Modal (Separate component) */}
      <EditMeetingPointModal
        open={!!editingPoint}
        onClose={() => setEditingPoint(null)}
        onSave={handleSaveEditedPoint}
        point={editingPoint}
      />
    </div>
  );
}

export default ProtocolDetailView;
