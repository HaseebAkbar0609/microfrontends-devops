"use client";

import React, { useState } from "react";
import { ChevronDown, Printer } from "lucide-react";
import { RecordNavRow } from "@/components/layout/navigation";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ORDER_MODULE_BASE_URL } from "@/features/orders/data/orderNav.config";
import { useOrderOpened } from "@/features/orders/opened/hooks/useOrderOpened";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { usePaymentPlan } from "./hooks/usePaymentPlan";
import { BestallarePaymentPlanTab } from "./components/BestallarePaymentPlanTab";
import { UeLevPaymentPlanTab } from "./components/UeLevPaymentPlanTab";
import { AddUeLevPlanModal } from "./components/PaymentPlanModals";
import { PAYMENT_PLAN_CONSTANTS } from "./constants/paymentPlan.constants";

export interface OrderPaymentPlanListPageProps {
	orderId?: string;
	hideNavRow?: boolean;
}

export function OrderPaymentPlanListPage({
	orderId = PAYMENT_PLAN_CONSTANTS.DEFAULT_ORDER_ID,
	hideNavRow = false,
}: OrderPaymentPlanListPageProps) {
	const t = useTranslate();
	const { orderData } = useOrderOpened(orderId);
	const serialNo = orderData?.orderDetails?.serialNo || orderData?.id || orderId;

	const {
		isLoading,
		searchQuery,
		setSearchQuery,
		setStatusFilter,
		bestallarePlans,
		ueLevPlans,
		rawUeLevCount,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		handleAddUeLevPlan,
		handleDeletePlan,
		handleSendPlan,
	} = usePaymentPlan(orderId);

	const [activeTab, setActiveTab] = useState<"bestallare" | "ue-lev">("bestallare");
	const [isAddUeModalOpen, setIsAddUeModalOpen] = useState(false);

	const handlePrint = () => {
		if (typeof window !== "undefined") {
			window.print();
		}
	};

	const recordTitle = (
		<span className="flex flex-wrap items-center">
			<span className="text-slate-400 font-normal">
				{t(localizationConstants.order)} {serialNo}&nbsp;/&nbsp;
			</span>
			<span className="text-slate-900 font-semibold truncate">
				{t(localizationConstants.paymentPlanTitle)}
			</span>
		</span>
	);

	return (
		<div className="flex h-full flex-col bg-white relative overflow-hidden font-sans antialiased text-slate-900">
			{/* Main Content Scrollable Container */}
			<div className={hideNavRow ? "flex-1 overflow-y-auto" : "flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6"}>
				<div className="w-full space-y-6">
					{/* Record Back Navigation Bar */}
					{!hideNavRow && (
						<RecordNavRow
							title={recordTitle}
							backHref={`${ORDER_MODULE_BASE_URL}/${orderId}`}
							className="pt-0"
							titleClassName="font-sans text-base sm:text-xl md:text-2xl font-semibold leading-tight tracking-[-0.6px] text-slate-900 align-middle"
							backButtonClassName="mt-0"
						/>
					)}

					<div className={hideNavRow ? "space-y-4" : "ml-0 sm:ml-7 space-y-4"}>
						{/* Tabs: Betalningsplan beställare / Betalningsplan UE / Lev */}
						<Tabs
							value={activeTab}
							onValueChange={(val) => setActiveTab(val as "bestallare" | "ue-lev")}
							className="w-full flex flex-col"
						>
							<div className="overflow-x-auto overflow-y-hidden scrollbar-none border-b border-slate-200">
								<TabsList variant="line" className="inline-flex items-center gap-1 sm:gap-2 min-w-max h-[36px]">
									<TabsTrigger value="bestallare" className="cursor-pointer">
										{t(localizationConstants.paymentPlanBestallareTab)}
									</TabsTrigger>
									<TabsTrigger value="ue-lev" className="cursor-pointer">
										{t(localizationConstants.paymentPlanUeLevTab)}
									</TabsTrigger>
								</TabsList>
							</div>

							{/* Controls Bar: Search, Filter on Left, Print on Right */}
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full pb-2">
								<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
									<Search
										value={searchQuery}
										onChange={(val) => setSearchQuery(val)}
										placeholder={localizationConstants.orgSearchPlaceholder}
										className="h-10 w-full"
										wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[280px]"
									/>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="outline"
												className="h-10 w-full sm:w-[85px] border-slate-200 text-slate-900 font-normal bg-white hover:bg-slate-50 gap-1.5 px-2.5 text-xs shadow-none justify-between cursor-pointer"
											>
												<Translate text={localizationConstants.filter} />
												<ChevronDown className="h-3.5 w-3.5 text-slate-900 shrink-0" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start" className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1">
											<DropdownMenuItem
												onClick={() => setStatusFilter("all")}
												className="cursor-pointer text-xs text-slate-900 focus:bg-slate-100 focus:text-slate-900"
											>
												<Translate text={localizationConstants.orgFilterAll} />
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => setStatusFilter("not_invoiced")}
												className="cursor-pointer text-xs text-slate-900 focus:bg-slate-100 focus:text-slate-900"
											>
												<Translate text={localizationConstants.statusEjFakturerad} />
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => setStatusFilter("invoiced")}
												className="cursor-pointer text-xs text-slate-900 focus:bg-slate-100 focus:text-slate-900"
											>
												<Translate text={localizationConstants.statusFakturerad} />
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => setStatusFilter("approved")}
												className="cursor-pointer text-xs text-slate-900 focus:bg-slate-100 focus:text-slate-900"
											>
												<Translate text={localizationConstants.statusGodkand} />
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>

								<div className="flex items-center justify-end gap-3 w-full sm:w-auto">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={handlePrint}
										className="h-10 w-10 rounded-lg bg-[#F4F4F5] text-slate-900 hover:bg-[#E4E4E7] shadow-none cursor-pointer border-none opacity-100"
										title={t(localizationConstants.orgPrintButton)}
										aria-label={t(localizationConstants.orgPrintButton)}
									>
										<Printer className="h-4 w-4 text-slate-900" />
									</Button>
								</div>
							</div>

							{/* Loading State */}
							{isLoading ? (
								<div className="space-y-4 pt-2">
									<Skeleton className="h-12 w-full bg-slate-200 rounded-lg" />
									<Skeleton className="h-14 w-full bg-slate-200 rounded-lg" />
									<Skeleton className="h-14 w-full bg-slate-200 rounded-lg" />
								</div>
							) : (
								<>
									{/* Tab 1: Betalningsplan beställare */}
									<TabsContent value="bestallare" className="mt-0 focus-visible:outline-none">
										<BestallarePaymentPlanTab
											plans={bestallarePlans}
											orderId={orderId}
											onDelete={(id) => handleDeletePlan(id, false)}
											onSend={(id) => handleSendPlan(id)}
										/>
									</TabsContent>

									{/* Tab 2: Betalningsplan UE / Lev */}
									<TabsContent value="ue-lev" className="mt-0 focus-visible:outline-none">
										<UeLevPaymentPlanTab
											plans={ueLevPlans}
											rawCount={rawUeLevCount}
											currentPage={currentPage}
											pageSize={pageSize}
											totalPages={totalPages}
											onPageChange={setCurrentPage}
											onPageSizeChange={setPageSize}
											onOpenAddModal={() => setIsAddUeModalOpen(true)}
											onDelete={(id) => handleDeletePlan(id, true)}
											onSend={(id) => handleSendPlan(id)}
										/>
									</TabsContent>
								</>
							)}
						</Tabs>
					</div>
				</div>
			</div>

			{/* Create UE/Lev Plan Modal */}
			<AddUeLevPlanModal
				isOpen={isAddUeModalOpen}
				onClose={() => setIsAddUeModalOpen(false)}
				onAdd={(payload) => handleAddUeLevPlan(payload)}
			/>
		</div>
	);
}

export default OrderPaymentPlanListPage;
