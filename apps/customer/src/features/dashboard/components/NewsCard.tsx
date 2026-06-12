import { Newspaper } from "lucide-react";

import { Card } from "@/components/ui/card";
import { DASHBOARD_NEWS } from "@/features/dashboard/constants/dashboard";

import { DashboardNewsItemCard } from "./DashboardNewsItem";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function NewsCard() {
	return (
		<Card className="flex w-full flex-col overflow-hidden bg-white border p-6">
			{/* Card Header */}
			<div className="flex items-center gap-2.5 border-slate-200">
				<Newspaper
					className="h-6 w-6 flex-shrink-0"
					style={{ color: "var(--ui-text-primary)" }}
				/>
				<h2
					className="text-2xl font-semibold"
					style={{ color: "var(--ui-text-primary)" }}
				>
					<Translate text={localizationConstants.noticeAndNews} />
				</h2>
			</div>

			{/* News Items */}
			<div className="flex flex-col pt-4">
				{DASHBOARD_NEWS.length > 0 ? (
					DASHBOARD_NEWS.map((item, index) => (
						<div key={item.id}>
							<div className="py-3">
								<DashboardNewsItemCard item={item} />
							</div>
							{index < DASHBOARD_NEWS.length - 1 && (
								<div className="h-px w-full bg-slate-200" />
							)}
						</div>
					))
				) : (
					<p className="py-3 text-sm text-slate-500">
						<Translate text={localizationConstants.noNewsAvailable} />
					</p>
				)}
			</div>
		</Card>
	);
}
