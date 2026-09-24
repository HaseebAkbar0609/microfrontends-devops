"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Check, X, LayoutList, Layers, RotateCcw, Loader2 } from "lucide-react";
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
import useModal from "@/features/auth/hooks/useModal";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DashboardWidget } from "@/features/widgetdashboard/components/DashboardWidget";
import { DraggableGridCard } from "@/features/widgetdashboard/components/DraggableGridCard";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import { useWidgetToggle } from "@/features/widgetdashboard/hooks/useWidgetToggle";
import { showToast } from "@/lib/toast";
import { useAuthStatus } from "@/context/AuthContext";
import {
	getWidgetsAction,
	syncWidgetsAction,
	type WidgetSyncItem,
} from "@/api-actions/widgets/widgets";
import {
	getB2BDashboardKpisAction,
	EMPTY_B2B_KPIS,
	type B2BDashboardKpis,
} from "@/api-actions/b2b/b2b";
import { PlacedWidgetEntry } from "@/features/widgetdashboard/types/dashboard";
import { cn } from "@/lib/utils";
import {
	B2B_INITIAL_WIDGETS,
	B2B_SIDEBAR_WIDGET_MAP,
	B2B_DASHBOARD_SIDEBAR_ITEMS,
	buildB2BWidgetMap,
} from "./B2BDashboardConfig";

type DashboardModalType = "REPLACE_WIDGET" | "REMOVE_WIDGET";

