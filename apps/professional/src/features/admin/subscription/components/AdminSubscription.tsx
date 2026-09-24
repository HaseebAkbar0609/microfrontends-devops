"use client";

import Link from "next/link";
import { CalendarDays, CreditCard, Loader2 } from "lucide-react";
import { DynamicBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { LIFECYCLE_UPGRADE_PATH } from "@/features/account-lifecycle/constants";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	SUBSCRIPTION_TAB_IDS,
	SUBSCRIPTION_TABS,
	SubscriptionTabId,
} from "../constants/mockData";
import { useSubscriptionOverview } from "../hooks/useSubscriptionOverview";
import { type SubscriptionOverviewItem } from "../services/subscriptionService";
import { OutstandingInvoices } from "./OutstandingInvoices";
import PaymentMethodTab from "./PaymentMethodTab";
import { SUBSCRIPTION_EDITOR_PATHS } from "../services/subscriptionSelection";

const isSubscriptionTabId = (
	value: string | null,
): value is SubscriptionTabId =>
	SUBSCRIPTION_TAB_IDS.includes(value as SubscriptionTabId);

function formatDate(value: string | null): string {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return new Intl.DateTimeFormat(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
}

function formatAmount(amount: number | null, currency = "SEK"): string {
	if (amount === null) return "—";
	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency,
		minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
		maximumFractionDigits: 2,
	}).format(amount / 100);
}

function statusClass(status: string | null): string {
	if (status === "ACTIVE" || status === "DEMO") {
		return "bg-emerald-50 text-emerald-700";
	}
	if (status === "ACTIVE_IN_GRACE") {
		return "bg-amber-50 text-amber-800";
	}
	if (status === "RESTRICTED" || status === "INACTIVE") {
		return "bg-red-50 text-red-700";
	}
	return "bg-slate-100 text-slate-700";
}

