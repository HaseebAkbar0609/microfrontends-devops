"use client";

import { useRef, useState } from "react";
import { Check, LayoutGrid, SquarePlus, PanelRightOpen } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { DraggableGridCard } from "@/features/widgetdashboard/components/DraggableGridCard";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useIsTeamAdmin } from "@/hooks/useIsTeamAdmin";
import { WidgetItem } from "../DraggableSidebarItem";
import { WidgetProps } from "../../types/dashboard";
import { useWidgetBoard } from "../../hooks/useWidgetBoard";
import BoardWidgetCard from "./BoardWidgetCard";
import WidgetLibraryPanel from "./WidgetLibraryPanel";

const BOARD_GRID_CLASS = "grid grid-cols-12 gap-2.5";
const BOARD_CELL_CLASS = "col-span-12 md:col-span-6 xl:col-span-4";

export interface WidgetBoardProps {
	widgetMap: Record<string, WidgetProps>;
	items: WidgetItem[];
	standardWidgetIds: string[];
	header?: React.ReactNode;
	belowGrid?: React.ReactNode;
}

const WidgetBoard = ({
	widgetMap,
	items,
	standardWidgetIds,
	header,
	belowGrid,
}: WidgetBoardProps) => {
	const t = useTranslate();
	const board = useWidgetBoard(items, standardWidgetIds);
	const isAdmin = useIsTeamAdmin();
	const [libraryOpen, setLibraryOpen] = useState(true);
	const [discardOpen, setDiscardOpen] = useState(false);
	const [dropTargetUid, setDropTargetUid] = useState<string | null>(null);

	const editing = board.mode === "edit";
	const hasOwnWidgets = board.slots.some((slot) => slot.widgetId !== null);

	const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});
	const findSlotUidAt = (
		clientX: number,
		clientY: number,
		options?: { emptyOnly?: boolean; skipUid?: string },
	) => {
		for (const slot of board.slots) {
			if (options?.skipUid === slot.uid) continue;
			if (options?.emptyOnly && slot.widgetId !== null) continue;
			const el = slotRefs.current[slot.uid];
			if (!el) continue;
			const rect = el.getBoundingClientRect();
			if (
				clientX >= rect.left &&
				clientX <= rect.right &&
				clientY >= rect.top &&
				clientY <= rect.bottom
			) {
				return slot.uid;
			}
		}
		return null;
	};

	const handleCancel = () => {
		if (board.dirty) setDiscardOpen(true);
		else board.exitToView();
	};

	const handleSave = () => {
		board.save();
		showToast("success", t(localizationConstants.widgetBoardLayoutSaved));
	};

	const handleRowDrag = (clientX: number, clientY: number) =>
		setDropTargetUid(findSlotUidAt(clientX, clientY, { emptyOnly: true }));

	const handleRowDrop = (
		widgetId: string,
		clientX: number,
		clientY: number,
	) => {
		const target = findSlotUidAt(clientX, clientY, { emptyOnly: true });
		setDropTargetUid(null);
		if (target) board.dropWidget(widgetId, target);
	};

	const handleCardDrag = (uid: string, clientX: number, clientY: number) =>
		setDropTargetUid(findSlotUidAt(clientX, clientY, { skipUid: uid }));

	const handleCardDrop = (uid: string, clientX: number, clientY: number) => {
		const target = findSlotUidAt(clientX, clientY, { skipUid: uid });
		setDropTargetUid(null);
		if (target) board.moveWidget(uid, target);
	};

	return (
		<div className="min-h-screen">
			{header}
			{editing ? (
				<div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-slate-100 px-4 py-3">
					<div className="flex items-center gap-3">
						<LayoutGrid size={18} className="text-slate-600" />
						<div>
							<p className="text-sm font-semibold text-slate-900">
								<Translate
									text={
										localizationConstants.widgetBoardEditMode
									}
								/>
							</p>
							<p className="text-xs text-slate-500">
								<Translate
									text={
										localizationConstants.widgetBoardEditModeHint
									}
								/>
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{!libraryOpen && (
							<Button
								type="button"
								variant="outline"
								onClick={() => setLibraryOpen(true)}
								className="h-9 gap-1.5 rounded-md border-slate-200 bg-white px-3 text-sm"
							>
								<PanelRightOpen className="h-4 w-4" />
								<Translate
									text={
										localizationConstants.widgetBoardShowLibrary
									}
								/>
							</Button>
						)}
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							className="h-9 rounded-md border-slate-200 bg-white px-4 text-sm"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="button"
							onClick={handleSave}
							className="h-9 gap-1.5 rounded-md bg-slate-900 px-4 text-sm text-white hover:bg-slate-900/90"
						>
							<Check className="h-4 w-4" />
							<Translate
								text={
									localizationConstants.widgetBoardSaveLayout
								}
							/>
						</Button>
					</div>
				</div>
			) : (
				<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
					<p className="text-sm text-slate-500">
						{board.savedAtLabel ? (
							<>
								<Translate
									text={
										localizationConstants.widgetBoardSavedLayout
									}
								/>
								{" · "}
								<Translate
									text={
										localizationConstants.widgetBoardUpdatedToday
									}
								/>{" "}
								{board.savedAtLabel}
							</>
						) : (
							<Translate
								text={localizationConstants.widgetBoardNoLayout}
							/>
						)}
					</p>
					<Button
						type="button"
						variant="outline"
						onClick={board.enterEdit}
						className="h-9 gap-1.5 rounded-md border-slate-200 bg-white px-3 text-sm"
					>
						<LayoutGrid className="h-4 w-4" />
						<Translate
							text={localizationConstants.widgetBoardCustomize}
						/>
					</Button>
				</div>
			)}

			<div className="flex flex-col gap-6 lg:flex-row">
				<div className="flex-1">
					{!editing && (
						<p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
							<Translate
								text={
									localizationConstants.widgetBoardAdminSection
								}
							/>
						</p>
					)}
					<div className={BOARD_GRID_CLASS}>
						{board.standardItems.map((item) => (
							<div key={item.id} className={BOARD_CELL_CLASS}>
								<BoardWidgetCard
									locked
									editMode={editing}
									widget={
										widgetMap[item.id] ?? {
											title: item.label,
											icon: item.icon,
										}
									}
								/>
							</div>
						))}
					</div>

					{!editing && !hasOwnWidgets ? (
						<div className="mt-6">
							<p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
								<Translate
									text={
										localizationConstants.widgetBoardOwnSection
									}
								/>
							</p>
							<div className="flex flex-col items-center rounded-md border-2 border-dashed border-slate-200 px-6 py-16 text-center">
								<div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100">
									<LayoutGrid
										size={22}
										className="text-slate-600"
									/>
								</div>
								<h3 className="mt-4 text-lg font-semibold text-slate-900">
									<Translate
										text={
											localizationConstants.widgetBoardBuildTitle
										}
									/>
								</h3>
								<p className="mt-2 max-w-xl text-sm text-slate-500">
									<Translate
										text={
											localizationConstants.widgetBoardBuildBody
										}
									/>
								</p>
								<Button
									type="button"
									onClick={board.enterEdit}
									className="mt-5 h-10 gap-2 rounded-md bg-slate-900 px-4 text-sm text-white hover:bg-slate-900/90"
								>
									<SquarePlus className="h-4 w-4" />
									<Translate
										text={
											localizationConstants.widgetBoardAddWidgets
										}
									/>
								</Button>
								<p className="mt-3 text-xs text-slate-400">
									<Translate
										text={
											localizationConstants.widgetBoardBuildHint
										}
									/>
								</p>
							</div>
						</div>
					) : (
						<div className={cn(BOARD_GRID_CLASS, "mt-2.5")}>
							{board.slots.map((slot) => {
								const isTarget = dropTargetUid === slot.uid;
								const widget =
									slot.widgetId !== null
										? widgetMap[slot.widgetId]
										: null;

								if (!editing) {
									if (!widget) return null;
									return (
										<div
											key={slot.uid}
											className={BOARD_CELL_CLASS}
										>
											<BoardWidgetCard
												widget={widget}
												onMove={board.enterEdit}
												onRemove={board.enterEdit}
											/>
										</div>
									);
								}

								return (
									<DraggableGridCard
										key={slot.uid}
										className={cn(
											BOARD_CELL_CLASS,
											isTarget &&
												"!border-blue-500 bg-blue-50/60",
										)}
										isEmpty={widget === null}
										containerRef={(el) => {
											slotRefs.current[slot.uid] = el;
										}}
										onDragStart={() =>
											setDropTargetUid(null)
										}
										onDrag={(x, y) =>
											handleCardDrag(slot.uid, x, y)
										}
										onDragStop={(x, y) =>
											handleCardDrop(slot.uid, x, y)
										}
									>
										{widget ? (
											<BoardWidgetCard
												widget={widget}
												editMode
												onRemove={() =>
													board.removeWidget(slot.uid)
												}
											/>
										) : (
											<div
												className={cn(
													"flex min-h-[281px] flex-col items-center justify-center gap-2 text-sm",
													isTarget
														? "text-blue-600"
														: "text-slate-400",
												)}
											>
												<SquarePlus className="h-5 w-5" />
												<Translate
													text={
														isTarget
															? localizationConstants.widgetBoardDropHere
															: localizationConstants.widgetBoardDragHere
													}
												/>
											</div>
										)}
									</DraggableGridCard>
								);
							})}
						</div>
					)}

					{belowGrid && <div className="mt-6">{belowGrid}</div>}
				</div>

				{editing && libraryOpen && (
					<WidgetLibraryPanel
						isAdmin={isAdmin}
						libraryItems={board.libraryItems}
						standardItems={board.standardItems}
						placedIds={board.placedIds}
						onAdd={board.addWidget}
						onCollapse={() => setLibraryOpen(false)}
						onSetStandard={board.setAsStandard}
						onRemoveStandard={board.removeStandard}
						onHideForTeam={(id) => {
							board.hideForTeam(id);
							showToast(
								"info",
								t(localizationConstants.widgetBoardHiddenToast),
							);
						}}
						onRowDrag={handleRowDrag}
						onRowDrop={handleRowDrop}
						onRowDragEnd={() => setDropTargetUid(null)}
					/>
				)}
			</div>

			<AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Translate
								text={
									localizationConstants.widgetBoardDiscardTitle
								}
							/>
						</AlertDialogTitle>
						<AlertDialogDescription>
							<Translate
								text={
									localizationConstants.widgetBoardDiscardBody
								}
							/>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => {
								setDiscardOpen(false);
								board.exitToView();
							}}
						>
							<Translate
								text={localizationConstants.widgetBoardDiscard}
							/>
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								setDiscardOpen(false);
								handleSave();
							}}
							className="gap-1.5 bg-slate-900 hover:bg-slate-900/90"
						>
							<Check className="h-4 w-4" />
							<Translate
								text={
									localizationConstants.widgetBoardSaveLayout
								}
							/>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default WidgetBoard;
