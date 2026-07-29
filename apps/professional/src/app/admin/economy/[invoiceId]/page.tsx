import Link from "next/link";
import InvoicePreview from "@/features/admin/economy/components/InvoicePreview";
import { getEconomyInvoiceById } from "@/features/admin/economy/constants/mockData";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export default async function Page({
	params,
}: {
	params: Promise<{ invoiceId: string }>;
}) {
	const { invoiceId } = await params;
	const invoice = getEconomyInvoiceById(invoiceId);

	if (!invoice) {
		return (
			<div className="flex flex-col items-center gap-3 p-10 text-center">
				<p className="text-sm text-slate-600">
					<Translate
						text={localizationConstants.invoicePreviewNotFound}
					/>
				</p>
				<Link
					href="/admin/economy"
					className="text-sm font-medium text-slate-900 underline"
				>
					<Translate text={localizationConstants.invoicePreviewBack} />
				</Link>
			</div>
		);
	}

	return <InvoicePreview invoice={invoice} />;
}
