"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { detailTabTriggerClass } from "@/features/quote/constants";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { getContentListAPIAction } from "@/api-actions";
import type { ContentItem } from "@/api-actions";
import { INSPIRATION_BREADCRUMBS } from "../constants";
import { AdviceCard } from "./AdviceCard";

export default function InspirationFeature() {
	const [adviceCards, setAdviceCards] = useState<ContentItem[]>([]);
	const [inspirationCards, setInspirationCards] = useState<ContentItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [adviceError, setAdviceError] = useState<string | null>(null);
	const [inspirationError, setInspirationError] = useState<string | null>(null);
	const requestVersionRef = useRef(0);

	const loadData = useCallback(() => {
		const requestVersion = ++requestVersionRef.current;
		setLoading(true);
		setAdviceError(null);
		setInspirationError(null);

		void Promise.allSettled([
			getContentListAPIAction({ content_type: "advice", page_size: 50 }),
			getContentListAPIAction({ content_type: "inspiration", page_size: 50 }),
		]).then(([adviceSettled, inspirationSettled]) => {
			if (requestVersion !== requestVersionRef.current) return;

			if (
				adviceSettled.status === "fulfilled" &&
				adviceSettled.value.success &&
				adviceSettled.value.data
			) {
				setAdviceCards(adviceSettled.value.data.items);
				setAdviceError(null);
			} else {
				const err =
					adviceSettled.status === "fulfilled"
						? adviceSettled.value.error
						: null;
				setAdviceError(err || "Failed to load content");
			}

			if (
				inspirationSettled.status === "fulfilled" &&
				inspirationSettled.value.success &&
				inspirationSettled.value.data
			) {
				setInspirationCards(inspirationSettled.value.data.items);
				setInspirationError(null);
			} else {
				const err =
					inspirationSettled.status === "fulfilled"
						? inspirationSettled.value.error
						: null;
				setInspirationError(err || "Failed to load content");
			}

			setLoading(false);
		});
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

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
					<div className="pl-[14px] pb-6 pt-[2px]" aria-busy={loading}>
						<div className="grid grid-cols-1 justify-items-start gap-x-[14px] gap-y-[14px] lg:grid-cols-2 xl:grid-cols-3 mr-[160px]">
							{loading && adviceCards.length === 0 && (
								<p className="text-sm text-gray-500 col-span-full pl-1">
									<Translate text={localizationConstants.inspirationLoading} />
								</p>
							)}
							{!loading &&
								adviceCards.map((card) => (
									<AdviceCard key={card.id} card={card} />
								))}
							{!loading && adviceError && (
								<div className="col-span-full pl-1 flex items-center gap-2">
									<p className="text-sm text-gray-500">
										<Translate
											text={localizationConstants.inspirationErrorLoading}
										/>
									</p>
									<button
										type="button"
										onClick={loadData}
										className="text-sm text-slate-900 underline hover:text-slate-700 font-medium"
									>
										<Translate text={localizationConstants.inspirationRetry} />
									</button>
								</div>
							)}
							{!loading && !adviceError && adviceCards.length === 0 && (
								<p className="text-sm text-gray-500 col-span-full pl-1">
									<Translate
										text={localizationConstants.inspirationNoContent}
									/>
								</p>
							)}
						</div>
					</div>
				</TabsContent>

				<TabsContent value="inspiration" className="mt-0">
					<div className="pl-[14px] pb-6 pt-[2px]" aria-busy={loading}>
						<div className="grid grid-cols-1 justify-items-start gap-x-[14px] gap-y-[14px] lg:grid-cols-2 xl:grid-cols-3 mr-[160px]">
							{loading && inspirationCards.length === 0 && (
								<p className="text-sm text-gray-500 col-span-full pl-1">
									<Translate text={localizationConstants.inspirationLoading} />
								</p>
							)}
							{!loading &&
								inspirationCards.map((card) => (
									<AdviceCard key={card.id} card={card} />
								))}
							{!loading && inspirationError && (
								<div className="col-span-full pl-1 flex items-center gap-2">
									<p className="text-sm text-gray-500">
										<Translate
											text={localizationConstants.inspirationErrorLoading}
										/>
									</p>
									<button
										type="button"
										onClick={loadData}
										className="text-sm text-slate-900 underline hover:text-slate-700 font-medium"
									>
										<Translate text={localizationConstants.inspirationRetry} />
									</button>
								</div>
							)}
							{!loading &&
								!inspirationError &&
								inspirationCards.length === 0 && (
									<p className="text-sm text-gray-500 col-span-full pl-1">
										<Translate
											text={localizationConstants.inspirationNoContent}
										/>
									</p>
								)}
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
