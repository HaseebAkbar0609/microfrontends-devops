"use client";

import { Clock2, Inbox } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { HomeWidgetBody } from "../../types";

const WidgetContent = ({ body }: { body: HomeWidgetBody }) => {
	if (body.kind === "lines") {
		return (
			<ul className="space-y-1 text-sm text-slate-500">
				{body.lines.map((line) => (
					<li key={line}>
						<Translate text={line} />
					</li>
				))}
			</ul>
		);
	}

	if (body.kind === "news") {
		return (
			<div className="space-y-3">
				{body.items.map((item, index) => (
					<article key={item.id} className="space-y-1.5">
						<h4 className="text-sm font-semibold text-slate-900">
							<Translate text={item.titleKey} />
						</h4>
						<p className="flex items-center gap-1 text-xs text-slate-500">
							<Clock2 size={14} aria-hidden />
							<Translate text={item.dateKey} />
						</p>
						<p className="text-xs leading-relaxed text-slate-600">
							<Translate text={item.bodyKey} />
						</p>
						{index < body.items.length - 1 && (
							<div className="h-px w-full bg-slate-200" />
						)}
					</article>
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center rounded border border-dashed border-slate-200 bg-white/60 px-3 py-5 text-center">
			<div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-200/70 text-slate-500">
				<Inbox size={18} aria-hidden />
			</div>
			<p className="text-xs font-semibold text-slate-800">
				<Translate text={localizationConstants.widgetBoardEmptyTitle} />
			</p>
			<p className="mt-0.5 max-w-[200px] text-[11px] text-slate-500">
				<Translate text={localizationConstants.widgetBoardEmptyBody} />
			</p>
		</div>
	);
};

export default WidgetContent;
