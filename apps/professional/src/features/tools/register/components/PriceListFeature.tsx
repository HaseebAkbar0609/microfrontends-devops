"use client";

import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PriceListRegisterTable, PriceListUpdatePanel } from "./PriceListRegisterTable";

export function PriceListFeature() {
	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Breadcrumbs & Page Header */}
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold tracking-tight text-slate-900">
					<Translate text={localizationConstants.priceListOption} />
				</h1>
				<nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
					<Link href="/" className="hover:text-slate-900 transition-colors">
						<Translate text={localizationConstants.home} />
					</Link>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<Link href="/tools" className="hover:text-slate-900 transition-colors">
						<Translate text={localizationConstants.tools} />
					</Link>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<Link href="/tools/register" className="hover:text-slate-900 transition-colors">
						<Translate text={localizationConstants.register} />
					</Link>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span className="text-slate-900">
						<Translate text={localizationConstants.priceListOption} />
					</span>
				</nav>
			</div>

			{/* Price List Tabs */}
			<Tabs defaultValue="prislista" className="w-full flex-1 flex flex-col">
				<div className="border-b border-slate-200">
					<TabsList variant="line" className="gap-8 bg-transparent p-0 -mb-px">
						<TabsTrigger value="prislista" className="pb-3 pt-1 text-sm font-semibold">
							<Translate text={localizationConstants.priceListTab} />
						</TabsTrigger>
						<TabsTrigger value="uppdatera" className="pb-3 pt-1 text-sm font-semibold">
							<Translate text={localizationConstants.updatePriceListTab} />
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="prislista" className="flex-1 pt-4">
					<Suspense fallback={<div className="py-8 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
						<PriceListRegisterTable />
					</Suspense>
				</TabsContent>
				<TabsContent value="uppdatera" className="flex-1 pt-4">
					<Suspense fallback={<div className="py-8 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
						<PriceListUpdatePanel />
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
}
