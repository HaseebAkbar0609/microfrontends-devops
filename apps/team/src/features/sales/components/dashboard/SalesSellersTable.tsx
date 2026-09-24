"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { SellerStats } from "../../utils/salesDashboard";
import { formatCurrency } from "../../utils/salesFormatters";
import { SalesDashboardCard, SalesDashboardEmpty } from "./SalesDashboardCard";

const HEAD_CLASS = "h-11 text-xs font-medium uppercase tracking-wide text-slate-500";
const NUMBER_CLASS = "text-right tabular-nums";

const NUMBER_COLUMNS = [
	localizationConstants.salesDashboardColumnMeetings,
	localizationConstants.salesDashboardColumnQuotes,
	localizationConstants.salesDashboardColumnDeals,
];

/** Per-seller totals across the whole CRM, highest invoiced first. */
export function SalesSellersTable({ sellers }: { sellers: SellerStats[] }) {
	return (
		<SalesDashboardCard titleKey={localizationConstants.salesDashboardSellersTitle}>
			{sellers.length === 0 ? (
				<SalesDashboardEmpty textKey={localizationConstants.salesDashboardSellersEmpty} />
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className={`${HEAD_CLASS} px-5`}>
								<Translate text={localizationConstants.salesColumnSeller} />
							</TableHead>
							{NUMBER_COLUMNS.map((labelKey) => (
								<TableHead key={labelKey} className={`${HEAD_CLASS} ${NUMBER_CLASS}`}>
									<Translate text={labelKey} />
								</TableHead>
							))}
							<TableHead className={`${HEAD_CLASS} ${NUMBER_CLASS} px-5`}>
								<Translate text={localizationConstants.salesDashboardColumnInvoiced} />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sellers.map((seller, index) => (
							<TableRow key={seller.name}>
								<TableCell className="px-5 py-3 font-medium text-slate-900">
									<span className="mr-2 text-slate-400">{index + 1}.</span>
									{seller.name}
								</TableCell>
								<TableCell className={NUMBER_CLASS}>{seller.meetings}</TableCell>
								<TableCell className={NUMBER_CLASS}>{seller.quotes}</TableCell>
								<TableCell className={NUMBER_CLASS}>{seller.deals}</TableCell>
								<TableCell className={`${NUMBER_CLASS} px-5`}>
									{formatCurrency(seller.invoiced)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</SalesDashboardCard>
	);
}
