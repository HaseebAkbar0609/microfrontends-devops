"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/table/TablePagination";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { TIMEPLAN_CONSTANTS } from "./constants/timeplan.constants";
import { useOrderTimeplans } from "./hooks/useOrderTimeplans";
import { TimeplanListTable } from "./components/TimeplanListTable";
import { OrderTimeplanCreateWizard } from "./components/create/OrderTimeplanCreateWizard";
import { OrderTimeplanDetailView } from "./components/view/OrderTimeplanDetailView";
import type { OrderTimeplan } from "./types/timeplan.types";

export interface OrderTimeplanOverviewPageProps {
	orderId?: string;
	onDetailModeChange?: (isOpen: boolean) => void;
}

export function OrderTimeplanOverviewPage({
	orderId = TIMEPLAN_CONSTANTS.DEFAULT_ORDER_ID,
	onDetailModeChange,
}: OrderTimeplanOverviewPageProps) {
	const t = useTranslate();
	const router = useRouter();
	const searchParams = useSearchParams();

	const queryAction = searchParams?.get("action") || null;
	const queryTimeplanId = searchParams?.get("timeplanId") || null;

	const {
		isLoading,
		plans,
		totalCount,
		currentPage,
		totalPages,
		pageSize,
		setCurrentPage,
		setPageSize,
		sortField,
		sortOrder,
		handleSort,
		handleDeletePlan,
		handleAddOrUpdatePlan,
	} = useOrderTimeplans({ orderId });

	const [viewMode, setViewMode] = useState<"list" | "create" | "view">(() => {
		if (queryAction === "view") return "view";
		if (queryAction === "create") return "create";
		return "list";
	});
	const [activePlan, setActivePlan] = useState<OrderTimeplan | null>(() => {
		if (queryAction === "view" && queryTimeplanId) {
			return plans.find((p) => p.id === queryTimeplanId) || null;
		}
		return null;
	});

	// Sync state when URL query params change (e.g. back/forward button or direct navigation)
	useEffect(() => {
		if (queryAction === "create") {
			setActivePlan(null);
			setViewMode("create");
			onDetailModeChange?.(true);
		} else if (queryAction === "view") {
			const matchedPlan =
				plans.find((p) => p.id === queryTimeplanId) ||
				(queryTimeplanId ? { id: queryTimeplanId, name: "", kind: TIMEPLAN_CONSTANTS.KINDS.MAIN, date: "", createdBy: "" } : null);
			setActivePlan(matchedPlan);
			setViewMode("view");
			onDetailModeChange?.(true);
		} else {
			setViewMode("list");
			setActivePlan(null);
			onDetailModeChange?.(false);
		}
	}, [queryAction, queryTimeplanId, plans, onDetailModeChange]);

	const handleOpenCreate = () => {
		setActivePlan(null);
		setViewMode("create");
		onDetailModeChange?.(true);
		router.push(`/module/production/order/${orderId}/tidsplan?action=create`);
	};

	const handleOpenView = (plan: OrderTimeplan) => {
		setActivePlan(plan);
		setViewMode("view");
		onDetailModeChange?.(true);
		router.push(`/module/production/order/${orderId}/tidsplan?action=view&timeplanId=${plan.id}`);
	};

	const handleClose = () => {
		setViewMode("list");
		setActivePlan(null);
		onDetailModeChange?.(false);
		router.push(`/module/production/order/${orderId}/tidsplan`);
	};

	const handleSaveComplete = (newPlan: OrderTimeplan) => {
		handleAddOrUpdatePlan(newPlan);
		handleClose();
	};

	if (viewMode === "view") {
		return (
			<OrderTimeplanDetailView
				orderId={orderId}
				plan={activePlan}
				onClose={handleClose}
			/>
		);
	}

	if (viewMode === "create") {
		return (
			<OrderTimeplanCreateWizard
				orderId={orderId}
				onClose={handleClose}
				onSaveComplete={handleSaveComplete}
			/>
		);
	}

	return (
		<div className="w-full flex flex-col font-sans bg-white">
			{/* Top Action Bar matching Figma: Print + Skapa ny tidsplan */}
			<div className="flex items-center justify-end gap-3 pb-4">
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={() => window.print()}
					aria-label={t(localizationConstants.orderTimeplanPrintBtn)}
					title={t(localizationConstants.orderTimeplanPrintBtn)}
					className="h-10 w-10 cursor-pointer rounded-lg border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-none"
				>
					<Printer className="h-4 w-4" />
				</Button>

				<Button
					type="button"
					onClick={handleOpenCreate}
					className="h-10 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-sans text-sm font-medium gap-1.5 shadow-none cursor-pointer flex items-center"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.orderTimeplanCreateBtn} />
				</Button>
			</div>

			{/* Table matching Figma */}
			<div className="pt-2">
				<TimeplanListTable
					plans={plans}
					isLoading={isLoading}
					sortField={sortField}
					sortOrder={sortOrder}
					onSort={handleSort}
					onView={handleOpenView}
					onDelete={handleDeletePlan}
				/>
			</div>

			{/* Pagination component reused across the project */}
			{!isLoading && totalCount > 0 && (
				<TablePagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={setCurrentPage}
					onPageSizeChange={setPageSize}
				/>
			)}
		</div>
	);
}

export default OrderTimeplanOverviewPage;
