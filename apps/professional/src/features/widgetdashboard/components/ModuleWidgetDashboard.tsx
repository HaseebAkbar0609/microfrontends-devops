"use client";

import React, { useRef, useState } from "react";
import { Layers, LayoutGrid } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import useModal from "@/features/auth/hooks/useModal";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DashboardWidget } from "./DashboardWidget";
import { DraggableGridCard } from "./DraggableGridCard";
import { WidgetItem } from "./DraggableSidebarItem";
import { SidebarWidgetList } from "./SidebarWidgetList";
import { useWidgetToggle } from "../hooks/useWidgetToggle";
import { PlacedWidgetEntry, WidgetProps } from "../types/dashboard";

type DashboardModalType = "REPLACE_WIDGET" | "REMOVE_WIDGET";

export interface ModuleWidgetDashboardProps {
	widgetMap: Record<string, WidgetProps>;
	initialWidgets: PlacedWidgetEntry[];
	sidebarItems: WidgetItem[];
	gridHeader?: React.ReactNode;
	belowGrid?: React.ReactNode;
	panelHeader?: React.ReactNode;
	className?: string;
}

export function ModuleWidgetDashboard({
	widgetMap,
	initialWidgets,
	sidebarItems,
	gridHeader,
	belowGrid,
	panelHeader,
	className,
}: ModuleWidgetDashboardProps) {
	const t = useTranslate();
	const [selectedItem, setSelectedItem] = useState<string>("emptyPage");
	const [panelOpen, setPanelOpen] = useState(true);
	const {
		placedWidgets,
		setPlacedWidgets,
		widgetsVisible,
		handleWidgetsToggle,
		resumeAfterDrop,
	} = useWidgetToggle(widgetMap, initialWidgets);
	const [highlightedWidgetUid, setHighlightedWidgetUid] = useState<
		string | null
	>(null);

	const replacementModal = useModal<DashboardModalType>();
	const [pendingReplacement, setPendingReplacement] = useState<{
		item: WidgetItem;
		index: number;
	} | null>(null);

	const placedSidebarIds = placedWidgets
		.map((w) => w.sidebarId)
		.filter((id): id is string => !!id);

	const dropZoneRef = useRef<HTMLDivElement>(null);
	const sidebarRef = useRef<HTMLDivElement>(null);

	const [gridDragOverIndex, setGridDragOverIndex] = useState<number | null>(
		null,
	);
	const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

	const findCardIndexAt = (
		clientX: number,
		clientY: number,
		skipIndex?: number,
	) => {
		let match: number | null = null;
		cardRefs.current.forEach((ref, idx) => {
			if (idx === skipIndex || !ref) return;
			const rect = ref.getBoundingClientRect();
			if (
				clientX >= rect.left &&
				clientX <= rect.right &&
				clientY >= rect.top &&
				clientY <= rect.bottom
			) {
				match = idx;
			}
		});
		return match;
	};

	const handleSidebarItemClick = (id: string) => {
		setSelectedItem(id);
		const existing = placedWidgets.find((w) => w.sidebarId === id);
		if (existing) {
			setHighlightedWidgetUid(existing.uid);
			setTimeout(() => setHighlightedWidgetUid(null), 2000);
		}
	};

	const handleSidebarDrop = (
		item: WidgetItem,
		clientX: number,
		clientY: number,
	) => {
		if (placedSidebarIds.includes(item.id)) return;

		const dropIndex = findCardIndexAt(clientX, clientY);

		if (dropIndex !== null) {
			resumeAfterDrop();
			const targetWidget = placedWidgets[dropIndex];

			if (targetWidget.sidebarId === "emptyPage") {
				const widgetProps = widgetMap[item.id] ?? {
					title: item.label,
					icon: item.icon,
				};

				setPlacedWidgets((prev) => {
					const next = [...prev];
					next[dropIndex] = {
						...next[dropIndex],
						sidebarId: item.id,
						widgetProps,
					};
					return next;
				});
			} else {
				setPendingReplacement({ item, index: dropIndex });
				replacementModal.openModal("REPLACE_WIDGET");
			}
		}

		setGridDragOverIndex(null);
	};

	const confirmReplacement = () => {
		if (!pendingReplacement) return;

		const { item, index } = pendingReplacement;
		const widgetProps = widgetMap[item.id] ?? {
			title: item.label,
			icon: item.icon,
		};

		setPlacedWidgets((prev) => {
			const next = [...prev];
			next[index] = { ...next[index], sidebarId: item.id, widgetProps };
			return next;
		});

		replacementModal.closeModal();
		setPendingReplacement(null);
	};

	const cancelDialog = () => {
		replacementModal.closeModal();
		setPendingReplacement(null);
	};

	const confirmRemoval = () => {
		if (!pendingReplacement) return;
		const { index } = pendingReplacement;

		setPlacedWidgets((prev) => {
			const next = [...prev];
			next[index] = {
				...next[index],
				sidebarId: "emptyPage",
				widgetProps: widgetMap.emptyPage,
			};
			return next;
		});

		replacementModal.closeModal();
		setPendingReplacement(null);
	};

	const handleSidebarDrag = (clientX: number, clientY: number) => {
		setGridDragOverIndex(findCardIndexAt(clientX, clientY));
	};

	const handleGridCardDrag = (
		fromIndex: number,
		clientX: number,
		clientY: number,
	) => {
		setGridDragOverIndex(findCardIndexAt(clientX, clientY, fromIndex));
	};

	const handleGridCardDrop = (
		fromIndex: number,
		clientX: number,
		clientY: number,
	) => {
		const dropIndex = findCardIndexAt(clientX, clientY, fromIndex);

		if (dropIndex !== null) {
			setPlacedWidgets((prev) => {
				const next = [...prev];
				const fromItem = next[fromIndex];
				const toItem = next[dropIndex];

				next[fromIndex] = {
					...fromItem,
					uid: toItem.uid,
					sidebarId: toItem.sidebarId,
					widgetProps: toItem.widgetProps,
				};
				next[dropIndex] = {
					...toItem,
					uid: fromItem.uid,
					sidebarId: fromItem.sidebarId,
					widgetProps: fromItem.widgetProps,
				};
				return next;
			});
		} else if (sidebarRef.current) {
			const sbRect = sidebarRef.current.getBoundingClientRect();
			const isOverSidebar =
				clientX >= sbRect.left &&
				clientX <= sbRect.right &&
				clientY >= sbRect.top &&
				clientY <= sbRect.bottom;

			if (
				isOverSidebar &&
				placedWidgets[fromIndex].sidebarId !== "emptyPage"
			) {
				setPendingReplacement({
					item: { id: "removing", label: "", icon: Layers },
					index: fromIndex,
				});
				replacementModal.openModal("REMOVE_WIDGET");
			}
		}

		setGridDragOverIndex(null);
	};

	return (
		<div className={cn("min-h-screen", className)}>
			<div className="mb-2.5 flex justify-end">
				<button
					type="button"
					onClick={() => setPanelOpen((prev) => !prev)}
					aria-expanded={panelOpen}
					aria-label={t(localizationConstants.widgetPanelOpenClosed)}
					className={cn(
						"flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border transition-colors",
						panelOpen
							? "border-blue-500 bg-white text-blue-600 hover:bg-blue-50"
							: "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
					)}
				>
					<LayoutGrid size={18} />
				</button>
			</div>

			<div className="mx-auto flex flex-col gap-6 lg:flex-row">
				<div className="flex-1 space-y-6 mb-6">
					<Card className="p-4 gap-2.5">
						{gridHeader}
						<div className="grid grid-cols-12 gap-2.5 mb-2.5">
							{placedWidgets.map((entry, index) => (
								<DraggableGridCard
									key={entry.uid}
									className={entry.colSpanClass}
									isSwapTarget={gridDragOverIndex === index}
									isEmpty={entry.sidebarId === "emptyPage"}
									isHighlighted={
										highlightedWidgetUid === entry.uid
									}
									containerRef={(el) => {
										cardRefs.current[index] = el;
									}}
									onDragStart={() =>
										setGridDragOverIndex(null)
									}
									onDrag={(x, y) =>
										handleGridCardDrag(index, x, y)
									}
									onDragStop={(x, y) =>
										handleGridCardDrop(index, x, y)
									}
								>
									<DashboardWidget
										{...entry.widgetProps}
										isEmpty={
											entry.sidebarId === "emptyPage"
										}
									/>
								</DraggableGridCard>
							))}
						</div>
					</Card>

					{belowGrid}
				</div>

				{panelOpen && (
					<div
						className="w-full space-y-6 lg:w-[400px] mb-6"
						ref={sidebarRef}
					>
						{panelHeader}

						<SidebarWidgetList
							header={
								<div className="flex items-center gap-3 border-b border-slate-100 pb-4">
									<span className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.widgetPanelOpenClosed
											}
										/>
									</span>
									<button
										type="button"
										role="switch"
										aria-checked={widgetsVisible}
										aria-label={t(
											localizationConstants.widgetPanelOpenClosed,
										)}
										onClick={handleWidgetsToggle}
										className={cn(
											"relative h-6 w-11 cursor-pointer rounded-full transition-colors",
											widgetsVisible
												? "bg-blue-600"
												: "bg-slate-300",
										)}
									>
										<span
											className={cn(
												"absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
												widgetsVisible
													? "left-[22px]"
													: "left-0.5",
											)}
										/>
									</button>
								</div>
							}
							selectedItem={selectedItem}
							onSelectItem={handleSidebarItemClick}
							onSidebarDrop={handleSidebarDrop}
							dropZoneRef={dropZoneRef}
							onSidebarDrag={handleSidebarDrag}
							onDragEnd={() => setGridDragOverIndex(null)}
							placedSidebarIds={placedSidebarIds}
							sidebarItems={sidebarItems}
						/>
					</div>
				)}
			</div>

			<AlertDialog
				open={
					replacementModal.isOpen &&
					replacementModal.type === "REPLACE_WIDGET"
				}
				onOpenChange={(open) => !open && cancelDialog()}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to replace this widget?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action will remove the existing widget and
							replace it with{" "}
							<strong>
								<Translate
									text={pendingReplacement?.item.label ?? ""}
								/>
							</strong>
							. This cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							onClick={confirmReplacement}
							className="bg-[#18181B] hover:bg-[#18181B]/90 cursor-pointer"
						>
							Save
						</AlertDialogAction>
						<AlertDialogCancel
							onClick={cancelDialog}
							className="cursor-pointer border-none bg-[#1018280D] shadow-sm hover:bg-[#1018280D]"
						>
							Close
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog
				open={
					replacementModal.isOpen &&
					replacementModal.type === "REMOVE_WIDGET"
				}
				onOpenChange={(open) => !open && cancelDialog()}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to remove this widget?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action will remove the widget from the grid and
							replace it with an empty slot.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							onClick={confirmRemoval}
							className="bg-[#18181B] hover:bg-[#18181B]/90 cursor-pointer"
						>
							Save
						</AlertDialogAction>
						<AlertDialogCancel
							onClick={cancelDialog}
							className="cursor-pointer border-none bg-[#1018280D] shadow-sm hover:bg-[#1018280D]"
						>
							Close
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

export default ModuleWidgetDashboard;
