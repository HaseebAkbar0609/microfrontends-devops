"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { QUOTE_TERMS } from "../../constants/quoteModules";
import type { QuoteTermId } from "../../types";
import type { QuoteDraft } from "../../utils/quoteDraft";
import { SalesSectionCard } from "../SalesSectionCard";

type QuoteTermsSectionProps = {
	draft: QuoteDraft;
	onChange: (patch: Partial<QuoteDraft>) => void;
	onExtraDiscountChange: (value: number) => void;
};

export function QuoteTermsSection({
	draft,
	onChange,
	onExtraDiscountChange,
}: QuoteTermsSectionProps) {
	const t = useTranslate();

	return (
		<SalesSectionCard
			titleKey={localizationConstants.salesQuoteTermsSectionTitle}
		>
			<div className="grid gap-4 @2xl:grid-cols-3">
				<div className="space-y-1.5">
					<Label htmlFor="quote-users">
						<Translate text={localizationConstants.salesQuoteUsersLabel} />
					</Label>
					<Input
						id="quote-users"
						type="number"
						min={1}
						value={draft.users}
						onChange={(event) =>
							onChange({
								users: Math.max(1, Number(event.target.value) || 1),
							})
						}
					/>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="quote-extra-discount">
						<Translate
							text={localizationConstants.salesQuoteExtraDiscountLabel}
						/>
					</Label>
					<Input
						id="quote-extra-discount"
						type="number"
						min={0}
						max={100}
						value={draft.extraDiscountPercent}
						onChange={(event) =>
							onExtraDiscountChange(Number(event.target.value) || 0)
						}
					/>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="quote-valid-days">
						<Translate text={localizationConstants.salesQuoteValidDaysLabel} />
					</Label>
					<Input
						id="quote-valid-days"
						type="number"
						min={1}
						value={draft.validDays}
						onChange={(event) =>
							onChange({
								validDays: Math.max(1, Number(event.target.value) || 1),
							})
						}
					/>
				</div>
			</div>

			<div className="mt-4 grid gap-3 @2xl:grid-cols-3">
				{QUOTE_TERMS.map((term) => (
					<button
						key={term.id}
						type="button"
						aria-pressed={draft.term === term.id}
						onClick={() => onChange({ term: term.id as QuoteTermId })}
						className={`cursor-pointer rounded-lg border p-3 text-left transition-colors ${
							draft.term === term.id
								? "border-slate-900 bg-slate-50"
								: "border-slate-200 hover:bg-slate-50"
						}`}
					>
						<span className="block text-sm font-medium text-slate-900">
							<Translate text={term.labelKey} />
						</span>
						<span className="block text-xs text-slate-500">
							<Translate text={term.noteKey} />
						</span>
						<span className="mt-1 block text-xs font-medium text-brand-orange">
							{term.discount > 0
								? `-${Math.round(term.discount * 100)} % ${t(localizationConstants.salesTermDiscountSuffix)}`
								: t(localizationConstants.salesTermRegularPrice)}
						</span>
					</button>
				))}
			</div>

			<div className="mt-4 space-y-1.5">
				<Label htmlFor="quote-notes">
					<Translate text={localizationConstants.salesQuoteNotesLabel} />
				</Label>
				<Textarea
					id="quote-notes"
					rows={6}
					value={draft.notes}
					placeholder={t(localizationConstants.salesQuoteNotesPlaceholder)}
					onChange={(event) => onChange({ notes: event.target.value })}
					className="min-h-35 resize-y"
				/>
			</div>
		</SalesSectionCard>
	);
}
