"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { usePriceListDetail } from "../../../hooks/usePriceListDetail";
import { PriceListGrundInfoTab } from "./tabs/PriceListGrundInfoTab";
import { PriceListArtikelListaTab } from "./tabs/PriceListArtikelListaTab";
import { PRICE_LISTS_BASE_ROUTE } from "../../../constants/priceLists.constants";

interface PriceListDetailPageProps {
	readonly id: string;
}

export function PriceListDetailPage({ id }: PriceListDetailPageProps) {
	const router = useRouter();
	const {
		priceList,
		isLoading,
		activeTab,
		setActiveTab,
		isEditingGrundInfo,
		editGrundInfoData,
		setEditGrundInfoData,
		startEditGrundInfo,
		cancelEditGrundInfo,
		saveGrundInfo,
		isEditingSettings,
		editSettingsData,
		setEditSettingsData,
		startEditSettings,
		cancelEditSettings,
		saveSettings,
		articleSearchQuery,
		setArticleSearchQuery,
		filteredArticles,
	} = usePriceListDetail(id);

	if (isLoading) {
		return (
			<div className="p-8 text-center text-sm text-slate-500">
				<Translate text={localizationConstants.genericLoading} />
			</div>
		);
	}

	if (!priceList) {
		return (
			<div className="p-8 space-y-4">
				<Button
					variant="ghost"
					onClick={() => router.push(PRICE_LISTS_BASE_ROUTE)}
					className="text-slate-600 gap-2 cursor-pointer"
				>
					<ArrowLeft className="h-4 w-4" />
					<Translate text={localizationConstants.priceListGoBackLabel} />
				</Button>
				<p className="text-slate-500 text-sm">Prislistan hittades inte.</p>
			</div>
		);
	}

	return (
		<div className="p-6 w-full space-y-6">
			{/* Top Bar with Back Button & Details Header */}
			<div className="flex items-start gap-3">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => router.push(PRICE_LISTS_BASE_ROUTE)}
					className="h-8 w-8 text-slate-900 hover:bg-slate-100 cursor-pointer mt-0.5"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div>
					<h1 className="text-xl font-bold text-slate-900 leading-tight">
						<Translate text={localizationConstants.priceListDetailTitle} />
					</h1>
					<p className="text-xs text-slate-400 font-normal mt-0.5">#{priceList.code}</p>
				</div>
			</div>

			{/* Sub Tabs Bar */}
			<div className="border-b border-slate-200">
				<Tabs
					value={activeTab}
					onValueChange={(val) => setActiveTab(val as "grundinfo" | "artikellista")}
				>
					<TabsList variant="line" className="gap-8 bg-transparent p-0 -mb-px">
						<TabsTrigger value="grundinfo" className="pb-3 pt-1 text-sm font-semibold cursor-pointer">
							<Translate text={localizationConstants.priceListDetailBasicInfoTab} />
						</TabsTrigger>
						<TabsTrigger value="artikellista" className="pb-3 pt-1 text-sm font-semibold cursor-pointer">
							<Translate text={localizationConstants.priceListDetailArticleListTab} />
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Tab Body */}
			{activeTab === "grundinfo" ? (
				<PriceListGrundInfoTab
					priceList={priceList}
					isEditingGrundInfo={isEditingGrundInfo}
					editGrundInfoData={editGrundInfoData}
					setEditGrundInfoData={setEditGrundInfoData}
					startEditGrundInfo={startEditGrundInfo}
					cancelEditGrundInfo={cancelEditGrundInfo}
					saveGrundInfo={saveGrundInfo}
					isEditingSettings={isEditingSettings}
					editSettingsData={editSettingsData}
					setEditSettingsData={setEditSettingsData}
					startEditSettings={startEditSettings}
					cancelEditSettings={cancelEditSettings}
					saveSettings={saveSettings}
				/>
			) : (
				<PriceListArtikelListaTab
					articles={filteredArticles}
					searchQuery={articleSearchQuery}
					onSearchChange={setArticleSearchQuery}
				/>
			)}
		</div>
	);
}

export default PriceListDetailPage;
