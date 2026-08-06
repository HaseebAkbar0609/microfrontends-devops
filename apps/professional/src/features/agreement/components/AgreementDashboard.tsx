"use client";

import React, { useRef, useState } from "react";
import { Check, X, LayoutList, Layers } from "lucide-react";
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
import useModal from "@/features/auth/hooks/useModal";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DashboardWidget } from "@/features/widgetdashboard/components/DashboardWidget";
import { DraggableGridCard } from "@/features/widgetdashboard/components/DraggableGridCard";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import { useWidgetToggle } from "@/features/widgetdashboard/hooks/useWidgetToggle";
import { AGREEMENT_INITIAL_WIDGETS, AGREEMENT_SIDEBAR_WIDGET_MAP } from "./AgreementDashboardConfig";
import { AGREEMENT_SIDEBAR_ITEMS } from "../constants/agreementDashboardSidebarItems";

type DashboardModalType = "REPLACE_WIDGET" | "REMOVE_WIDGET";

export function AgreementDashboard() {
	const [selectedItem, setSelectedItem] = useState<string>("emptyPage");
	const {
		placedWidgets,
		setPlacedWidgets,
		resumeAfterDrop,
	} = useWidgetToggle(AGREEMENT_SIDEBAR_WIDGET_MAP, AGREEMENT_INITIAL_WIDGETS);
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

	const _handleSidebarDrop = (
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
				const widgetProps = AGREEMENT_SIDEBAR_WIDGET_MAP[item.id] ?? {
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
		const widgetProps = AGREEMENT_SIDEBAR_WIDGET_MAP[item.id] ?? {
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
				widgetProps: AGREEMENT_SIDEBAR_WIDGET_MAP.emptyPage,
			};
			return next;
		});

		replacementModal.closeModal();
		setPendingReplacement(null);
	};

	const _handleSidebarDrag = (clientX: number, clientY: number) => {
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
		<div className="flex flex-col gap-4 xl:flex-row xl:gap-5">
			<div className="flex-1 min-w-0" ref={dropZoneRef}>
				<div className="grid grid-cols-12 gap-2 sm:gap-3">
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
								className={entry.colSpanClass}
								isEmpty={
									entry.sidebarId === "emptyPage"
								}
							/>
						</DraggableGridCard>
					))}
				</div>
			</div>

			<div className="w-full xl:w-90 shrink-0 space-y-4" ref={sidebarRef}>
				<div className="flex justify-end">
					<button
						type="button"
						className="flex items-center gap-2 rounded-sm bg-[#F4F4F5] px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 cursor-pointer"
					>
						<LayoutList size={16} />
						<span>Rearrange</span>
					</button>
				</div>

				<div className="rounded-sm border border-slate-200 bg-white p-4 space-y-3">
					<button
						type="button"
						className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#111827] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#111827]/90 cursor-pointer"
					>
						<Check size={16} />
						<Translate text={localizationConstants.confirmSave} />
					</button>
					<button
						type="button"
						className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#F4F4F5] px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 cursor-pointer"
					>
						<X size={16} />
						<Translate text={localizationConstants.confirmClose} />
					</button>
				</div>

				<div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 overflow-hidden">
					<div className="flex items-center gap-2 bg-[#111827] px-4 py-3 rounded-sm mb-3">
						<Layers size={16} className="text-white" />
						<span className="text-sm font-medium text-white">
							<Translate text={localizationConstants.agreement} />
						</span>
					</div>
					<div className="space-y-0.5">
						{AGREEMENT_SIDEBAR_ITEMS.map((item) => (
							<div
								key={item.id}
								className={`flex items-center gap-2 px-3 py-2 rounded-sm cursor-pointer transition-colors ${
									selectedItem === item.id
										? "bg-[#1E293B] text-white"
										: "text-slate-800 hover:bg-slate-100"
								}`}
								onClick={() => handleSidebarItemClick(item.id)}
							>
								<Layers size={16} />
								<span className="text-sm font-medium leading-5 tracking-normal">
									<Translate text={item.label} />
								</span>
							</div>
						))}
					</div>
				</div>
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
							<Translate text={localizationConstants.confirmSave} />
						</AlertDialogAction>
						<AlertDialogCancel
							onClick={cancelDialog}
							className="cursor-pointer border-none bg-[#1018280D] shadow-sm hover:bg-[#1018280D]"
						>
							<Translate text={localizationConstants.confirmClose} />
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
							<Translate text={localizationConstants.confirmSave} />
						</AlertDialogAction>
						<AlertDialogCancel
							onClick={cancelDialog}
							className="cursor-pointer border-none bg-[#1018280D] shadow-sm hover:bg-[#1018280D]"
						>
							<Translate text={localizationConstants.confirmClose} />
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

export default AgreementDashboard;
