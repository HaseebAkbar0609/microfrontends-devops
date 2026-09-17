"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Breadcrumb,
	BreadcrumbItem as BreadcrumbUIItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderOpenedData } from "../types/orderOpened.types";
import { OrderInformationView } from "./OrderInformationView";
import { OrderInspectionView } from "./inspection/OrderInspectionView";
import { OrderOrganisationPage } from "@/features/orders/organisation/OrderOrganisationPage";
import { OrderPaymentPlanListPage } from "@/features/orders/payment-plan/OrderPaymentPlanListPage";
import { WarrantyFeature } from "@/features/warranty/WarrantyFeature";
import { OrderProtocolOverviewPage } from "@/features/orders/protocol/OrderProtocolOverviewPage";
import { OrderAtaOverviewPage } from "@/features/orders/ata/OrderAtaOverviewPage";
import { OrderStaffOverviewPage } from "@/features/orders/staff/OrderStaffOverviewPage";
import { OrderTimeplanOverviewPage } from "@/features/orders/timeplan/OrderTimeplanOverviewPage";
import { OrderQaOverviewPage } from "@/features/orders/qa/OrderQaOverviewPage";
import { OrderDocumentsOverviewPage } from "@/features/orders/documents";
import { OrderConstructionLogOverviewPage } from "@/features/orders/construction-log/OrderConstructionLogOverviewPage";

export interface OrderOpenedSectionsProps {
	data: OrderOpenedData;
	onUpdateData?: (updated: Partial<OrderOpenedData>) => void;
	orderId?: string;
	initialTab?: string;
	activeTab?: string;
	onTabChange?: (tab: string) => void;
}

type OrderTabValue =
	| "order-information"
	| "inspection"
	| "organisation"
	| "payment-plan"
	| "ata"
	| "guarantee"
	| "handlingar"
	| "protocol"
	| "staff"
	| "tidsplan"
	| "fraga-svar"
	| "dagbok";

