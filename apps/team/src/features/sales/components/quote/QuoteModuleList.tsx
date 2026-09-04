"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	QUOTE_UNIT_IDS,
	QUOTE_UNIT_SHORT_LABEL_KEYS,
} from "../../constants/quoteModules";
import type { QuoteModuleRow, QuotePriceUnit } from "../../types";
import { SalesSectionCard } from "../SalesSectionCard";

type QuoteModuleListProps = {
	modules: QuoteModuleRow[];
	onUpdate: (moduleId: string, patch: Partial<QuoteModuleRow>) => void;
	onAdd: () => void;
	onRemove: (moduleId: string) => void;
};

export function QuoteModuleList({
	modules,
	onUpdate,
	onAdd,
	onRemove,
}: QuoteModuleListProps) {
	const t = useTranslate();

	return (
		<SalesSectionCard
			titleKey={localizationConstants.salesQuoteModulesSectionTitle}
			action={
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="cursor-pointer gap-1.5"
					onClick={onAdd}
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.salesQuoteAddModuleButton} />
				</Button>
			}
		>
			<p className="-mt-2 mb-3 text-sm text-slate-500">
				<Translate text={localizationConstants.salesQuoteModulesHint} />
			</p>

			<div className="space-y-2">
				{modules.map((module) => (
					<div
						key={module.id}
						className={`rounded-lg border p-3 transition-colors ${
							module.selected
								? "border-slate-900/30 bg-slate-50"
								: "border-slate-200 bg-white"
						}`}
					>
						<div className="flex flex-col gap-3 lg:flex-row lg:items-start">
							<Checkbox
								className="mt-1 cursor-pointer"
								checked={module.selected}
								aria-label={`${t(localizationConstants.salesQuoteSelectModuleLabel)} ${module.name}`}
								onCheckedChange={(checked) =>
									onUpdate(module.id, { selected: Boolean(checked) })
								}
							/>

							<div className="min-w-0 flex-1">
								<Input
									value={module.name}
									aria-label={t(localizationConstants.salesQuoteColFeature)}
									onChange={(event) =>
										onUpdate(module.id, { name: event.target.value })
									}
									className="h-8 border-transparent bg-transparent px-1 text-sm font-medium shadow-none focus-visible:border-input"
								/>
								<Textarea
									value={module.description}
									rows={2}
									aria-label={module.name}
									onChange={(event) =>
										onUpdate(module.id, { description: event.target.value })
									}
									className="min-h-14 resize-y border-transparent bg-transparent px-1 py-1 text-xs text-slate-500 shadow-none focus-visible:border-input"
								/>
							</div>

							<div className="flex flex-wrap items-center gap-2">
								<Input
									type="number"
									min={0}
									value={module.price}
									aria-label={t(localizationConstants.salesQuotePriceLabel)}
									onChange={(event) =>
										onUpdate(module.id, {
											price: Math.max(0, Number(event.target.value) || 0),
										})
									}
									className="h-8 w-24 text-right text-sm"
								/>

								<Select
									value={module.unit}
									onValueChange={(value) =>
										onUpdate(module.id, { unit: value as QuotePriceUnit })
									}
								>
									<SelectTrigger
										aria-label={t(
											localizationConstants.salesQuotePriceUnitLabel,
										)}
										className="h-8 w-33 text-xs"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{QUOTE_UNIT_IDS.map((unit) => (
											<SelectItem key={unit} value={unit}>
												<Translate text={QUOTE_UNIT_SHORT_LABEL_KEYS[unit]} />
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								{module.quantityEditable ? (
									<Input
										type="number"
										min={0}
										value={module.quantity}
										aria-label={t(localizationConstants.salesQuoteQuantityLabel)}
										onChange={(event) =>
											onUpdate(module.id, {
												quantity: Math.max(0, Number(event.target.value) || 0),
											})
										}
										className="h-8 w-20 text-right text-sm"
									/>
								) : (
									<span className="flex h-8 w-20 items-center justify-end text-sm text-slate-500">
										<Translate
											text={localizationConstants.salesQuoteSingleUnitLabel}
										/>
									</span>
								)}

								<Button
									type="button"
									variant="ghost"
									size="icon"
									aria-label={`${t(localizationConstants.salesQuoteRemoveModuleLabel)} ${module.name}`}
									className="h-8 w-8 cursor-pointer text-slate-500"
									onClick={() => onRemove(module.id)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		</SalesSectionCard>
	);
}
