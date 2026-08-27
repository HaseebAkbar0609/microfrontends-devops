import { Bot, Leaf, Zap } from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetAction,
	WidgetActions,
	WidgetBarRow,
	WidgetChip,
	WidgetChips,
	WidgetContent as Content,
	WidgetListItem,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
	WidgetTag,
} from "@/features/widgetdashboard/components/WidgetContent";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

/** Latest activities, the AI assistant and sustainability. */
export const PURCHASE_INSIGHT_WIDGETS: Record<string, WidgetProps> = {
	purchaseActivity: {
		title: localizationConstants.purchaseWidgetActivityTitle,
		icon: Zap,
		content: (
			<Content>
				<WidgetListItem
					title={
						localizationConstants.purchaseWidgetActivityApproved
					}
					meta="10:15"
				/>
				<WidgetListItem
					title={
						localizationConstants.purchaseWidgetActivityDelivery
					}
					meta="09:30"
				/>
				<WidgetListItem
					title={localizationConstants.purchaseWidgetActivityInvoice}
					meta="08:45"
				/>
				<WidgetListItem
					title={localizationConstants.purchaseWidgetActivitySent}
					meta={
						<>
							<Translate
								text={
									localizationConstants.purchaseWidgetActivityYesterday
								}
							/>
							{" 16:00"}
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.purchaseWidgetActivityQuote}
					meta={
						<>
							<Translate
								text={
									localizationConstants.purchaseWidgetActivityYesterday
								}
							/>
							{" 14:20"}
						</>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	purchaseAiAssistant: {
		title: localizationConstants.purchaseWidgetAiTitle,
		icon: Bot,
		content: (
			<Content>
				<div className="flex flex-col items-start gap-1.5">
					<WidgetTag
						label={
							localizationConstants.purchaseWidgetAiTagSuggestion
						}
						color="bg-blue-100 text-blue-700"
					/>
					<p>
						<Translate
							text={
								localizationConstants.purchaseWidgetAiSuggestion
							}
						/>
					</p>
					<WidgetTag
						label={
							localizationConstants.purchaseWidgetAiTagWarning
						}
						color="bg-red-100 text-red-700"
					/>
					<p>
						<Translate
							text={
								localizationConstants.purchaseWidgetAiWarning
							}
						/>
					</p>
					<WidgetTag
						label={
							localizationConstants.purchaseWidgetAiTagRecommendation
						}
						color="bg-amber-100 text-amber-700"
					/>
					<p>
						<Translate
							text={
								localizationConstants.purchaseWidgetAiRecommendation
							}
						/>
					</p>
				</div>
				<WidgetChips>
					<WidgetChip
						label={
							localizationConstants.purchaseWidgetAiPromptOverdue
						}
					/>
					<WidgetChip
						label={
							localizationConstants.purchaseWidgetAiPromptCosts
						}
					/>
					<WidgetChip
						label={
							localizationConstants.purchaseWidgetAiPromptSuppliers
						}
					/>
				</WidgetChips>
				<Row
					label={localizationConstants.purchaseWidgetAiStatus}
					value={
						<Translate
							text={
								localizationConstants.purchaseWidgetAiStatusActive
							}
						/>
					}
				/>
				<Row
					label={localizationConstants.purchaseWidgetAiLastAnalyzed}
					value={
						<>
							<Translate
								text={
									localizationConstants.purchaseWidgetAiToday
								}
							/>
							{" 08:00"}
						</>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	purchaseEnvironment: {
		title: localizationConstants.purchaseWidgetEnvTitle,
		icon: Leaf,
		content: (
			<Content>
				<Row
					label={localizationConstants.purchaseWidgetEnvCo2}
					value="4,2 t"
				/>
				<Row
					label={localizationConstants.purchaseWidgetEnvVsLastMonth}
					value="↓ -6 %"
				/>
				<WidgetBarRow
					label={localizationConstants.purchaseWidgetEnvCertified}
					percent={58}
					value="7 / 12 - 58 %"
					color="bg-green-500"
				/>
				<WidgetBarRow
					label={
						localizationConstants.purchaseWidgetEnvSustainableShare
					}
					percent={34}
					value="34 %"
					color="bg-green-500"
				/>
				<p className="text-xs text-slate-400">
					<Translate
						text={localizationConstants.purchaseWidgetEnvTarget}
					/>
				</p>
				<Row
					label={localizationConstants.purchaseWidgetEnvActions}
					value="1"
				/>
				<p className="text-xs text-slate-400">
					<Translate
						text={
							localizationConstants.purchaseWidgetEnvActionValue
						}
					/>
				</p>
				<WidgetActions>
					<WidgetAction
						label={localizationConstants.purchaseCtaViewReport}
						variant="secondary"
					/>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},
};
