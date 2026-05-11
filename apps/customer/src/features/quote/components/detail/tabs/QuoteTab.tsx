import { TabsContent } from "@/components/ui/tabs";
import { OfferDetailsCard } from "../OfferDetailsCard";
import { SpecificationTable } from "../SpecificationTable";
import { QuoteItemsTable } from "../QuoteItemsTable";
import { DUMMY_DOCUMENTS, DUMMY_QUOTE_ITEMS } from "../../../constants";

export function QuoteTab() {
	return (
		<TabsContent
			value="quote"
			className="mt-0 space-y-8 animate-in fade-in duration-300"
		>
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
				<div className="lg:col-span-3">
					<OfferDetailsCard
						company="Pelle Construction"
						orgNo="58858357375"
						address="Storgatan 11B"
						postalNo="171 63"
						contactPerson="Peter Svensson"
						mobile="070888888"
						email="pelle@hotmail.com"
					/>
				</div>
				<div className="lg:col-span-2">
					<SpecificationTable
						documents={DUMMY_DOCUMENTS}
					/>
				</div>
			</div>

			<QuoteItemsTable
				items={DUMMY_QUOTE_ITEMS}
				quoteTotal="1,250,000 SEK"
				vat="75,000 SEK"
				rotDeduction={true}
				finalTotal="1,325,000 SEK"
			/>
		</TabsContent>
	);
}