function SubscriptionItemsTable({ items }: { items: SubscriptionOverviewItem[] }) {
	return (
		<div className="min-w-0">
			<table className="block w-full text-sm md:table">
				<thead className="hidden md:table-header-group">
					<tr className="border-b border-slate-200 text-left text-slate-500">
						<th className="px-5 py-3 font-medium">
							<Translate text={localizationConstants.subscriptionColPackage} />
						</th>
						<th className="px-5 py-3 font-medium">
							<Translate text={localizationConstants.subscriptionItemType} />
						</th>
						<th className="px-5 py-3 text-right font-medium">
							<Translate text={localizationConstants.subscriptionColQuantity} />
						</th>
						<th className="px-5 py-3 text-right font-medium">
							<Translate text={localizationConstants.subscriptionColUnitPrice} />
						</th>
						<th className="px-5 py-3 text-right font-medium">
							<Translate text={localizationConstants.subscriptionColTotal} />
						</th>
					</tr>
				</thead>
				<tbody className="block md:table-row-group">
					{items.map((item) => (
						<tr key={item.id} className="grid grid-cols-2 gap-y-3 border-b border-slate-100 py-4 last:border-0 md:table-row md:py-0">
							<td className="col-span-2 px-5 font-semibold text-slate-900 md:py-4">{item.name}</td>
							<td className="px-5 text-slate-600 md:py-4">
								<span className="mb-1 block text-xs text-slate-500 md:hidden"><Translate text={localizationConstants.subscriptionItemType} /></span>
								<Translate
									text={
										item.is_license
											? localizationConstants.subscriptionItemLicense
											: localizationConstants.subscriptionItemPlan
									}
								/>
							</td>
							<td className="px-5 text-right tabular-nums text-slate-700 md:py-4">
								<span className="mb-1 block text-xs text-slate-500 md:hidden"><Translate text={localizationConstants.subscriptionColQuantity} /></span>
								{item.quantity}
							</td>
							<td className="px-5 tabular-nums text-slate-700 md:py-4 md:text-right">
								<span className="mb-1 block text-xs text-slate-500 md:hidden"><Translate text={localizationConstants.subscriptionColUnitPrice} /></span>
								{formatAmount(item.unit_amount, item.currency)}
							</td>
							<td className="px-5 text-right font-semibold tabular-nums text-slate-900 md:py-4">
								<span className="mb-1 block text-xs font-normal text-slate-500 md:hidden"><Translate text={localizationConstants.subscriptionColTotal} /></span>
								{formatAmount(item.total_amount, item.currency)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

const AdminSubscription = () => {
	const { query, changeQueries } = useQueryParams();
	const t = useTranslate();
	const tabParam = query.get("tab");
	const activeTab: SubscriptionTabId = isSubscriptionTabId(tabParam)
		? tabParam
		: "my";
	const setActiveTab = (value: string) =>
		changeQueries({ tab: value === "my" ? null : value });
	const subscriptionQuery = useSubscriptionOverview(activeTab === "my");
	const subscription = subscriptionQuery.data;
	const status = subscription?.status?.access_state ?? null;

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 md:py-8">
			<div>
				<h1 className="mb-2 text-2xl font-semibold text-slate-900">
					<Translate text={localizationConstants.adminSubscription} />
				</h1>
				<DynamicBreadcrumb
					variant="small"
					items={[
						{
							translationKey: localizationConstants.adminItem,
							href: "/admin/settings",
						},
						{ translationKey: localizationConstants.adminSubscription },
					]}
				/>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<div className="border-b border-slate-200">
					<TabsList className="h-auto w-full flex-wrap justify-start gap-x-5 gap-y-1 rounded-none bg-transparent p-0">
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

			{activeTab === "my" && <OutstandingInvoices onRefresh={() => void subscriptionQuery.refetch()} />}

			{activeTab === "payment" ? (
				<PaymentMethodTab />
			) : subscriptionQuery.isLoading ? (
				<div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white">
					<Loader2 className="h-6 w-6 animate-spin text-slate-500" />
				</div>
			) : subscriptionQuery.isError ? (
				<div className="rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-700">
					<Translate text={localizationConstants.subscriptionLoadFailed} />
					<Button
						type="button"
						variant="outline"
						className="ml-3"
						onClick={() => void subscriptionQuery.refetch()}
					>
						<Translate text={localizationConstants.retry} />
					</Button>
				</div>
			) : subscription?.sales_onboarding_pending ? (
				<div className="space-y-4 border-y py-5">
					<p><Translate text={localizationConstants.billingSalesPending} /></p>
					<Button variant="outline" onClick={() => setActiveTab("payment")}><CreditCard size={16} /><Translate text={localizationConstants.subscriptionPaymentMethodCard} /></Button>
				</div>
			) : !subscription?.has_subscription ? (
				<div className="rounded-md border border-slate-200 bg-white p-8 text-center">
					<h2 className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.subscriptionEmptyTitle} />
					</h2>
					<p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
						<Translate text={localizationConstants.subscriptionEmptyText} />
					</p>
					<Button asChild className="mt-5 bg-slate-900 text-white hover:bg-slate-800">
						<Link href={LIFECYCLE_UPGRADE_PATH}>
							<Translate text={localizationConstants.subscriptionChoosePlan} />
						</Link>
					</Button>
				</div>
			) : (
				<div className="space-y-6">
					<div className="flex flex-wrap justify-end gap-3">
						{subscription.subscription_id && ["active", "trialing"].includes(subscription.status?.stripe_status ?? "") && <Button asChild variant="primary" className="h-auto min-h-11 whitespace-normal">
							<Link href={SUBSCRIPTION_EDITOR_PATHS.licenses}>
								<Translate text={localizationConstants.subscriptionAddLicenses} />
							</Link>
						</Button>}
						<Button asChild variant="outline">
							<Link href={SUBSCRIPTION_EDITOR_PATHS.subscription}>
								<Translate text={localizationConstants.subscriptionChangePlan} />
							</Link>
						</Button>
					</div>
					{subscription.status?.access_state === "ACTIVE_IN_GRACE" && (
						<div className="rounded-md border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
							<Translate text={localizationConstants.subscriptionGraceWarning} />
						</div>
					)}
					{subscription.status?.access_state === "RESTRICTED" && (
						<div className="rounded-md border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
							<Translate text={localizationConstants.subscriptionRestrictedWarning} />
						</div>
					)}
					{subscription.status?.is_cancelled && subscription.status.cancel_at && (
						<div className="rounded-md border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
							<Translate text={localizationConstants.subscriptionCancellationScheduled} />{" "}
							<strong>{formatDate(subscription.status.cancel_at)}</strong>.
						</div>
					)}
					{subscription.status?.scheduled_change?.effective_at && (
						<div className="rounded-md border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-900">
							<Translate text={localizationConstants.subscriptionScheduledChange} />{" "}
							<strong>
								{formatDate(
									new Date(
										subscription.status.scheduled_change.effective_at,
									).toISOString(),
								)}
							</strong>.
						</div>
					)}

					<div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
						<section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
							<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-5">
								<div className="min-w-0">
									<p className="text-sm text-slate-500">
										<Translate text={localizationConstants.subscriptionDetailTitlePrefix} />
									</p>
									<h2 className="mt-1 break-all text-base font-semibold text-slate-900">
										{subscription.subscription_id ?? "—"}
									</h2>
								</div>
								<span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(status)}`}>
									{status ? status.replaceAll("_", " ") : t(localizationConstants.subscriptionStatusActive)}
								</span>
							</div>
							<SubscriptionItemsTable items={subscription.items} />
						</section>

						<aside className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
							<h2 className="text-lg font-semibold text-slate-900">
								<Translate text={localizationConstants.subscriptionBillingTitle} />
							</h2>
							<div className="mt-5 space-y-5 text-sm">
								<div className="flex gap-3">
									<CalendarDays className="mt-0.5 h-4 w-4 text-slate-500" />
									<div>
										<p className="font-medium text-slate-900">
											<Translate text={localizationConstants.subscriptionStartLabel} />
										</p>
										<p className="mt-0.5 text-slate-500">{formatDate(subscription.start_at)}</p>
									</div>
								</div>
								{subscription.status?.commitment_end_at && (
									<div className="flex gap-3">
										<CalendarDays className="mt-0.5 h-4 w-4 text-slate-500" />
										<div>
											<p className="font-medium text-slate-900">
												<Translate text={localizationConstants.subscriptionCommitmentLabel} />
											</p>
											<p className="mt-0.5 text-slate-500">
												{formatDate(subscription.status.commitment_end_at)}
											</p>
										</div>
									</div>
								)}
								<div className="flex gap-3">
									<CreditCard className="mt-0.5 h-4 w-4 text-slate-500" />
									<div>
										<p className="font-medium text-slate-900">
											<Translate text={localizationConstants.subscriptionNextBilling} />
										</p>
										<p className="mt-0.5 text-slate-500">
											{formatDate(subscription.billing?.next_billing_at ?? null)}
										</p>
									</div>
								</div>
							</div>
							<div className="mt-6 border-t border-slate-200 pt-5">
								<p className="text-sm text-slate-500">
									<Translate text={localizationConstants.subscriptionCurrentTotal} />
								</p>
								<p className="mt-1 text-2xl font-semibold text-slate-900">
									{formatAmount(subscription.billing?.amount ?? null, subscription.billing?.currency ?? "SEK")}
								</p>
								<p className="mt-1 text-xs text-slate-500">
									{subscription.billing?.interval ?? "—"}
								</p>
							</div>
						</aside>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminSubscription;
