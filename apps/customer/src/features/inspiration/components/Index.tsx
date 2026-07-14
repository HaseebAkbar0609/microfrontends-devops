"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { detailTabTriggerClass } from "@/features/quote/constants";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { INSPIRATION_BREADCRUMBS, ADVICE_CARDS, INSPIRATION_CARDS } from "../constants";
import { AdviceCard } from "./AdviceCard";

export default function InspirationFeature() {
	return (
		<div className="min-h-screen bg-white">
		<Tabs defaultValue="advice">
			<PageHeader
				title={localizationConstants.inspiration}
				breadcrumbs={INSPIRATION_BREADCRUMBS}
				className="pb-0"
			>
				<TabsList className="mt-2 flex h-auto w-full justify-start gap-x-8 rounded-none bg-transparent p-0">
					<TabsTrigger value="advice" className={detailTabTriggerClass}>
						<Translate text={localizationConstants.inspirationTabAdvice} />
					</TabsTrigger>
					<TabsTrigger value="inspiration" className={detailTabTriggerClass}>
						<Translate text={localizationConstants.inspirationTabInspiration} />
					</TabsTrigger>
				</TabsList>
			</PageHeader>

		<TabsContent value="advice" className="mt-0">
			<div className="pl-[14px] pb-6 pt-[2px]">
				<div className="grid grid-cols-1 justify-items-start gap-x-[14px] gap-y-[14px] lg:grid-cols-2 xl:grid-cols-3 mr-[160px]">
					{ADVICE_CARDS.map((card) => (
						<AdviceCard key={card.id} card={card} />
					))}
				</div>
			</div>
		</TabsContent>

			<TabsContent value="inspiration" className="mt-0">
				<div className="pl-[14px] pb-6 pt-[2px]">
					<div className="grid grid-cols-1 justify-items-start gap-x-[14px] gap-y-[14px] lg:grid-cols-2 xl:grid-cols-3 mr-[160px]">
						{INSPIRATION_CARDS.map((card) => (
							<AdviceCard key={card.id} card={card} />
						))}
					</div>
				</div>
			</TabsContent>
			</Tabs>
		</div>
	);
}
