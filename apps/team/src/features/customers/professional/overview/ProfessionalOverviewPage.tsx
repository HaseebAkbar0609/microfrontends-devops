"use client";

import { useEffect, useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { getProfessionalAPIAction, type ProfessionalDetail } from "@/api-actions";
import { OverviewTab } from "./OverviewTab";

interface ProfessionalOverviewPageProps {
	readonly id: string;
}

export function ProfessionalOverviewPage({ id }: ProfessionalOverviewPageProps) {
	const [data, setData] = useState<ProfessionalDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("overview");

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);

		void getProfessionalAPIAction(id).then((result) => {
			if (cancelled) return;
			setData(result);
			setIsLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, [id]);

	if (isLoading || !data) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-slate-500" aria-hidden />
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col gap-6 px-8 pt-6 pb-8 overflow-y-auto">
			{/* Top Header Row */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-2xl font-bold tracking-tight text-slate-900">
					<span className="font-normal text-slate-400">
						<Translate text={localizationConstants.professional} /> /{" "}
					</span>
					{data.companyName}
				</h1>

				<Button
					variant="outline"
					className="h-10 gap-2 rounded-lg border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-xs hover:bg-slate-50"
				>
					<Mail className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.sendInvoiceButton} />
				</Button>
			</div>

			{/* Tabs Section */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList variant="line" className="w-full justify-start gap-1 border-b border-slate-200 p-0">
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

				<TabsContent value="overview" className="pt-6">
					<OverviewTab data={data} />
				</TabsContent>

				<TabsContent value="company" className="pt-6">
					<div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
						<Translate text={localizationConstants.companyTab} />
					</div>
				</TabsContent>

				<TabsContent value="licens" className="pt-6">
					<div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
						<Translate text={localizationConstants.licensTab} />
					</div>
				</TabsContent>

				<TabsContent value="leads" className="pt-6">
					<div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
						<Translate text={localizationConstants.leadsTab} />
					</div>
				</TabsContent>

				<TabsContent value="invoices" className="pt-6">
					<div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
						<Translate text={localizationConstants.invoicesTab} />
					</div>
				</TabsContent>

				<TabsContent value="support" className="pt-6">
					<div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
						<Translate text={localizationConstants.supportTab} />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
