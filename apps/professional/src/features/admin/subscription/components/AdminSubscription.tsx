"use client";

import { useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicBreadcrumb } from "@/components/common";
import { useQueryParams } from "@/hooks/useQueryParams";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	SUBSCRIPTION_TAB_IDS,
	SUBSCRIPTION_TABS,
	SubscriptionLicenseRow,
	SubscriptionTabId,
} from "../constants/mockData";
import { getSubscriptionOverview } from "../services/subscriptionService";
import PaymentMethodTab from "./PaymentMethodTab";

const isSubscriptionTabId = (
	value: string | null,
): value is SubscriptionTabId =>
	SUBSCRIPTION_TAB_IDS.includes(value as SubscriptionTabId);

const LicenseTable = ({
	headerKey,
	rows,
}: {
	headerKey: string;
	rows: SubscriptionLicenseRow[];
}) => (
	<table className="w-full text-sm">
		<thead>
			<tr className="text-left text-slate-500">
				<th className="pb-2 pr-4 font-medium">
					<Translate text={headerKey} />
				</th>
				<th className="pb-2 font-medium">
					<Translate
						text={localizationConstants.subscriptionColLicenses}
					/>
				</th>
			</tr>
		</thead>
		<tbody>
			{rows.map((row) => (
				<tr key={row.name} className="border-t border-slate-200">
					<td className="py-3 pr-4 text-slate-800">{row.name}</td>
					<td className="py-3 text-slate-800">{row.licenseCount}</td>
				</tr>
			))}
		</tbody>
	</table>
);

const AdminSubscription = () => {
	const { query, changeQueries } = useQueryParams();
	const tabParam = query.get("tab");
	const activeTab: SubscriptionTabId = isSubscriptionTabId(tabParam)
		? tabParam
		: "my";
	const setActiveTab = (value: string) =>
		changeQueries({ tab: value === "my" ? null : value });

	const subscription = useMemo(() => getSubscriptionOverview(), []);

	return (
		<div className="flex flex-col gap-6 p-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-900 mb-2">
					<Translate text={localizationConstants.adminSubscription} />
				</h1>
				<DynamicBreadcrumb
					variant="small"
					items={[
						{
							translationKey: localizationConstants.adminItem,
							href: "/admin/settings",
						},
						{
							translationKey:
								localizationConstants.adminSubscription,
						},
					]}
				/>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<div className="border-b border-slate-200">
					<TabsList className="h-auto gap-6 rounded-none bg-transparent p-0">
						{SUBSCRIPTION_TABS.map((tab) => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="rounded-none border-b-2 border-transparent bg-transparent px-1 pb-3 pt-2 text-sm font-medium text-slate-500 shadow-none data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
							>
								<Translate text={tab.label} />
							</TabsTrigger>
						))}
					</TabsList>
				</div>
			</Tabs>

			{activeTab === "my" ? (
				<div className="grid grid-cols-12 items-stretch gap-6">
					<div className="col-span-12 flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white lg:col-span-4 xl:col-span-3">
						<div className="bg-slate-200/60 px-5 py-3.5">
							<h2 className="text-lg font-semibold text-slate-800">
								<Translate
									text={
										localizationConstants.subscriptionTabMy
									}
								/>
							</h2>
						</div>
						<div className="space-y-4 px-5 py-4 text-sm">
							<div>
								<p className="font-semibold text-slate-900">
									<Translate
										text={
											localizationConstants.subscriptionNumberLabel
										}
									/>
								</p>
								<p className="mt-0.5 text-slate-600">
									{subscription.subscriptionNumber}
								</p>
							</div>
							<div>
								<p className="font-semibold text-slate-900">
									<Translate
										text={
											localizationConstants.subscriptionStartLabel
										}
									/>
								</p>
								<p className="mt-0.5 text-slate-600">
									{subscription.startDate}
								</p>
							</div>
						</div>
					</div>

					<div className="col-span-12 flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white lg:col-span-8 xl:col-span-9">
						<div className="bg-slate-200/60 px-5 py-3.5">
							<h2 className="text-lg font-semibold text-slate-800">
								<Translate
									text={
										localizationConstants.subscriptionDetailTitlePrefix
									}
								/>{" "}
								{subscription.agreementNumber}
							</h2>
						</div>
						<div className="grid flex-1 grid-cols-12 gap-6 px-5 py-4">
							<div className="col-span-12 md:col-span-4 xl:col-span-3">
								<LicenseTable
									headerKey={
										localizationConstants.subscriptionColPackage
									}
									rows={subscription.packages}
								/>
							</div>
							<div
								className="col-span-12 hidden min-h-56 self-stretch rounded-sm bg-slate-200/80 md:col-span-4 md:block xl:col-span-5"
								aria-hidden
							/>
							<div className="col-span-12 md:col-span-4 xl:col-span-4">
								<LicenseTable
									headerKey={
										localizationConstants.subscriptionColAddons
									}
									rows={subscription.addons}
								/>
								<div className="mt-4 space-y-3 rounded-md bg-slate-50 p-4 text-sm">
									{subscription.services.map((service) => (
										<div
											key={service.id}
											className="flex items-center justify-between"
										>
											<span className="font-semibold text-slate-900">
												<Translate
													text={service.labelKey}
												/>
											</span>
											{service.active && (
												<span className="rounded-full border border-green-400 px-2.5 py-0.5 text-xs font-medium text-green-600">
													<Translate
														text={
															localizationConstants.subscriptionStatusActive
														}
													/>
												</span>
											)}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<PaymentMethodTab />
			)}
		</div>
	);
};

export default AdminSubscription;
