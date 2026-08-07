"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { IntegrationOffering } from "../constants/mockData";
import { useIntegrationFilters } from "../hooks/useIntegrationFilters";
import {
	connectIntegration,
	listIntegrationOfferings,
} from "../services/integrationService";
import IntegrationCard from "./IntegrationCard";

const CreateIntegrationPage = () => {
	const t = useTranslate();
	const router = useRouter();
	const [offerings, setOfferings] = useState<IntegrationOffering[]>(() =>
		listIntegrationOfferings(),
	);
	const filters = useIntegrationFilters(offerings);

	const handleConnect = (offering: IntegrationOffering) => {
		setOfferings(connectIntegration(offering.id));
		showToast(
			"success",
			t(localizationConstants.integrationConnectedToast),
		);
	};

	return (
		<div className="flex flex-col gap-5 p-6">
			<div className="flex items-start gap-3">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => router.push("/admin/integration")}
					className="mt-0.5 h-8 w-8 rounded-md text-slate-700"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div>
					<h1 className="text-2xl font-bold text-slate-900">
						<Translate
							text={localizationConstants.integrationCreate}
						/>
					</h1>
					<p className="mt-1 text-sm text-slate-500">
						<Translate
							text={localizationConstants.integrationHeading}
						/>
					</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-4">
					<div className="relative w-full max-w-xs">
						<Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							value={filters.search}
							onChange={(event) =>
								filters.setSearch(event.target.value)
							}
							placeholder={t(localizationConstants.search)}
							className="h-9 rounded-none border-0 border-b border-slate-200 bg-transparent pl-6 text-sm shadow-none focus-visible:border-slate-400 focus-visible:ring-0"
						/>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="h-9 gap-1.5 rounded-md border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
							>
								<Translate text={localizationConstants.filter} />
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-48 rounded-md border border-slate-200 bg-white p-1 shadow-md"
						>
							<DropdownMenuItem
								onClick={() => filters.setFilter("all")}
								className={cn(
									"cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700",
									filters.filter === "all" &&
										"bg-slate-100 font-medium text-slate-900",
								)}
							>
								<Translate
									text={
										localizationConstants.integrationFilterAll
									}
								/>
							</DropdownMenuItem>
							{filters.providers.map((provider) => (
								<DropdownMenuItem
									key={provider}
									onClick={() => filters.setFilter(provider)}
									className={cn(
										"cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700",
										filters.filter === provider &&
											"bg-slate-100 font-medium text-slate-900",
									)}
								>
									{provider}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<Button
					type="button"
					onClick={() =>
						showToast(
							"success",
							t(localizationConstants.comingSoon),
						)
					}
					className="h-11 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.integrationCreate} />
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
				{filters.filtered.map((offering) => (
					<IntegrationCard
						key={offering.id}
						offering={offering}
						onConnect={handleConnect}
					/>
				))}
			</div>
		</div>
	);
};

export default CreateIntegrationPage;
