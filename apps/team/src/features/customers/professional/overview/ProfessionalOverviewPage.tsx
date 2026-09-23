"use client";

import { useEffect, useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { getProfessionalAPIAction, type ProfessionalDetail } from "@/api-actions";
import { OverviewTab } from "./OverviewTab";
import { SalesBillingPanel } from "./SalesBillingPanel";

interface ProfessionalOverviewPageProps {
	readonly id: string;
}

export function ProfessionalOverviewPage({ id }: ProfessionalOverviewPageProps) {
	const [data, setData] = useState<ProfessionalDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [failed, setFailed] = useState(false);
	const [activeTab, setActiveTab] = useState("overview");

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);
		setFailed(false);

		void getProfessionalAPIAction(id).then((result) => {
			if (cancelled) return;
			setData(result);
			setIsLoading(false);
		}).catch(() => {
			if (!cancelled) { setFailed(true); setIsLoading(false); }
		});

		return () => {
			cancelled = true;
		};
	}, [id]);

	if (failed) return <p role="alert" className="p-8 text-red-700"><Translate text={localizationConstants.billingLoadFailed} /></p>;
	if (isLoading || !data) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-slate-500" aria-hidden />
			</div>
		);
	}

	return (
		<div className="flex h-full min-w-0 flex-col gap-6 overflow-y-auto px-4 pt-6 pb-8 sm:px-8">
			{/* Top Header Row */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-2xl font-bold tracking-tight text-slate-900">
					<span className="font-normal text-slate-400">
						<Translate text={localizationConstants.professional} /> /{" "}
					</span>
					{data.companyName}
				</h1>

				<Button
					onClick={() => setActiveTab("invoices")}
					variant="outline"
					className="h-10 gap-2 rounded-lg border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-xs hover:bg-slate-50"
				>
					<Mail className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.sendInvoiceButton} />
				</Button>
			</div>

			{/* Tabs Section */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="min-w-0 w-full">
				<TabsList variant="line" className="w-full justify-start gap-1 overflow-x-auto border-b border-slate-200 p-0 no-scrollbar">
					<TabsTrigger value="overview" className="w-fit flex-none px-4">
						<Translate text={localizationConstants.overviewTab} />
					</TabsTrigger>
					<TabsTrigger value="company" className="w-fit flex-none px-4">
						<Translate text={localizationConstants.companyTab} />
					</TabsTrigger>
					<TabsTrigger value="licens" className="w-fit flex-none px-4">
						<Translate text={localizationConstants.licensTab} />
					</TabsTrigger>
					<TabsTrigger value="leads" className="w-fit flex-none px-4">
						<Translate text={localizationConstants.leadsTab} />
					</TabsTrigger>
					<TabsTrigger value="invoices" className="w-fit flex-none px-4">
						<Translate text={localizationConstants.invoicesTab} />
					</TabsTrigger>
					<TabsTrigger value="support" className="w-fit flex-none px-4">
						<Translate text={localizationConstants.supportTab} />
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="min-w-0 pt-6">
					<OverviewTab data={data} />
				</TabsContent>

				<TabsContent value="company" className="min-w-0 pt-6">
					<div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
						<Translate text={localizationConstants.companyTab} />
					</div>
				</TabsContent>

				<TabsContent value="licens" className="min-w-0 pt-6">
					<section className="space-y-6">
						<div>
							<p className="text-sm text-slate-500"><Translate text={localizationConstants.planLabel} /></p>
							<p className="text-xl font-semibold text-slate-900">{data.plan}</p>
						</div>
						{data.licensePools.length === 0 ? (
							<p className="text-sm text-slate-500"><Translate text={localizationConstants.licenseNoSeats} /></p>
						) : data.licensePools.map((pool) => (
							<div key={pool.plan_key} className="space-y-3 border-t border-slate-200 pt-4">
								<h2 className="text-base font-medium capitalize text-slate-900">{pool.plan_key}</h2>
								<dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
									{([
										[localizationConstants.licensePurchased, pool.purchased],
										[localizationConstants.licenseAllocated, pool.allocated],
										[localizationConstants.licenseAvailable, pool.available],
									] as const).map(([label, value]) => (
										<div key={label} className="min-w-0">
											<dt className="text-sm text-slate-500"><Translate text={label} /></dt>
											<dd className="text-lg font-semibold text-slate-900">{value}</dd>
										</div>
									))}
								</dl>
							</div>
						))}
					</section>
				</TabsContent>

				<TabsContent value="leads" className="min-w-0 pt-6">
					<div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
						<Translate text={localizationConstants.leadsTab} />
					</div>
				</TabsContent>

				<TabsContent value="invoices" className="min-w-0 pt-6">
					<SalesBillingPanel companyId={id} />
				</TabsContent>

				<TabsContent value="support" className="min-w-0 pt-6">
					<div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
						<Translate text={localizationConstants.supportTab} />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
