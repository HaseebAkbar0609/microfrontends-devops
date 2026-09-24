"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

const ALL_SELLERS = "all";

type SellerFilterBarProps = {
	sellers: string[];
	seller: string;
	onSellerChange: (value: string) => void;
};

/** Whose pipeline is on screen, and whether to narrow it to trial accounts. */
export function SellerFilterBar({
	sellers,
	seller,
	onSellerChange,
}: SellerFilterBarProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-2xs">
			<div className="flex flex-wrap items-center gap-3">
				<span className="text-sm font-medium text-slate-700">
					<Translate text={localizationConstants.salesColumnSeller} />
				</span>
				<Select
					value={seller || ALL_SELLERS}
					onValueChange={(value) =>
						onSellerChange(value === ALL_SELLERS ? "" : value)
					}
				>
					<SelectTrigger className="h-10 w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL_SELLERS}>
							{t(localizationConstants.salesCrmSellerFilterAll)}
						</SelectItem>
						{sellers.map((name) => (
							<SelectItem key={name} value={name}>
								{name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<p className="text-sm text-slate-500">
					<Translate
						text={
							seller
								? localizationConstants.salesCrmPipelineSellerHint
								: localizationConstants.salesCrmPipelineAllHint
						}
					/>
				</p>
			</div>

		</div>
	);
}
