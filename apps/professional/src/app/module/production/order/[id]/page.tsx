import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";

interface OrderDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
	const { id } = await params;

	return (
		<div className="flex flex-1 flex-col bg-slate-50">
			<PageHeader
				title={`Order ${id}`}
				breadcrumbs={[
					{ label: localizationConstants.home, href: "/dashboard" },
					{ label: localizationConstants.production },
					{ label: localizationConstants.orderModule, href: "/module/production/order" },
					{ label: `Order ${id}` },
				]}
			/>
			<div className="p-6">
				<h2 className="text-xl font-semibold text-slate-800">Order {id}</h2>
				<p className="mt-2 text-sm text-slate-600">Order Information & Details</p>
			</div>
		</div>
	);
}
