"use client";

import { useMemo, useRef, useState } from "react";
import { LayoutList, Layers, type LucideIcon } from "lucide-react";
import DashboardInfoCard from "./components/DashboardInfoCard";
import DashboardMenuCard from "./components/DashboardMenuCard";
import DashboardNewsCard from "./components/DashboardNewsCard";
import DashboardActionCard from "./components/DashboardActionCard";
import { DraggableGridCard } from "./components/DraggableGridCard";
import { DraggableSidebarItem } from "./components/DraggableSidebarItem";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { Button } from "@/components/ui/button";
import useModal from "@/features/auth/hooks/useModal";
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
import {
	dashboardInfoCards,
	dashboardMenuItems,
	dashboardNewsItems,
} from "./constants";

type CardRefMap = Record<string, HTMLElement | null>;

type DashboardWidget = {
	id: string;
	sourceMenuId?: string;
	titleKey: string;
	lines: string[];
	icon: LucideIcon;
	isEmpty?: boolean;
};

type DashboardSlot = {
	slotId: string;
	widget: DashboardWidget;
};

type MenuWidgetMapping = {
	menuId: string;
	menuLabelKey: string;
	menuIcon: LucideIcon;
	widget: DashboardWidget;
};

type DashboardModalType = "REMOVE_WIDGET";

const EMPTY_WIDGET: DashboardWidget = {
	id: "empty-page",
	sourceMenuId: undefined,
	titleKey: localizationConstants.emptyPageLabel,
	lines: [],
	icon: Layers,
	isEmpty: true,
};

function isPointInsideRect(
	clientX: number,
	clientY: number,
	rect: DOMRect
) {
	return (
		clientX >= rect.left &&
		clientX <= rect.right &&
		clientY >= rect.top &&
		clientY <= rect.bottom
	);
}

