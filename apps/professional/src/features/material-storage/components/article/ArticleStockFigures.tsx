"use client";

import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import type { MaterialStockRow, MaterialUnit } from "../../types/materialStorage.types";

interface ArticleStockFiguresProps {
	/** The article in the depot the overview shows; undefined when that depot does not carry it. */
	stock: MaterialStockRow | undefined;
	unit: MaterialUnit;
}

/** I lager | Reserverat | Tillgängligt | Lagervärde for the chosen depot, coloured as in Figma. */
export function ArticleStockFigures({ stock, unit }: ArticleStockFiguresProps) {
	const { formatQuantity, formatAmount } = useMaterialFormatters();
	const figures: [TranslationKeys, string, string][] = [
		[localizationConstants.materialColInStock, formatQuantity(stock?.inStock ?? 0, unit), "text-green-700"],
		[localizationConstants.materialColReserved, formatQuantity(stock?.reserved ?? 0, unit), "text-blue-600"],
		[localizationConstants.materialColAvailable, formatQuantity(stock?.available ?? 0, unit), "text-slate-900"],
		[localizationConstants.materialColStockValue, formatAmount(stock?.stockValue ?? 0), "text-blue-600"],
	];

	return (
		// Each figure takes the room its value needs and they share the rest: equal quarters are too
		// narrow for "SEK 27,200" next to "40 pcs". Two by two on phones.
		<dl className="grid grid-cols-2 gap-y-3 rounded-lg border border-slate-200 bg-white py-3 text-center sm:flex sm:divide-x sm:divide-slate-200">
			{figures.map(([label, value, tone]) => (
				<div key={label} className="px-2 sm:flex-auto">
					<dt className="text-xs text-slate-600">
						<Translate text={label} />
					</dt>
					<dd className={cn("mt-1 text-xl font-semibold whitespace-nowrap tabular-nums", tone)}>{value}</dd>
				</div>
			))}
		</dl>
	);
}
