import { CircleCheck, Coins, ShoppingCart } from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetAction,
	WidgetActions,
	WidgetBarRow,
	WidgetChip,
	WidgetChips,
	WidgetContent as Content,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
	WidgetSparkBars,
} from "@/features/widgetdashboard/components/WidgetContent";
import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

/** Purchasing overview, purchasing value and delivery control. */
export const PURCHASE_OVERVIEW_WIDGETS: Record<string, WidgetProps> = {
	purchaseOverview: {
		title: localizationConstants.purchaseWidgetOverviewTitle,
		icon: ShoppingCart,
		content: (
			<Content>
				<Row
					label={localizationConstants.purchaseWidgetOverviewActive}
					value="34"
				/>
				<Row
					label={localizationConstants.purchaseWidgetOverviewPending}
					value="8"
				/>
				<Row
					label={
						localizationConstants.purchaseWidgetOverviewCompleted
					}
					value="21"
				/>
				<Row
					label={
						localizationConstants.purchaseWidgetOverviewCancelled
					}
					value="2"
				/>
				<Row
					label={localizationConstants.purchaseWidgetOverviewValue}
					value="1 850 000 SEK"
				/>
				<WidgetActions>
					<WidgetAction
						label={localizationConstants.purchaseCtaViewOrders}
					/>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	purchaseValue: {
		title: localizationConstants.purchaseWidgetValueTitle,
		icon: Coins,
		content: (
			<Content>
				<Row
					label={localizationConstants.purchaseWidgetValueYtd}
					value="12 400 000 SEK"
				/>
				<WidgetBarRow
					label={localizationConstants.purchaseWidgetValueBudget}
					percent={68}
					value="68 % - 8 432 000 SEK"
					color="bg-blue-600"
				/>
				<p className="text-xs text-slate-400">
					<Translate
						text={
							localizationConstants.purchaseWidgetValueCategories
						}
					/>
				</p>
				<WidgetChips>
					<WidgetChip
						label={
							localizationConstants.purchaseWidgetValueCatMaterials
						}
						active
					/>
					<WidgetChip
						label={
							localizationConstants.purchaseWidgetValueCatEquipment
						}
					/>
					<WidgetChip
						label={
							localizationConstants.purchaseWidgetValueCatServices
						}
					/>
					<WidgetChip
						label={
							localizationConstants.purchaseWidgetValueCatOther
						}
					/>
				</WidgetChips>
				<p className="text-xs text-slate-400">
					<Translate
						text={localizationConstants.purchaseWidgetValueTrend}
					/>
				</p>
				<WidgetSparkBars
					values={[38, 42, 35, 51, 47, 58, 54, 62]}
					color="bg-blue-600"
				/>
				<Row
					label={localizationConstants.purchaseWidgetValueChange}
					value="+5 %"
				/>
				<MockTag />
			</Content>
		),
	},

	purchaseDeliveryControl: {
		title: localizationConstants.purchaseWidgetControlTitle,
		icon: CircleCheck,
		content: (
			<Content>
				<Row
					label={localizationConstants.purchaseWidgetControlChecked}
					value="18"
				/>
				<Row
					label={localizationConstants.purchaseWidgetControlApproved}
					value="15"
				/>
				<Row
					label={localizationConstants.purchaseWidgetControlRemarks}
					value="2"
				/>
				<Row
					label={localizationConstants.purchaseWidgetControlRejected}
					value="1"
				/>
				<Row
					label={localizationConstants.purchaseWidgetControlLatest}
					value={mockDate(1)}
				/>
				<p className="text-xs text-slate-400">
					<Translate
						text={
							localizationConstants.purchaseWidgetControlLatestValue
						}
					/>
				</p>
				<Row
					label={localizationConstants.purchaseWidgetControlNext}
					value={mockDate(9)}
				/>
				<MockTag />
			</Content>
		),
	},
};