export function OrderOpenedSections({
	data,
	onUpdateData,
	orderId,
	initialTab,
	activeTab: controlledActiveTab,
	onTabChange,
}: OrderOpenedSectionsProps) {
	const t = useTranslate();
	const router = useRouter();
	const pathname = usePathname() || "";

	// Safely resolve order ID from props, pathname segment, or data
	const pathSegments = pathname.split("/").filter(Boolean);
	const orderIndex = pathSegments.indexOf("order");
	const extractedIdFromPath = orderIndex !== -1 && pathSegments[orderIndex + 1] ? pathSegments[orderIndex + 1] : undefined;
	const routeOrderId = (orderId || extractedIdFromPath || data?.id || "").trim();

	if (!routeOrderId) {
		console.error("[OrderOpenedSections] Unable to determine a valid order ID from route, props, or data.");
	}

	const getTabFromPath = (path: string): OrderTabValue => {
		if (path.includes("/inspection")) return "inspection";
		if (path.includes("/organisation")) return "organisation";
		if (path.includes("/payment-plan")) return "payment-plan";
		if (path.includes("/ata")) return "ata";
		if (path.includes("/guarantee")) return "guarantee";
		if (path.includes("/handlingar") || path.includes("/documents")) return "handlingar";
		if (path.includes("/protocol")) return "protocol";
		if (path.includes("/staff")) return "staff";
		if (path.includes("/tidsplan") || path.includes("/timeplan")) return "tidsplan";
		if (path.includes("/fraga-svar") || path.includes("/qa")) return "fraga-svar";
		if (path.includes("/dagbok") || path.includes("/construction-log")) return "dagbok";
		return "order-information";
	};

	const activeTab: OrderTabValue = pathname
		? getTabFromPath(pathname)
		: (controlledActiveTab as OrderTabValue) || (initialTab as OrderTabValue) || "order-information";

	const [isGuaranteeDetailOpen, setIsGuaranteeDetailOpen] = useState(false);
	const [isProtocolDetailOpen, setIsProtocolDetailOpen] = useState(false);
	const [isAtaDetailOpen, setIsAtaDetailOpen] = useState(false);
	const [isTimeplanDetailOpen, setIsTimeplanDetailOpen] = useState(false);

	useEffect(() => {
		if (activeTab !== "guarantee") {
			setIsGuaranteeDetailOpen(false);
		}
		if (activeTab !== "protocol") {
			setIsProtocolDetailOpen(false);
		}
		if (activeTab !== "ata") {
			setIsAtaDetailOpen(false);
		}
		if (activeTab !== "tidsplan") {
			setIsTimeplanDetailOpen(false);
		}
	}, [activeTab, routeOrderId]);

	const handleTabChange = (val: string) => {
		const tabVal = val as OrderTabValue;
		if (onTabChange) {
			onTabChange(tabVal);
		}

		const targetPath = `/module/production/order/${routeOrderId}/${tabVal}`;

		if (pathname !== targetPath) {
			router.push(targetPath);
		}
	};

	const serialNo = (data.orderDetails?.serialNo || data.id || "").replace(/[<>'"` ]/g, "").trim();

	const tabLabels: Record<OrderTabValue, string> = {
		"order-information": t(localizationConstants.orderInformationTab),
		inspection: t(localizationConstants.orderInspectionTab),
		organisation: t(localizationConstants.orderOrganisationTab),
		"payment-plan": t(localizationConstants.paymentPlanTitle),
		ata: t(localizationConstants.ataTitle),
		guarantee: t(localizationConstants.warrantyCommitments),
		handlingar: t(localizationConstants.orderHandlingarTab),
		protocol: t(localizationConstants.protocolsTab),
		staff: t(localizationConstants.staffLedgerTab),
		tidsplan: t(localizationConstants.orderTimeplanTab),
		"fraga-svar": t(localizationConstants.orderQaTab),
		dagbok: t(localizationConstants.orderDagbokTab),
	};

	const showSubtitle =
		!(activeTab === "guarantee" && isGuaranteeDetailOpen) &&
		!(activeTab === "protocol" && isProtocolDetailOpen) &&
		!(activeTab === "ata" && isAtaDetailOpen) &&
		!(activeTab === "tidsplan" && isTimeplanDetailOpen);

	const orderLabel = serialNo
		? `${t(localizationConstants.order)} ${serialNo}`
		: t(localizationConstants.order);

	const breadcrumbItems = [
		{ label: t(localizationConstants.home), href: "/home" },
		{ label: t(localizationConstants.moduleItem), href: "/module" },
		{ label: t(localizationConstants.production), href: "/module/production" },
		{ label: t(localizationConstants.orderModule), href: "/module/production/order/overview" },
		{ label: orderLabel, href: `/module/production/order/${routeOrderId}/order-information` },
		{ label: tabLabels[activeTab] },
	];

	return (
		<div className="flex flex-col">
			<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col gap-0">
				<TabsList variant="line" className="pl-4 sm:pl-[3.25rem] pr-4 sm:pr-6">
					<TabsTrigger value="order-information" asChild>
						<Link
							href={`/module/production/order/${routeOrderId}/order-information`}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.orderInformationTab} />
						</Link>
					</TabsTrigger>
					<TabsTrigger value="inspection" asChild>
						<Link
							href={`/module/production/order/${routeOrderId}/inspection`}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.orderInspectionTab} />
						</Link>
					</TabsTrigger>
					<TabsTrigger value="organisation" asChild>
						<Link
							href={`/module/production/order/${routeOrderId}/organisation`}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.orderOrganisationTab} />
						</Link>
					</TabsTrigger>
					<TabsTrigger value="payment-plan" asChild>
						<Link
							href={`/module/production/order/${routeOrderId}/payment-plan`}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.paymentPlanTitle} />
						</Link>
					</TabsTrigger>
					<TabsTrigger value="ata" asChild>
						<Link
							href={`/module/production/order/${routeOrderId}/ata`}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.ataTitle} />
						</Link>
					</TabsTrigger>
					<TabsTrigger value="guarantee" asChild>
						<Link
							href={`/module/production/order/${routeOrderId}/guarantee`}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.warrantyCommitments} />
						</Link>
					</TabsTrigger>
					<TabsTrigger value="handlingar" asChild>
						<Link
							href={`/module/production/order/${routeOrderId}/documents`}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.orderHandlingarTab} />
						</Link>
					</TabsTrigger>
					<TabsTrigger value="protocol" asChild>
						<Link
							href={`/module/production/order/${routeOrderId}/protocol`}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.protocolsTab} />
						</Link>
					</TabsTrigger>
					<TabsTrigger value="staff" asChild>
						<Link
							href={`/module/production/order/${routeOrderId}/staff`}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.staffLedgerTab} />
						</Link>
					</TabsTrigger>
					<TabsTrigger value="tidsplan" asChild>
						<Link
							href={`/module/production/order/${routeOrderId}/tidsplan`}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.orderTimeplanTab} />
						</Link>
					</TabsTrigger>
					<TabsTrigger value="fraga-svar" asChild>
						<Link
							href={`/module/production/order/${routeOrderId}/fraga-svar`}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.orderQaTab} />
						</Link>
					</TabsTrigger>
					<TabsTrigger value="dagbok" asChild>
						<Link
							href={`/module/production/order/${routeOrderId}/construction-log`}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.orderDagbokTab} />
						</Link>
					</TabsTrigger>
				</TabsList>

				{/* Active tab title & Breadcrumbs */}
				{showSubtitle && (
					<div className="px-4 sm:px-6 mb-4">
						<div className="ml-0 sm:ml-7 pt-6 sm:pt-7 flex flex-col gap-1.5">
							<h1 className="font-sans font-semibold text-lg sm:text-xl md:text-2xl leading-7 sm:leading-8 tracking-normal align-middle text-[#0A0A0A]">
								{tabLabels[activeTab]}
							</h1>
							<Breadcrumb>
								<BreadcrumbList className="flex items-center flex-wrap gap-1 text-[#64748B]">
									{breadcrumbItems.map((item, index) => {
										const isLast = index === breadcrumbItems.length - 1;
										return (
											<BreadcrumbUIItem
												key={`${item.label}-${index}`}
												className="flex items-center gap-1 text-sm!"
											>
												{index !== 0 && <BreadcrumbSeparator className="text-[#64748B]" />}
												{isLast ? (
													<BreadcrumbPage className="font-sans text-sm leading-5 tracking-normal text-[#64748B] font-normal!">
														{item.label}
													</BreadcrumbPage>
												) : (
													<BreadcrumbLink asChild>
														<Link
															href={item.href || "#"}
															className="font-sans font-normal text-sm leading-5 tracking-normal text-[#64748B] hover:text-[#0A0A0A] transition-colors"
														>
															{item.label}
														</Link>
													</BreadcrumbLink>
												)}
											</BreadcrumbUIItem>
										);
									})}
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</div>
				)}

				{/* Tab 1: Orderinformation (contains Projektuppgifter & Offert) */}
				<TabsContent value="order-information" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 pb-6 focus-visible:outline-none">
					<OrderInformationView data={data} onUpdateData={onUpdateData} />
				</TabsContent>

				{/* Tab 2: Besiktning */}
				<TabsContent value="inspection" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 pb-6 focus-visible:outline-none">
					<OrderInspectionView orderId={routeOrderId} />
				</TabsContent>

				{/* Tab 3: Organisation */}
				<TabsContent value="organisation" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 focus-visible:outline-none">
					<OrderOrganisationPage orderId={routeOrderId} hideNavRow />
				</TabsContent>

				{/* Tab 4: Betalningsplan */}
				<TabsContent value="payment-plan" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 focus-visible:outline-none">
					<OrderPaymentPlanListPage orderId={routeOrderId} hideNavRow />
				</TabsContent>

				{/* Tab 5: ÄTA */}
				<TabsContent value="ata" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 focus-visible:outline-none">
					<OrderAtaOverviewPage
						orderId={routeOrderId}
						onDetailModeChange={setIsAtaDetailOpen}
					/>
				</TabsContent>

				{/* Tab 6: Garantiåtaganden */}
				<TabsContent value="guarantee" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 focus-visible:outline-none">
					<WarrantyFeature
						recordId={routeOrderId}
						onDetailModeChange={setIsGuaranteeDetailOpen}
					/>
				</TabsContent>

				{/* Tab 7: Handlingar */}
				<TabsContent value="handlingar" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 focus-visible:outline-none">
					<OrderDocumentsOverviewPage orderId={routeOrderId} hideNavRow />
				</TabsContent>

				{/* Tab 8: Protokoll */}
				<TabsContent value="protocol" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 focus-visible:outline-none">
					<OrderProtocolOverviewPage
						orderId={routeOrderId}
						onDetailModeChange={setIsProtocolDetailOpen}
					/>
				</TabsContent>

				{/* Tab 9: Personal-liggare */}
				<TabsContent value="staff" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 focus-visible:outline-none">
					<OrderStaffOverviewPage orderId={routeOrderId} />
				</TabsContent>

				{/* Tab 10: Tidsplan */}
				<TabsContent value="tidsplan" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 focus-visible:outline-none">
					<OrderTimeplanOverviewPage
						orderId={routeOrderId}
						onDetailModeChange={setIsTimeplanDetailOpen}
					/>
				</TabsContent>

				{/* Tab 10: Fråga/Svar (Q&A) */}
				<TabsContent value="fraga-svar" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 focus-visible:outline-none">
					<OrderQaOverviewPage orderId={routeOrderId} />
				</TabsContent>

				{/* Tab 11: Dagbok (Construction Log) */}
				<TabsContent value="dagbok" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 focus-visible:outline-none">
					<OrderConstructionLogOverviewPage orderId={routeOrderId} hideTitle />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default OrderOpenedSections;

