import React from "react";
import {
	Bot,
	Clock,
} from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetActions,
	WidgetBarRow,
	WidgetContent as Content,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { DesignModalType } from "../components/DesignDashboardModals";

export const getDesignTimeWidgets = (
	onOpenModal: (type: DesignModalType, prompt?: string) => void,
): Record<string, WidgetProps> => ({
	// 4. Design Time
	designTime: {
		title: localizationConstants.designWidgetTimeTitle,
		icon: Clock,
		content: (
			<Content>
				<div className="flex items-baseline justify-between gap-3">
					<span className="text-slate-600 font-medium">
						<Translate text={localizationConstants.designWidgetTimeWeekTotal} />
					</span>
					<span className="text-base font-bold text-slate-900">32 h</span>
				</div>

				<WidgetBarRow
					label={localizationConstants.designWidgetTimeBillable}
					percent={87}
					value={<Translate text="28 h" />}
					color="bg-emerald-500"
				/>
				<WidgetBarRow
					label={localizationConstants.designWidgetTimeNonBillable}
					percent={13}
					value={<Translate text="4 h" />}
					color="bg-slate-400"
				/>

				<Row
					label={localizationConstants.designWidgetTimeBudget}
					value="160 h"
				/>
				<Row
					label={localizationConstants.designWidgetTimeUsed}
					value="118 h"
				/>

				<WidgetActions>
					<button
						type="button"
						onClick={() => onOpenModal("time")}
						className="cursor-pointer rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors shadow-2xs"
					>
						<Translate text={localizationConstants.designWidgetTimeLogCta} />
					</button>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	// 5. AI Design Assistant
	designAiAssistant: {
		title: localizationConstants.designWidgetAiTitle,
		icon: Bot,
		content: (
			<Content>
				<div className="rounded-lg bg-indigo-50/70 border border-indigo-100 p-2.5 flex flex-col gap-1.5">
					<div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900">
						<Bot className="h-3.5 w-3.5 text-indigo-600" />
						<span>
							<Translate text={localizationConstants.designWidgetAiInsightsHeader} />
						</span>
					</div>
					<p className="text-xs text-indigo-950 leading-relaxed">
						<Translate text={localizationConstants.designWidgetAiInsight1} />
					</p>
					<p className="text-[11px] text-indigo-800">
						<Translate text={localizationConstants.designWidgetAiInsight2} />
					</p>
				</div>

				<p className="text-xs text-slate-400 pt-1">
					<Translate text={localizationConstants.designWidgetAiInsightsHeader} />:
				</p>
				<div className="flex flex-wrap gap-1.5">
					<button
						type="button"
						onClick={() => onOpenModal("ai", "Vilka ritningar behöver uppdateras?")}
						className="cursor-pointer rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-zinc-800 transition-colors"
					>
						<Translate text={localizationConstants.designWidgetAiQuestion1} />
					</button>
					<button
						type="button"
						onClick={() => onOpenModal("ai", "Visa revisionsstatus")}
						className="cursor-pointer rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
					>
						<Translate text={localizationConstants.designWidgetAiQuestion2} />
					</button>
				</div>

				<WidgetActions>
					<button
						type="button"
						onClick={() => onOpenModal("ai")}
						className="cursor-pointer rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors shadow-2xs"
					>
						<Translate text={localizationConstants.designWidgetAiOpenCta} />
					</button>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},
});