export function B2BDashboard() {
	const t = useTranslate();
	const [selectedItem, setSelectedItem] = useState<string>("emptyPage");
	const [isRearranging, setIsRearranging] = useState(false);
	const [kpiData, setKpiData] = useState<B2BDashboardKpis>(EMPTY_B2B_KPIS);
	const [isLoadingKpis, setIsLoadingKpis] = useState(true);
	const [kpiError, setKpiError] = useState<string | null>(null);

	const {
		placedWidgets,
		setPlacedWidgets,
		resumeAfterDrop,
	} = useWidgetToggle(B2B_SIDEBAR_WIDGET_MAP, B2B_INITIAL_WIDGETS);
	const [highlightedWidgetUid, setHighlightedWidgetUid] = useState<string | null>(null);

	const replacementModal = useModal<DashboardModalType>();
	const [pendingReplacement, setPendingReplacement] = useState<{
		item: WidgetItem;
		index: number;
	} | null>(null);

	const { company } = useAuthStatus();
	const [isSavingLayout, setIsSavingLayout] = useState(false);
	const persistedLayoutRef = useRef<PlacedWidgetEntry[]>(B2B_INITIAL_WIDGETS);

	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
	const cardRectsRef = useRef<(DOMRect | null)[]>([]);
	const dropZoneRef = useRef<HTMLDivElement>(null);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const [gridDragOverIndex, setGridDragOverIndex] = useState<number | null>(null);

	// Fetch real B2B KPIs from Backend API
	const fetchKpis = useCallback(async () => {
		setIsLoadingKpis(true);
		setKpiError(null);
		const res = await getB2BDashboardKpisAction();
		if (res.success && res.data) {
			setKpiData(res.data);
			const dynamicMap = buildB2BWidgetMap(res.data);
			setPlacedWidgets((prev) =>
				prev.map((w) => ({
					...w,
					widgetProps: dynamicMap[w.sidebarId || "emptyPage"] || dynamicMap.emptyPage,
				}))
			);
		} else {
			setKpiError(res.error || "Failed to load dashboard data");
		}
		setIsLoadingKpis(false);
	}, [setPlacedWidgets]);

	useEffect(() => {
		fetchKpis();
	}, [fetchKpis]);

	// Load user's saved layout from Backend DB
	useEffect(() => {
		async function fetchLayout() {
			if (!company) return;
			const res = await getWidgetsAction(company.id, "b2b_dashboard");
			if (res.success && res.data && res.data.length > 0) {
				const sorted = [...res.data].sort((a, b) => a.order - b.order);
				const ordered: PlacedWidgetEntry[] = [];
				const dynamicMap = buildB2BWidgetMap(kpiData);

				sorted.forEach((w, idx) => {
					const defaultSlot = B2B_INITIAL_WIDGETS[idx];
					if (defaultSlot) {
						ordered.push({
							...defaultSlot,
							sidebarId: w.key,
							widgetProps: dynamicMap[w.key] || dynamicMap.emptyPage,
						});
					}
				});

				B2B_INITIAL_WIDGETS.forEach((slot, idx) => {
					if (!ordered[idx]) {
						ordered[idx] = slot;
					}
				});

				setPlacedWidgets(ordered);
				persistedLayoutRef.current = ordered;
			}
		}
		fetchLayout();
	}, [company, kpiData, setPlacedWidgets]);

	const currentWidgetMap = buildB2BWidgetMap(kpiData);

	const handleSidebarItemClick = (id: string) => {
		setSelectedItem(id);
		const existingIndex = placedWidgets.findIndex((w) => w.sidebarId === id);
		if (existingIndex >= 0) {
			const uid = placedWidgets[existingIndex].uid;
			setHighlightedWidgetUid(uid);
			const el = cardRefs.current[existingIndex];
			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "center" });
			}
			setTimeout(() => setHighlightedWidgetUid(null), 1500);
		} else {
			// Find empty slot or replace
			const emptyIndex = placedWidgets.findIndex((w) => w.sidebarId === "emptyPage");
			if (emptyIndex >= 0) {
				const item = B2B_DASHBOARD_SIDEBAR_ITEMS.find((i) => i.id === id);
				if (item) {
					setPlacedWidgets((prev) => {
						const next = [...prev];
						next[emptyIndex] = {
							...next[emptyIndex],
							sidebarId: item.id,
							widgetProps: currentWidgetMap[item.id],
						};
						return next;
					});
					resumeAfterDrop();
					showToast("success", t(localizationConstants.b2bLayoutSaved));
				}
			} else {
				showToast("info", t(localizationConstants.replaceWidgetDescription));
			}
		}
	};

	const handleSaveLayout = async () => {
		setIsSavingLayout(true);
		persistedLayoutRef.current = placedWidgets;

		if (company) {
			const syncPayload: WidgetSyncItem[] = placedWidgets.map((w, index) => ({
				key: w.sidebarId || "emptyPage",
				order: index + 1,
			}));
			await syncWidgetsAction(company.id, "b2b_dashboard", syncPayload);
		}
		showToast("success", t(localizationConstants.b2bLayoutSaved));
		setIsSavingLayout(false);
		setIsRearranging(false);
	};

	const handleCloseLayout = () => {
		setPlacedWidgets(persistedLayoutRef.current);
		setIsRearranging(false);
		showToast("info", t(localizationConstants.b2bLayoutDiscarded));
	};

	const cancelDialog = () => {
		replacementModal.closeModal();
		setPendingReplacement(null);
	};

	const confirmReplacement = () => {
		if (!pendingReplacement) return;
		const { item, index } = pendingReplacement;
		setPlacedWidgets((prev) => {
			const next = [...prev];
			next[index] = {
				...next[index],
				sidebarId: item.id,
				widgetProps: currentWidgetMap[item.id],
			};
			return next;
		});
		replacementModal.closeModal();
		setPendingReplacement(null);
		resumeAfterDrop();
	};

	const confirmRemoval = () => {
		if (!pendingReplacement) return;
		const { index } = pendingReplacement;
		setPlacedWidgets((prev) => {
			const next = [...prev];
			next[index] = {
				...next[index],
				sidebarId: "emptyPage",
				widgetProps: currentWidgetMap.emptyPage,
			};
			return next;
		});
		replacementModal.closeModal();
		setPendingReplacement(null);
	};

	const handleGridCardDragStart = () => {
		setGridDragOverIndex(null);
		cardRectsRef.current = cardRefs.current.map((el) => (el ? el.getBoundingClientRect() : null));
	};

	const handleGridCardDrag = (fromIndex: number, clientX: number, clientY: number) => {
		let targetIndex: number | null = null;
		const rects = cardRectsRef.current;
		for (let i = 0; i < rects.length; i++) {
			if (i === fromIndex) continue;
			const rect = rects[i];
			if (
				rect &&
				clientX >= rect.left &&
				clientX <= rect.right &&
				clientY >= rect.top &&
				clientY <= rect.bottom
			) {
				targetIndex = i;
				break;
			}
		}
		setGridDragOverIndex(targetIndex);
	};

	const handleGridCardDrop = (fromIndex: number, clientX: number, clientY: number) => {
		if (gridDragOverIndex !== null && gridDragOverIndex !== fromIndex) {
			setPlacedWidgets((prev) => {
				const updated = [...prev];
				const sourceItem = updated[fromIndex];
				const targetItem = updated[gridDragOverIndex];

				updated[fromIndex] = {
					...sourceItem,
					sidebarId: targetItem.sidebarId,
					widgetProps: targetItem.widgetProps,
				};
				updated[gridDragOverIndex] = {
					...targetItem,
					sidebarId: sourceItem.sidebarId,
					widgetProps: sourceItem.widgetProps,
				};
				return updated;
			});
		} else if (sidebarRef.current) {
			const sRect = sidebarRef.current.getBoundingClientRect();
			const isOverSidebar =
				clientX >= sRect.left &&
				clientX <= sRect.right &&
				clientY >= sRect.top &&
				clientY <= sRect.bottom;

			if (isOverSidebar && placedWidgets[fromIndex].sidebarId !== "emptyPage") {
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
		<div className="flex flex-col gap-6">
			{isLoadingKpis && (
				<div className="flex items-center gap-2 text-xs text-slate-400">
					<Loader2 className="w-3.5 h-3.5 animate-spin" />
					<span>Updating live KPIs...</span>
				</div>
			)}
			{!isLoadingKpis && kpiError && (
				<div className="flex items-center justify-between gap-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
					<span>{kpiError}</span>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-6 cursor-pointer px-2 text-xs text-amber-900 hover:bg-amber-100"
						onClick={() => fetchKpis()}
					>
						{t(localizationConstants.retry)}
					</Button>
				</div>
			)}

			{/* Main Layout: Widgets Grid (Left) & Control Sidebar (Right) */}
			<div className="flex flex-col gap-4 xl:flex-row xl:gap-5 lg:pr-44">
				{/* Left Grid */}
				<div className="flex-1 min-w-0" ref={dropZoneRef}>
					<div className="grid grid-cols-12 gap-2 sm:gap-3">
						{placedWidgets.map((entry, index) => (
							<DraggableGridCard
								key={entry.uid}
								className={entry.colSpanClass}
								disabled={!isRearranging}
								isSwapTarget={gridDragOverIndex === index}
								isEmpty={entry.sidebarId === "emptyPage"}
								isHighlighted={highlightedWidgetUid === entry.uid}
								containerRef={(el) => {
									cardRefs.current[index] = el;
								}}
								onDragStart={handleGridCardDragStart}
								onDrag={(x, y) => handleGridCardDrag(index, x, y)}
								onDragStop={(x, y) => handleGridCardDrop(index, x, y)}
							>
								<DashboardWidget
									{...entry.widgetProps}
									className={entry.colSpanClass}
									isEmpty={entry.sidebarId === "emptyPage"}
									onRemove={() => {
										setPendingReplacement({
											item: { id: "emptyPage", label: localizationConstants.emptyPageLabel, icon: Layers },
											index,
										});
										replacementModal.openModal("REMOVE_WIDGET");
									}}
								/>
							</DraggableGridCard>
						))}

						{/* Reset Default Button if all widgets are removed */}
						{placedWidgets.every((w) => w.sidebarId === "emptyPage") && (
							<div className="col-span-12 flex justify-center py-6">
								<Button
									type="button"
									size="sm"
									onClick={() => {
										setPlacedWidgets(B2B_INITIAL_WIDGETS);
										showToast("info", t(localizationConstants.b2bLayoutDiscarded));
									}}
									className="flex items-center gap-2 rounded-sm bg-[#111827] px-4 py-2 text-xs font-medium text-white hover:bg-black transition-colors cursor-pointer"
								>
									<RotateCcw size={14} />
									<span><Translate text={localizationConstants.b2bDiscard} /></span>
								</Button>
							</div>
						)}
					</div>
				</div>

				{/* Right Sidebar */}
				<div className="w-full xl:w-90 shrink-0 space-y-4" ref={sidebarRef}>
					{/* Top Rearrange Button */}
					<div className="flex justify-end">
						<Button
							type="button"
							variant={isRearranging ? "default" : "secondary"}
							size="sm"
							onClick={() => {
								setIsRearranging((prev) => !prev);
								showToast("info", !isRearranging ? t(localizationConstants.rearrange) : t(localizationConstants.confirmClose));
							}}
							className={cn(
								"flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-all cursor-pointer",
								isRearranging
									? "bg-[#111827] text-white shadow-xs hover:bg-black"
									: "bg-[#F4F4F5] text-slate-700 hover:bg-slate-200"
							)}
						>
							<LayoutList size={16} />
							<span><Translate text={localizationConstants.rearrange} /></span>
						</Button>
					</div>

					{/* Save & Discard Buttons */}
					<div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
						<Button
							type="button"
							onClick={handleSaveLayout}
							disabled={isSavingLayout}
							className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#111827] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#111827]/90 cursor-pointer disabled:opacity-70"
						>
							{isSavingLayout ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Check size={16} />}
							<span><Translate text={localizationConstants.confirmSave} /></span>
						</Button>
						<Button
							type="button"
							variant="secondary"
							onClick={handleCloseLayout}
							className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#F4F4F5] px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 cursor-pointer"
						>
							<X size={16} />
							<span><Translate text={localizationConstants.confirmClose} /></span>
						</Button>
					</div>

					{/* Menu Card */}
					<div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 overflow-hidden">
						<div className="flex items-center gap-2 bg-[#111827] px-4 py-3 rounded-sm mb-3">
							<Layers size={16} className="text-white" />
							<span className="text-sm font-medium text-white">
								<Translate text={localizationConstants.b2bMenuTitle} />
							</span>
						</div>
						<div className="space-y-0.5">
							{B2B_DASHBOARD_SIDEBAR_ITEMS.map((item) => (
								<div
									key={item.id}
									className={`flex items-center gap-2 px-3 py-2 rounded-sm cursor-pointer transition-colors ${selectedItem === item.id
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

				{/* Replacement Modal */}
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
								<Translate text={localizationConstants.replaceWidgetTitle} />
							</AlertDialogTitle>
							<AlertDialogDescription>
								<Translate text={localizationConstants.replaceWidgetDescription} />{" "}
								<strong>
									<Translate
										text={pendingReplacement?.item.label ?? ""}
									/>
								</strong>
								. <Translate text={localizationConstants.replaceWidgetUndone} />
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

				{/* Removal Modal */}
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
								<Translate text={localizationConstants.removeWidgetTitle} />
							</AlertDialogTitle>
							<AlertDialogDescription>
								<Translate text={localizationConstants.removeWidgetDescription} />
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
		</div>
	);
}

export default B2BDashboard;
