"use client";

import { useId } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { AtaSummaryBox } from "../../list/AtaSummaryBox";
import { SUPPLIER_SELECT_ALL } from "../supplierAta.config";
import type { AtaSupplier } from "../types";

export interface SupplierSelectBarProps {
	suppliers: AtaSupplier[];
	/** `null` for Alla. */
	selectedId: string | null;
	onSelect: (supplierId: string | null) => void;
	summary: { total: number; count: number };
}

/** "Vald leverantör/ UE", a divider, and the Totalt ÄTA / Antal Äta box — as the frames draw them. */
export function SupplierSelectBar({ suppliers, selectedId, onSelect, summary }: SupplierSelectBarProps) {
	const labelId = useId();

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-8">
			<div className="flex flex-col gap-2 sm:w-52">
				<span id={labelId} className="text-sm font-medium text-slate-900">
					<Translate text={localizationConstants.ataSupplierSelectedSupplierLabel} />
				</span>
				<Select
					value={selectedId ?? SUPPLIER_SELECT_ALL}
					onValueChange={(value) => onSelect(value === SUPPLIER_SELECT_ALL ? null : value)}
				>
					<SelectTrigger aria-labelledby={labelId} className="h-10 w-full cursor-pointer bg-white">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={SUPPLIER_SELECT_ALL}>
							<Translate text={localizationConstants.ataFilterAll} />
						</SelectItem>
						{suppliers.map((supplier) => (
							<SelectItem key={supplier.id} value={supplier.id}>
								{supplier.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div aria-hidden className="hidden w-px bg-slate-200 sm:block" />
			<AtaSummaryBox total={summary.total} count={summary.count} />
		</div>
	);
}

export default SupplierSelectBar;
