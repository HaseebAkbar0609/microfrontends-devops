"use client";

import { Clock2, Newspaper } from "lucide-react";
import { Translate } from "@/utils/translation/translate";

interface DashboardNewsItem {
	id: string;
	title: string;
	date: string;
	body: string;
}

interface DashboardNewsCardProps {
	title: string;
	items: DashboardNewsItem[];
}

export default function DashboardNewsCard({
	title,
	items,
}: DashboardNewsCardProps) {
	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.06)]">
			<div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
				<div className="flex items-center justify-center ">
					<Newspaper size={20} className="text-slate-600" />
				</div>
				<Translate text={title} />
			</div>
			<div className="mt-4 space-y-4 text-sm text-slate-700">
				{items.map((item, index) => (
					<div key={item.id} className="space-y-2">
						<div className="font-semibold text-slate-900">
							<Translate text={item.title} />
						</div>
						<div className="text-xs text-slate-500 flex  items-center gap-1">
							<Clock2 size={14}/> <Translate text={item.date} />
						</div>
						<div className="text-xs text-slate-600 leading-relaxed">
							<Translate text={item.body} />
						</div>
						{index < items.length - 1 && (
							<div className="h-px w-full bg-slate-200" />
						)}
					</div>
				))}
			</div>
		</div>
	);
}
