"use client";
import { Card } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { useRef, useState } from "react";
import { DashboardWidget } from "./DashboardWidget";

import { DashboardHeader } from "./DashboardHeader";
import { DraggableGridCard } from "./DraggableGridCard";
import { WidgetItem } from "./DraggableSidebarItem";

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
import { AvailableProjectsCard } from "./AvailableProjectsCard";
import { INITIAL_WIDGETS, SIDEBAR_WIDGET_MAP } from "./DashboardConfig";
import { DashboardImage } from "./DashboardImage";
import { ModulesSection } from "./ModulesSection";
import { SidebarActions } from "./SidebarActions";
import { SidebarWidgetList } from "./SidebarWidgetList";

import useModal from "@/features/auth/hooks/useModal";
import localization from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PlacedWidgetEntry } from "../types/dashboard";

type DashboardModalType = "REPLACE_WIDGET" | "REMOVE_WIDGET";

const Dashboard = () => {
	const [selectedItem, setSelectedItem] = useState<string>("emptyPage");

	const [highlightedWidgetUid, setHighlightedWidgetUid] = useState<
		string | null
	>(null);

	// Replacement Confirmation State using useModal hook
	const replacementModal = useModal<DashboardModalType>();
	const [pendingReplacement, setPendingReplacement] = useState<{
		item: WidgetItem;
		index: number;
	} | null>(null);

	// All grid widgets (initial defaults + sidebar-dropped ones)
	const [placedWidgets, setPlacedWidgets] =
		useState<PlacedWidgetEntry[]>(INITIAL_WIDGETS);

	// Derived list of sidebar IDs that are already placed
	const placedSidebarIds = [
		...placedWidgets
			.map((w) => w.sidebarId)
			.filter((id): id is string => !!id),
		"image", // Image is always present in the hardcoded DashboardImage component
	];

	// Sidebar → grid drop
	const dropZoneRef = useRef<HTMLDivElement>(null);
	const sidebarRef = useRef<HTMLDivElement>(null);

	// Grid card ↔ grid card reorder
	const [gridDragOverIndex, setGridDragOverIndex] = useState<number | null>(
		null,
	);
	const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

	// ── Sidebar search/highlight ─────────────────────────────────────────────
	const handleSidebarItemClick = (id: string) => {
		setSelectedItem(id);
		// If already placed, highlight it
		const existing = placedWidgets.find((w) => w.sidebarId === id);
		if (existing) {
			setHighlightedWidgetUid(existing.uid);
			setTimeout(() => {
				setHighlightedWidgetUid(null);
			}, 2000);
		}
	};

	// ── Sidebar drop ─────────────────────────────────────────────────────────
	const handleSidebarDrop = (
		item: WidgetItem,
		clientX: number,
		clientY: number,
	) => {
		// Prevent duplicates
		if (placedSidebarIds.includes(item.id)) return;

		let dropIndex: number | null = null;
		cardRefs.current.forEach((ref, idx) => {
			if (ref) {
				const rect = ref.getBoundingClientRect();
				if (
					clientX >= rect.left &&
					clientX <= rect.right &&
					clientY >= rect.top &&
					clientY <= rect.bottom
				) {
					dropIndex = idx;
				}
			}
		});

		if (dropIndex !== null) {
			const targetWidget = placedWidgets[dropIndex];

			if (targetWidget.sidebarId === "emptyPage") {
				// No modal for empty slots, just fill it immediately
				const widgetProps = SIDEBAR_WIDGET_MAP[item.id] ?? {
					title: item.label,
					icon: item.icon,
				};

				setPlacedWidgets((prev) => {
					const next = [...prev];
					next[dropIndex!] = {
						...next[dropIndex!],
						sidebarId: item.id,
						widgetProps,
					};
					return next;
				});
			} else {
				// Replacing a real widget, ask for confirmation
				setPendingReplacement({ item, index: dropIndex });
				replacementModal.openModal("REPLACE_WIDGET");
			}
		}

		setGridDragOverIndex(null);
	};

	const confirmReplacement = () => {
		if (!pendingReplacement) return;

		const { item, index } = pendingReplacement;
		const widgetProps = SIDEBAR_WIDGET_MAP[item.id] ?? {
			title: item.label,
			icon: item.icon,
		};

		setPlacedWidgets((prev) => {
			const next = [...prev];
			// Replace the content of the existing card, keeping its colSpanClass
			next[index] = {
				...next[index],
				sidebarId: item.id,
				widgetProps,
			};
			return next;
		});

		replacementModal.closeModal();
		setPendingReplacement(null);
	};

	const cancelReplacement = () => {
		replacementModal.closeModal();
		setPendingReplacement(null);
	};

	const cancelRemoval = () => {
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
				widgetProps: SIDEBAR_WIDGET_MAP.emptyPage,
			};
			return next;
		});

		replacementModal.closeModal();
		setPendingReplacement(null);
	};

	const handleSidebarDrag = (clientX: number, clientY: number) => {
		let overIndex: number | null = null;
		cardRefs.current.forEach((ref, idx) => {
			if (ref) {
				const rect = ref.getBoundingClientRect();
				if (
					clientX >= rect.left &&
					clientX <= rect.right &&
					clientY >= rect.top &&
					clientY <= rect.bottom
				) {
					overIndex = idx;
				}
			}
		});
		setGridDragOverIndex(overIndex);
	};

	// ── Grid drag-to-reorder ─────────────────────────────────────────────────
	const handleGridCardDrag = (
		fromIndex: number,
		clientX: number,
		clientY: number,
	) => {
		let overIndex: number | null = null;
		cardRefs.current.forEach((ref, idx) => {
			if (idx !== fromIndex && ref) {
				const rect = ref.getBoundingClientRect();
				if (
					clientX >= rect.left &&
					clientX <= rect.right &&
					clientY >= rect.top &&
					clientY <= rect.bottom
				) {
					overIndex = idx;
				}
			}
		});
		setGridDragOverIndex(overIndex);
	};

	const handleGridCardDrop = (
		fromIndex: number,
		clientX: number,
		clientY: number,
	) => {
		let dropIndex: number | null = null;
		cardRefs.current.forEach((ref, idx) => {
			if (idx !== fromIndex && ref) {
				const rect = ref.getBoundingClientRect();
				if (
					clientX >= rect.left &&
					clientX <= rect.right &&
					clientY >= rect.top &&
					clientY <= rect.bottom
				) {
					dropIndex = idx;
				}
			}
		});

		if (dropIndex !== null) {
			setPlacedWidgets((prev) => {
				const next = [...prev];
				const fromItem = next[fromIndex];
				const toItem = next[dropIndex!];

				// Swap widget identity and content while keeping slot properties (colSpanClass)
				next[fromIndex] = {
					...fromItem,
					uid: toItem.uid,
					sidebarId: toItem.sidebarId,
					widgetProps: toItem.widgetProps,
				};
				next[dropIndex!] = {
					...toItem,
					uid: fromItem.uid,
					sidebarId: fromItem.sidebarId,
					widgetProps: fromItem.widgetProps,
				};
				return next;
			});
		} else if (sidebarRef.current) {
			// Check if dropped back to sidebar for removal
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
					item: { id: "removing", label: "", icon: Layers }, // placeholder
					index: fromIndex,
				});
				replacementModal.openModal("REMOVE_WIDGET");
			}
		}

		setGridDragOverIndex(null);
	};

	return (
		<div className="min-h-screen ">
			<div className="mx-auto flex flex-col gap-6 lg:flex-row p-4">
				{/* ── Main Content ──────────────────────────────────────────── */}
				<div className="flex-1 space-y-6 mb-6">
					{/* Header Card */}
					<Card className="p-6 gap-2.5">
						<DashboardHeader title="Karles Bygg AB" />

						{/* Widgets Grid */}
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

						<DashboardImage
							src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2000"
							alt="Modern Bathroom"
						/>
					</Card>

					<ModulesSection />
				</div>

				{/* ── Right Sidebar ─────────────────────────────────────────── */}
				<div
					className="w-full space-y-6 lg:w-[400px] mb-6"
					ref={sidebarRef}
				>
					<Card className="p-6 shadow-none gap-3">
						<SidebarActions />
						<AvailableProjectsCard />
					</Card>

					<SidebarWidgetList
						selectedItem={selectedItem}
						onSelectItem={handleSidebarItemClick}
						onSidebarDrop={handleSidebarDrop}
						dropZoneRef={dropZoneRef}
						onSidebarDrag={handleSidebarDrag}
						onDragEnd={() => {
							setGridDragOverIndex(null);
						}}
						placedSidebarIds={placedSidebarIds}
					/>
				</div>
			</div>

			{/* Replacement Confirmation Modal */}
			<AlertDialog
				open={
					replacementModal.isOpen &&
					replacementModal.type === "REPLACE_WIDGET"
				}
				onOpenChange={(open) => !open && cancelReplacement()}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Translate text={localization.replaceWidgetTitle} />
						</AlertDialogTitle>
						<AlertDialogDescription>
							<Translate text={localization.replaceWidgetDescription} />{" "}
							<strong>
								<Translate
									text={pendingReplacement?.item.label ?? ""}
								/>
							</strong>
							<Translate text={localization.replaceWidgetUndone} />
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							onClick={confirmReplacement}
							className="bg-[#18181B] hover:bg-[#18181B]/90 cursor-pointer"
						>
							<Translate text={localization.confirmSave} />
						</AlertDialogAction>
						<AlertDialogCancel
							onClick={cancelReplacement}
							className="cursor-pointer border-none bg-[#1018280D] shadow-sm hover:bg-[#1018280D]"
						>
							<Translate text={localization.confirmClose} />
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Removal Confirmation Modal */}
			<AlertDialog
				open={
					replacementModal.isOpen &&
					replacementModal.type === "REMOVE_WIDGET"
				}
				onOpenChange={(open) => !open && cancelRemoval()}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Translate text={localization.removeWidgetTitle} />
						</AlertDialogTitle>
						<AlertDialogDescription>
							<Translate text={localization.removeWidgetDescription} />
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							onClick={confirmRemoval}
							className="bg-[#18181B] hover:bg-[#18181B]/90 cursor-pointer"
						>
							<Translate text={localization.confirmRemove} />
						</AlertDialogAction>
						<AlertDialogCancel
							onClick={cancelRemoval}
							className="cursor-pointer border-none bg-[#1018280D] shadow-sm hover:bg-[#1018280D]"
						>
							<Translate text={localization.confirmClose} />
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default Dashboard;