export default function DashboardPage() {
	const baseInfoWidgets = useMemo<DashboardWidget[]>(
		() => {
			const menuIdByTitle = new Map<string, string>([
				[localizationConstants.economyTitle, "menu-economy"],
				[localizationConstants.kpiStatusTitle, "menu-kpi"],
				[localizationConstants.usersTitle, "menu-users"],
			]);

			return dashboardInfoCards.map((card) => {
				const sourceMenuId =
					menuIdByTitle.get(card.titleKey) ?? `menu-${card.titleKey}`;

				return {
					...card,
					id: card.titleKey,
					sourceMenuId,
				};
			});
		},
		[]
	);

	const menuWidgetCatalog = useMemo<MenuWidgetMapping[]>(
		() => {
			const baseEntries = baseInfoWidgets.map((widget) => ({
				menuId: widget.sourceMenuId ?? `menu-${widget.id}`,
				menuLabelKey: widget.titleKey,
				menuIcon: widget.icon,
				widget,
			}));

			const baseMenuIds = new Set(baseEntries.map((entry) => entry.menuId));
			const extraEntries = dashboardMenuItems
				.filter((item) => !baseMenuIds.has(item.id))
				.map((item) => ({
					menuId: item.id,
					menuLabelKey: item.labelKey,
					menuIcon: item.icon,
					widget: {
						id: item.id,
						sourceMenuId: item.id,
						titleKey: item.labelKey,
						lines: [],
						icon: item.icon,
					},
				}));

			return [...baseEntries, ...extraEntries];
		},
		[baseInfoWidgets]
	);

	const [placedWidgets, setPlacedWidgets] = useState<DashboardSlot[]>(() =>
		baseInfoWidgets.map((widget, index) => ({
			slotId: `slot-${index}`,
			widget,
		}))
	);
	const [savedWidgets, setSavedWidgets] = useState<DashboardSlot[]>(() =>
		baseInfoWidgets.map((widget, index) => ({
			slotId: `slot-${index}`,
			widget,
		}))
	);
	const [activeInfoId, setActiveInfoId] = useState<string | null>(null);
	const [swapInfoId, setSwapInfoId] = useState<string | null>(null);
	const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
	const [swapMenuId, setSwapMenuId] = useState<string | null>(null);
	const [mode, setMode] = useState<"rearrange" | "menu" | null>(null);
	const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);
	const removalModal = useModal<DashboardModalType>();

	const infoCardRefs = useRef<CardRefMap>({});
	const menuItemRefs = useRef<CardRefMap>({});
	const menuDropZoneRef = useRef<HTMLUListElement | null>(null);
	const lastSwapInfoIdRef = useRef<string | null>(null);

	const widgetMenuItems = useMemo(
		() =>
			menuWidgetCatalog.map((entry) => ({
				id: entry.menuId,
				label: entry.menuLabelKey,
				icon: entry.menuIcon,
			})),
		[menuWidgetCatalog]
	);

	const usedMenuItemIds = useMemo(
		() =>
			new Set(
				placedWidgets
					.map((slot) => slot.widget)
					.filter((widget) => !widget.isEmpty)
					.map((widget) => widget.sourceMenuId)
			),
		[placedWidgets]
	);

	const cancelRemoval = () => {
		removalModal.closeModal();
		setPendingRemovalId(null);
	};

	const confirmRemoval = () => {
		if (!pendingRemovalId) return;

		setPlacedWidgets((prev) =>
			prev.map((slot) =>
				slot.slotId === pendingRemovalId
					? { ...slot, widget: EMPTY_WIDGET }
					: slot
			)
		);
		cancelRemoval();
	};

	const handleSave = () => {
		setSavedWidgets(placedWidgets);
		setMode(null);
	};

	const handleDiscard = () => {
		setPlacedWidgets(savedWidgets);
		setMode(null);
		setActiveInfoId(null);
		setSwapInfoId(null);
		setActiveMenuId(null);
		setSwapMenuId(null);
		lastSwapInfoIdRef.current = null;
	};


	return (
		<div className="flex flex-1 flex-col gap-5 bg-white px-6 py-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-semibold text-slate-900">
					<Translate text={localizationConstants.dashboardTitle} />
				</h1>
			</div>

			<div className="flex flex-col gap-6 xl:flex-row">
				<div className="flex-1 space-y-6">
					<div className="grid auto-rows-[1fr] gap-4 md:grid-cols-2 xl:grid-cols-3">
						{placedWidgets.map((slot) => (
							<DraggableGridCard
								key={slot.slotId}
								containerRef={(el) => {
									infoCardRefs.current[slot.slotId] = el;
								}}
								restingClassName="bg-transparent border-none shadow-none cursor-grab"
								disabled={mode === null || slot.widget.isEmpty}
								isSwapTarget={swapInfoId === slot.slotId}
								isHighlighted={activeInfoId === slot.slotId}
								isEmpty={slot.widget.isEmpty}
								onDragStart={() => {
									setActiveInfoId(slot.slotId);
									setSwapInfoId(null);
								}}
								onDrag={(clientX, clientY) => {
									if (mode !== "rearrange") {
										setSwapInfoId(null);
										lastSwapInfoIdRef.current = null;
										return;
									}

									const targetId = placedWidgets.find((candidate) => {
										if (candidate.slotId === slot.slotId || candidate.widget.isEmpty) return false;
										const node = infoCardRefs.current[candidate.slotId];
										if (!node) return false;
										return isPointInsideRect(clientX, clientY, node.getBoundingClientRect());
									})?.slotId;
									setSwapInfoId(targetId ?? null);
									lastSwapInfoIdRef.current = targetId ?? null;
								}}
								onDragStop={(clientX, clientY) => {
									if (
										mode === "rearrange" &&
										activeInfoId &&
										swapInfoId &&
										activeInfoId !== swapInfoId
									) {
										setPlacedWidgets((prev) => {
											const next = [...prev];
											const sourceIndex = next.findIndex((item) => item.slotId === activeInfoId);
											const targetIndex = next.findIndex((item) => item.slotId === swapInfoId);
											if (sourceIndex < 0 || targetIndex < 0) return prev;
											[next[sourceIndex].widget, next[targetIndex].widget] = [
												next[targetIndex].widget,
												next[sourceIndex].widget,
											];
											return next;
										});
									} else if (activeInfoId && menuDropZoneRef.current) {
										const isOverMenu = isPointInsideRect(
											clientX,
											clientY,
											menuDropZoneRef.current.getBoundingClientRect()
										);
										if (isOverMenu) {
											setPendingRemovalId(activeInfoId);
											removalModal.openModal("REMOVE_WIDGET");
										}
									}
									setActiveInfoId(null);
									setSwapInfoId(null);
									lastSwapInfoIdRef.current = null;
								}}
							>
								<DashboardInfoCard
									title={slot.widget.titleKey}
									lines={slot.widget.lines}
									icon={slot.widget.icon}
									className="min-h-[160px]"
									isEmpty={slot.widget.isEmpty}
								/>
							</DraggableGridCard>
						))}
					</div>

					<DashboardNewsCard
						title={localizationConstants.newsTitle}
						items={dashboardNewsItems.map((item) => ({
							id: item.id,
							title: item.titleKey,
							date: item.dateKey,
							body: item.bodyKey,
						}))}
					/>
				</div>

				<div className="flex w-full flex-col gap-4 xl:w-80">
					<div className="flex items-center justify-end gap-2 xl:justify-end">
						<Button
							type="button"
							variant="ghost"
							onClick={() => setMode("rearrange")}
							className={`flex items-center gap-2 rounded-md border border-slate-200 px-4 py-0 text-xs font-semibold cursor-pointer ${
								mode === "rearrange"
									? "bg-slate-900 text-white"
									: "bg-app-secondary text-slate-700"
							}`}
						>
							<LayoutList size={16} className={mode === "rearrange" ? "text-white" : "text-slate-500"} />
							<Translate text={localizationConstants.rearrange} />
						</Button>
						<Button
							type="button"
							variant="ghost"
							onClick={() => setMode("menu")}
							className={`flex bg-slate-900 text-white items-center gap-2 rounded-md px-4 py-0 text-xs font-semibold cursor-pointer ${
								mode === "menu" ? "bg-slate-900 text-white" : "bg-slate-900 text-white"
							}`}
						>
							<span className="text-base leading-none">+</span>
							<Translate text={localizationConstants.addMenu} />
						</Button>
					</div>

					{mode && (
						<DashboardActionCard
							saveLabel={localizationConstants.save}
							discardLabel={localizationConstants.discard}
							onSave={handleSave}
							onDiscard={handleDiscard}
						/>
					)}

					<DashboardMenuCard items={widgetMenuItems}>
						<ul
							ref={menuDropZoneRef}
							className="space-y-3 text-sm"
						>
							{widgetMenuItems.map((item) => (
								<li
									key={item.id}
									ref={(el) => {
										menuItemRefs.current[item.id] = el;
									}}
								>
									<DraggableSidebarItem
										item={item}
										variant="menu"
										dropZoneRef={menuDropZoneRef}
										isPlaced={usedMenuItemIds.has(item.id)}
										isActive={activeMenuId === item.id || swapMenuId === item.id}
										disabled={mode !== "menu"}
										showDisabledStyle={mode === "menu"}
										onClick={() => setActiveMenuId(item.id)}
										onDrag={(clientX, clientY) => {
											const targetId = widgetMenuItems.find((candidate) => {
												if (candidate.id === item.id) return false;
												const node = menuItemRefs.current[candidate.id];
												if (!node) return false;
												return isPointInsideRect(clientX, clientY, node.getBoundingClientRect());
											})?.id;
											setSwapMenuId(targetId ?? null);

											const targetCardId = placedWidgets.find((candidate) => {
												const node = infoCardRefs.current[candidate.slotId];
												if (!node) return false;
												return isPointInsideRect(clientX, clientY, node.getBoundingClientRect());
											})?.slotId;
											setSwapInfoId(targetCardId ?? null);
											lastSwapInfoIdRef.current = targetCardId ?? null;
										}}
										onDragEnd={() => {
											setActiveMenuId(null);
											setSwapMenuId(null);
											setSwapInfoId(null);
										}}
										onDrop={(droppedItem, clientX, clientY) => {
											const targetCardId =
												placedWidgets.find((candidate) => {
													const node = infoCardRefs.current[candidate.slotId];
													if (!node) return false;
													return isPointInsideRect(
														clientX,
														clientY,
														node.getBoundingClientRect()
													);
												})?.slotId ?? lastSwapInfoIdRef.current ?? swapInfoId;

											if (targetCardId) {
												const replacement = menuWidgetCatalog.find(
													(entry) => entry.menuId === droppedItem.id
												);
												if (!replacement) return;
												setPlacedWidgets((prev) =>
													prev.map((widget) =>
														widget.slotId === targetCardId
															? { ...widget, widget: replacement.widget }
															: widget
													)
												);
											}
											lastSwapInfoIdRef.current = null;
										}}
									/>
								</li>
							))}
						</ul>
					</DashboardMenuCard>
				</div>
			</div>

			<AlertDialog
				open={removalModal.isOpen && removalModal.type === "REMOVE_WIDGET"}
				onOpenChange={(open) => !open && cancelRemoval()}
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
							className="cursor-pointer bg-[#18181B] hover:bg-[#18181B]/90"
						>
							<Translate text={localizationConstants.confirmRemove} />
						</AlertDialogAction>
						<AlertDialogCancel
							onClick={cancelRemoval}
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
