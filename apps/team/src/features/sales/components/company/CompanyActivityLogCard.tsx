"use client";

import { Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
	SALES_ACTIVITY_TYPES,
	getSalesActivityLabelKey,
} from "../../constants/salesActivities";
import { useActivityLogForm } from "../../hooks/useActivityLogForm";
import type { SalesActivityType, SalesCompany } from "../../types";
import { formatDate } from "../../utils/salesFormatters";
import { SalesSectionCard } from "../SalesSectionCard";
import { SALES_PRIMARY_BUTTON_CLASS } from "../../constants/salesTheme";

type CompanyActivityLogCardProps = {
	company: SalesCompany;
};

export function CompanyActivityLogCard({
	company,
}: CompanyActivityLogCardProps) {
	const { draft, error, update, submit, toggleDone } = useActivityLogForm(
		company,
	);
	const t = useTranslate();

	return (
		<SalesSectionCard
			titleKey={localizationConstants.salesActivityLogTitle}
			icon={Phone}
		>
			<div className="grid gap-3 @2xl:grid-cols-[150px_minmax(0,1fr)_180px]">
				<div className="space-y-1.5">
					<Label htmlFor="activity-type">
						<Translate text={localizationConstants.salesActivityTypeLabel} />
					</Label>
					<Select
						value={draft.type}
						onValueChange={(value) =>
							update({ type: value as SalesActivityType })
						}
					>
						<SelectTrigger id="activity-type" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{SALES_ACTIVITY_TYPES.map((option) => (
								<SelectItem key={option.id} value={option.id}>
									<Translate text={option.labelKey} />
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="activity-text">
						<Translate text={localizationConstants.salesActivityCommentLabel} />
					</Label>
					<Input
						id="activity-text"
						value={draft.text}
						placeholder={t(
							localizationConstants.salesActivityCommentPlaceholder,
						)}
						aria-invalid={error ? true : undefined}
						onChange={(event) => update({ text: event.target.value })}
					/>
					{error ? (
						<p className="text-xs text-red-600">
							<Translate text={error} />
						</p>
					) : null}
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="activity-follow-up">
						<Translate
							text={localizationConstants.salesActivityFollowUpLabel}
						/>
					</Label>
					<Input
						id="activity-follow-up"
						type="date"
						value={draft.followUpAt}
						onChange={(event) => update({ followUpAt: event.target.value })}
					/>
				</div>
			</div>

			<Button
				type="button"
				size="sm"
				className={`mt-3 cursor-pointer ${SALES_PRIMARY_BUTTON_CLASS}`}
				onClick={submit}
			>
				<Translate text={localizationConstants.salesActivityAddButton} />
			</Button>

			<div className="mt-5 space-y-3">
				{company.activities.length === 0 ? (
					<p className="text-sm text-slate-500">
						<Translate text={localizationConstants.salesActivityEmpty} />
					</p>
				) : null}

				{company.activities.map((activity) => (
					<div
						key={activity.id}
						className="rounded-lg border border-slate-200 p-3 text-sm"
					>
						<div className="flex flex-wrap items-center justify-between gap-2">
							<span className="font-medium text-slate-900">
								<Translate text={getSalesActivityLabelKey(activity.type)} />
							</span>
							<span className="text-xs text-slate-500">
								{formatDate(activity.date)}
							</span>
						</div>
						<p
							className={
								activity.done
									? "mt-1 text-slate-500 line-through"
									: "mt-1 text-slate-700"
							}
						>
							{activity.text}
						</p>
						{activity.followUpAt ? (
							<div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
								<span
									className={
										activity.done ? "text-slate-500" : "text-brand-orange"
									}
								>
									<Translate
										text={localizationConstants.salesActivityFollowUpOn}
									/>{" "}
									{activity.followUpAt}
								</span>
								<Button
									type="button"
									size="sm"
									variant="ghost"
									className="h-7 cursor-pointer gap-1 px-2"
									onClick={() => toggleDone(activity.id)}
								>
									<Check className="h-3 w-3" />
									<Translate
										text={
											activity.done
												? localizationConstants.salesActivityReopen
												: localizationConstants.salesActivityMarkDone
										}
									/>
								</Button>
							</div>
						) : null}
					</div>
				))}
			</div>
		</SalesSectionCard>
	);
}
