"use client";

import { MapPin, Map, BadgeDollarSign } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderOpenedData } from "../types/orderOpened.types";

export interface OrderOpenedHeroProps {
	data: OrderOpenedData;
}

export function OrderOpenedHero({ data }: OrderOpenedHeroProps) {
	return (
		<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-2xs h-auto md:h-[120px] box-border">
			{/* Left Column: Title, Direct Badge, Date, Location Tags */}
			<div className="flex flex-col gap-2 justify-center">
				<div className="flex items-center gap-3 flex-wrap">
					<h1 className="font-sans font-semibold text-lg leading-7 tracking-normal text-slate-900">
						{data.titleKey ? (
							<Translate text={data.titleKey} />
						) : (
							data.title
						)}
					</h1>
					{data.isDirect && (
						<span className="inline-flex items-center rounded-md bg-transparent px-2 py-0.5 text-[12px] leading-[16px] font-medium text-slate-700 border border-slate-300">
							<Translate text={localizationConstants.directBadge} />
						</span>
					)}
				</div>

				<p className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-500">
					<Translate text={localizationConstants.postedDateLabel} /> {data.postedDate}
				</p>

				{/* Location tags: Stockholm gets Map icon with emerald theme, Järfälla gets MapPin icon with warning amber theme */}
				<div className="flex items-center gap-2 pt-0.5 flex-wrap">
					{data.tags.map((tag, idx) => {
						const tagKey = data.tagKeys?.[idx];
						const isStockholm = idx === 0 || tag.toLowerCase().includes("stockholm");
						return (
							<span
								key={tag}
								className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-sans font-medium text-[12px] leading-[16px] tracking-normal text-center ring-1 ring-inset ${
									isStockholm
										? "bg-emerald-50 text-emerald-800 ring-emerald-600/20"
										: "bg-amber-50 text-amber-800 ring-amber-600/20"
								}`}
							>
								{isStockholm ? (
									<Map className="h-3.5 w-3.5 text-emerald-600" />
								) : (
									<MapPin className="h-3.5 w-3.5 text-amber-600" />
								)}
								<span>{tagKey ? <Translate text={tagKey} /> : tag}</span>
							</span>
						);
					})}
				</div>
			</div>

			{/* Right Column: Dark Slate Budget Widget (h-[88px], icon color same as text, text & number start at same left position, extra spacing) */}
			<div className="w-full md:w-auto min-w-[260px] h-[88px] rounded-xl bg-[#111721] px-6 py-4 text-white shadow-md flex items-start gap-3.5 box-border">
				<BadgeDollarSign className="h-6 w-6 text-slate-300 shrink-0 mt-0.5" strokeWidth={1.75} />
				<div className="flex flex-col justify-center gap-0.5">
					<span className="font-sans font-normal text-base leading-6 tracking-normal text-slate-300">
						<Translate text={localizationConstants.budgetLabel} />
					</span>
					<span className="font-sans font-semibold text-xl leading-7 tracking-normal text-white">
						{data.budgetAmount.toLocaleString("sv-SE")}
					</span>
				</div>
			</div>
		</div>
	);
}
