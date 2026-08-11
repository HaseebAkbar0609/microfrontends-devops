import { PageHeader } from "@/components/layout/PageHeader";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export default function OrderCreatePage() {
	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			{/* Page Header with Breadcrumbs */}
			<PageHeader
				title={localizationConstants.createOrderButton}
				breadcrumbs={[
					{ label: localizationConstants.home, href: "/dashboard" },
					{ label: localizationConstants.moduleItem, href: "/module/business" },
					{ label: localizationConstants.production, href: "/module/production" },
					{ label: localizationConstants.orderModule, href: "/module/production/order/overview" },
					{ label: localizationConstants.createOrderButton },
				]}
			/>

			{/* Content Area with Coming Soon Message at Top Left */}
			<div className="flex flex-1 flex-col px-6 pt-4 pb-8 text-left">
				<p className="text-sm font-medium text-slate-600">
					<Translate text={localizationConstants.comingSoon} />
				</p>
			</div>
		</div>
	);
}
