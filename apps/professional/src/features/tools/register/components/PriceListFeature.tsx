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
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold tracking-tight text-slate-900">
					<Translate text={localizationConstants.priceListOption} />
				</h1>
				<nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
					<Link href="/" className="hover:text-slate-900 transition-colors">
						<Translate text={localizationConstants.home} />
					</Link>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span><Translate text={localizationConstants.moduleItem} /></span>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span><Translate text={localizationConstants.invoice} /></span>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span className="text-slate-900">
						<Translate text={localizationConstants.priceListOption} />
					</span>
				</nav>
			</div>

			<Tabs defaultValue="prislista" className="w-full">
				<TabsList>
					<TabsTrigger value="prislista">
						<Translate text={localizationConstants.priceListTab} />
					</TabsTrigger>
					<TabsTrigger value="uppdatera">
						<Translate text={localizationConstants.updatePriceListTab} />
					</TabsTrigger>
				</TabsList>
				<TabsContent value="prislista">
					<Suspense fallback={<div className="py-8 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
						<PriceListRegisterTable />
					</Suspense>
				</TabsContent>
				<TabsContent value="uppdatera">
					<Suspense fallback={<div className="py-8 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
						<PriceListUpdatePanel />
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
}
