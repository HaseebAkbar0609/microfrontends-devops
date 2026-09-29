"use client";

import { useRef, useState } from "react";
import { SquarePlus } from "lucide-react";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useWidgetBoard } from "../../hooks/useWidgetBoard";
import type { HomeWidgetId } from "../../types";
import { DraggableGridCard } from "../DraggableGridCard";
import BoardEmptyState from "./BoardEmptyState";
import BoardToolbar from "./BoardToolbar";
import BoardWidgetCard, { WIDGET_CARD_MIN_HEIGHT_CLASS } from "./BoardWidgetCard";
import DiscardChangesDialog from "./DiscardChangesDialog";
import WidgetLibraryPanel from "./WidgetLibraryPanel";

const BOARD_GRID_CLASS = "grid grid-cols-12 gap-2.5";
const BOARD_CELL_CLASS = "col-span-12 md:col-span-6 xl:col-span-4";

const WidgetBoard = () => {
	const t = useTranslate();
	const board = useWidgetBoard();
	const [libraryOpen, setLibraryOpen] = useState(true);
	const [discardOpen, setDiscardOpen] = useState(false);
	const [dropTargetUid, setDropTargetUid] = useState<string | null>(null);
	const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});

	const findSlotUidAt = (
		clientX: number,
		clientY: number,
		options: { emptyOnly?: boolean; skipUid?: string }
	) =>
		board.slots.find((slot) => {
			if (slot.uid === options.skipUid) return false;
			if (options.emptyOnly && slot.widgetId !== null) return false;
			const rect = slotRefs.current[slot.uid]?.getBoundingClientRect();
			return (
				!!rect &&
				clientX >= rect.left &&
				clientX <= rect.right &&
				clientY >= rect.top &&
				clientY <= rect.bottom
			);
		})?.uid ?? null;

	const handleSave = () => {
		const stored = board.save();
		showToast(
			stored ? "success" : "error",
			t(
				stored
					? localizationConstants.widgetBoardLayoutSaved
					: localizationConstants.widgetBoardSaveFailed
			)
		);
	};

	const handleRowDrop = (widgetId: HomeWidgetId, clientX: number, clientY: number) => {
		const target = findSlotUidAt(clientX, clientY, { emptyOnly: true });
		setDropTargetUid(null);
		if (target) board.dropWidget(widgetId, target);
	};

	const handleCardDrop = (uid: string, clientX: number, clientY: number) => {
		const target = findSlotUidAt(clientX, clientY, { skipUid: uid });
		setDropTargetUid(null);
		if (target) board.moveWidget(uid, target);
	};

	// localStorage is only readable after mount; render nothing for that one tick.
	if (board.isHydrating) return null;

	return (
		<div>
			<BoardToolbar
				editing={board.editing}
				libraryOpen={libraryOpen}
				onCustomize={board.enterEdit}
				onShowLibrary={() => setLibraryOpen(true)}
				onCancel={() => (board.dirty ? setDiscardOpen(true) : board.exitToView())}
				onSave={handleSave}
			/>

			<div className="flex flex-col gap-6 lg:flex-row">
				<div className="min-w-0 flex-1">
					{!board.editing && board.placedIds.length === 0 ? (
						<BoardEmptyState onAddWidgets={board.enterEdit} />
					) : (
						<div className={BOARD_GRID_CLASS}>
							{board.slots.map((slot) => {
								if (!board.editing) {
									if (slot.widgetId === null) return null;
									return (
										<div key={slot.uid} className={BOARD_CELL_CLASS}>
											<BoardWidgetCard
												widgetId={slot.widgetId}
												onMove={board.enterEdit}
												onRemove={() => board.beginRemoveWidget(slot.uid)}
											/>
										</div>
									);
								}

								const isTarget = dropTargetUid === slot.uid;
								return (
									<DraggableGridCard
										key={slot.uid}
										className={cn(BOARD_CELL_CLASS, isTarget && "!border-blue-500 bg-blue-50/60")}
										isEmpty={slot.widgetId === null}
										disabled={slot.widgetId === null}
										containerRef={(el) => {
											slotRefs.current[slot.uid] = el;
										}}
										onDragStart={() => setDropTargetUid(null)}
										onDrag={(x, y) => setDropTargetUid(findSlotUidAt(x, y, { skipUid: slot.uid }))}
										onDragStop={(x, y) => handleCardDrop(slot.uid, x, y)}
									>
										{slot.widgetId !== null ? (
											<BoardWidgetCard
												widgetId={slot.widgetId}
												editMode
												onRemove={() => board.removeWidget(slot.uid)}
											/>
										) : (
											<div
												className={cn(
													"flex flex-col items-center justify-center gap-2 text-sm",
													WIDGET_CARD_MIN_HEIGHT_CLASS,
													isTarget ? "text-blue-600" : "text-slate-400"
												)}
											>
												<SquarePlus className="h-5 w-5" aria-hidden />
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
				</div>

				{board.editing && libraryOpen && (
					<WidgetLibraryPanel
						placedIds={board.placedIds}
						onAdd={board.addWidget}
						onCollapse={() => setLibraryOpen(false)}
						onRowDrag={(x, y) => setDropTargetUid(findSlotUidAt(x, y, { emptyOnly: true }))}
						onRowDrop={handleRowDrop}
						onRowDragEnd={() => setDropTargetUid(null)}
					/>
				)}
			</div>

			<DiscardChangesDialog
				open={discardOpen}
				onOpenChange={setDiscardOpen}
				onDiscard={() => {
					setDiscardOpen(false);
					board.exitToView();
				}}
				onSave={() => {
					setDiscardOpen(false);
					handleSave();
				}}
			/>
		</div>
	);
};

export default WidgetBoard;
