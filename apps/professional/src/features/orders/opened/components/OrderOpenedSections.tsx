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
import { OrderGuaranteeCommitmentsPage } from "@/features/orders/guarantee-commitments/OrderGuaranteeCommitmentsPage";
import { OrderProtocolOverviewPage } from "@/features/orders/protocol/OrderProtocolOverviewPage";

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
	| "guarantee"
	| "protocol";

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
		if (path.includes("/guarantee")) return "guarantee";
		if (path.includes("/protocol")) return "protocol";
		return "order-information";
	};

	const activeTab: OrderTabValue = pathname
		? getTabFromPath(pathname)
		: (controlledActiveTab as OrderTabValue) || (initialTab as OrderTabValue) || "order-information";

	const [isGuaranteeDetailOpen, setIsGuaranteeDetailOpen] = useState(false);

	useEffect(() => {
		if (activeTab !== "guarantee") {
			setIsGuaranteeDetailOpen(false);
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
		guarantee: t(localizationConstants.warrantyCommitments),
		protocol: t(localizationConstants.protocolsTab),
	};

	const showSubtitle = !(activeTab === "guarantee" && isGuaranteeDetailOpen);

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
					<TabsTrigger value="guarantee" asChild>
						<Link
							href={`/module/production/order/${routeOrderId}/guarantee`}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.warrantyCommitments} />
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

				{/* Tab 5: Garantiåtaganden */}
				<TabsContent value="guarantee" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 focus-visible:outline-none">
					<OrderGuaranteeCommitmentsPage
						orderId={routeOrderId}
						hideNavRow
						onDetailModeChange={setIsGuaranteeDetailOpen}
					/>
				</TabsContent>

				{/* Tab 7: Protokoll */}
				<TabsContent value="protocol" className="px-4 sm:px-6 ml-0 sm:ml-7 mt-0 pb-6 focus-visible:outline-none">
					<OrderProtocolOverviewPage orderId={routeOrderId} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default OrderOpenedSections;

