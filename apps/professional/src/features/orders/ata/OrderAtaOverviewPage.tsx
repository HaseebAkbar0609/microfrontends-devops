"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ATA_CONSTANTS, type AtaCategory } from "./constants/ata.constants";
import { useAta } from "./hooks/useAta";
import { AtaOverviewTable } from "./components/AtaOverviewTable";
import { CreateAtaView } from "./components/CreateAtaView";
import { AtaSupplierOverview } from "./components/AtaSupplierOverview";

export interface OrderAtaOverviewPageProps {
	orderId?: string;
	onDetailModeChange?: (isOpen: boolean) => void;
}

export type AtaViewMode = "table" | "create";

export function OrderAtaOverviewPage({
	orderId = ATA_CONSTANTS.DEFAULT_ORDER_ID,
	onDetailModeChange,
}: OrderAtaOverviewPageProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryAction = searchParams?.get("action") || null;

	const [viewMode, setViewMode] = useState<AtaViewMode>(
		queryAction === "create" ? "create" : "table"
	);

	const {
		activeCategory,
		setActiveCategory,
		isLoading,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		paginatedRows,
		summary,
		removeAta,
		sendAta,
		reload,
	} = useAta(orderId);

	useEffect(() => {
		if (queryAction === "create") {
			setViewMode("create");
			onDetailModeChange?.(true);
		}
	}, [queryAction, onDetailModeChange]);

	const handleOpenCreate = () => {
		setViewMode("create");
		onDetailModeChange?.(true);
		router.push(`/module/production/order/${orderId}/ata?action=create`);
	};

	const handleBackToTable = () => {
		setViewMode("table");
		onDetailModeChange?.(false);
		router.push(`/module/production/order/${orderId}/ata`);
	};

	const handleSaved = () => {
		reload();
		handleBackToTable();
	};

	if (viewMode === "create") {
		return (
			<CreateAtaView
				orderId={orderId}
				onBack={handleBackToTable}
				onSaved={handleSaved}
			/>
		);
	}

	return (
		<div className="w-full">
			{/* Sub-tabs: ÄTA - kund / ÄTA-Leverantör /UE matching screenshot */}
			<Tabs
				value={activeCategory}
				onValueChange={(val) => setActiveCategory(val as AtaCategory)}
				className="w-full flex flex-col"
			>
				<TabsList variant="line" className="mb-4">
					<TabsTrigger value={ATA_CONSTANTS.CATEGORIES.CUSTOMER} className="cursor-pointer">
						<Translate text={localizationConstants.ataCustomerTab} />
					</TabsTrigger>
					<TabsTrigger value={ATA_CONSTANTS.CATEGORIES.SUPPLIER} className="cursor-pointer">
						<Translate text={localizationConstants.ataSupplierTab} />
					</TabsTrigger>
				</TabsList>

				<TabsContent value={ATA_CONSTANTS.CATEGORIES.CUSTOMER} className="mt-0 focus-visible:outline-none">
					<AtaOverviewTable
						rows={paginatedRows}
						summary={summary}
						activeCategory={activeCategory}
						isLoading={isLoading}
						sortField={sortField}
						sortOrder={sortOrder}
						onSort={handleSort}
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						statusFilter={statusFilter}
						onStatusFilterChange={setStatusFilter}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						pageSize={pageSize}
						setPageSize={setPageSize}
						totalPages={totalPages}
						onDelete={removeAta}
						onSend={sendAta}
						onOpenCreate={handleOpenCreate}
					/>
				</TabsContent>

				<TabsContent value={ATA_CONSTANTS.CATEGORIES.SUPPLIER} className="mt-0 focus-visible:outline-none">
					<AtaSupplierOverview orderId={orderId} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default OrderAtaOverviewPage;

