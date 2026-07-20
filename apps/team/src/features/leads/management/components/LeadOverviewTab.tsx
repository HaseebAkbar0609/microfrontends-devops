"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { PencilLine } from "lucide-react";
import type { LeadRow } from "@/features/leads/types";
import {
	leadDetailCategoryOptions,
	leadDetailRegionOptions,
} from "@/features/leads/management/constants";
import TagSelector from "@/features/leads/management/components/TagSelector";

type LeadOverviewTabProps = {
	lead: LeadRow;
	projectType?: string;
};

type DetailCardProps = {
	titleKey: string;
	items: Array<{ labelKey: string; value: string }>;
};

function OverviewIcon() {
	return <Image src="/assets/icons/personal-info.svg" alt="" width={24} height={24} />;
}

export default function LeadOverviewTab({
	lead,
	projectType,
}: LeadOverviewTabProps) {
	const t = useTranslate();
	const [isEditingSummary, setIsEditingSummary] = useState(false);
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);
	const [isRegionOpen, setIsRegionOpen] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([
		lead.category,
	]);
	const [selectedRegions, setSelectedRegions] = useState<string[]>([lead.city]);
	const [draftCategories, setDraftCategories] = useState<string[]>([
		lead.category,
	]);
	const [draftRegions, setDraftRegions] = useState<string[]>([lead.city]);

	const beginEditingSummary = () => {
		setDraftCategories(selectedCategories);
		setDraftRegions(selectedRegions);
		setIsEditingSummary(true);
	};

	const cancelEditingSummary = () => {
		setDraftCategories(selectedCategories);
		setDraftRegions(selectedRegions);
		setIsEditingSummary(false);
		setIsCategoryOpen(false);
		setIsRegionOpen(false);
	};

	const saveSummaryChanges = () => {
		setSelectedCategories(draftCategories);
		setSelectedRegions(draftRegions);
		setIsEditingSummary(false);
		setIsCategoryOpen(false);
		setIsRegionOpen(false);
	};

	return (
		<div className="grid gap-4 xl:grid-cols-2 mb-10">
			<DetailCard
				titleKey={localizationConstants.leadInformation}
				items={[
					{ labelKey: localizationConstants.leadIdLabel, value: lead.leadId },
					{ labelKey: localizationConstants.cityLabel, value: lead.city },
					{ labelKey: localizationConstants.categoryLabel, value: lead.category },
					{ labelKey: localizationConstants.createdDateLabel, value: lead.date },
				]}
			/>

			<DetailCard
				titleKey={localizationConstants.customerInformation}
				items={[
					{ labelKey: localizationConstants.nameLabel, value: lead.customer },
					{ labelKey: localizationConstants.emailLabel, value: lead.email },
					{ labelKey: localizationConstants.phoneLabel, value: lead.phone },
					{ labelKey: localizationConstants.cityLabel, value: lead.city },
				]}
			/>

			<div className="mt-4 max-w-xl">
				<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
					<div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center gap-3">
							<OverviewIcon />
							<div className="text-sm font-semibold text-slate-900">
								<Translate text={localizationConstants.requestSummary} />
							</div>
						</div>
						<div className="flex gap-2">
							{isEditingSummary ? (
								<>
									<Button
										type="button"
										className="cursor-pointer h-8"
										variant="outline"
										onClick={cancelEditingSummary}
									>
										<Translate text={localizationConstants.discard} />
									</Button>
									<Button
										type="button"
										className="cursor-pointer bg-black h-8 text-sm hover:bg-slate-700"
										onClick={saveSummaryChanges}
									>
										<Translate text={localizationConstants.save} />
									</Button>
								</>
							) : (
								<Button
									type="button"
									variant="outline"
									onClick={beginEditingSummary}
									className="cursor-pointer gap-2 text-sm h-8"
								>
									<PencilLine className="size-4" />
									<Translate text={localizationConstants.editLabel} />
								</Button>
							)}
						</div>
					</div>

					<div className="p-5">
						<div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
							<div>
								<div className="text-sm font-medium capitalize text-black">
									<Translate text={localizationConstants.numberOfHits} />
								</div>
								<div className="mt-2 text-sm font-bold text-slate-900">
									{lead.matches}
								</div>
							</div>
							<div>
								<div className="text-sm font-medium capitalize text-black">
									<Translate text={localizationConstants.typeLabel} />
								</div>
								<div className="mt-2 text-sm font-light text-slate-500">
									{projectType || lead.type}
								</div>
							</div>
						</div>

						<div className="mt-6 space-y-5">
							<TagSelector
								label={t(localizationConstants.categoryLabel)}
								options={leadDetailCategoryOptions}
								selected={isEditingSummary ? draftCategories : selectedCategories}
								onToggle={(value) =>
									setDraftCategories((prev) => toggleSelection(prev, value))
								}
								open={isCategoryOpen}
								onOpenChange={(next) => {
									if (!isEditingSummary) return;
									setIsCategoryOpen(next);
								}}
								isEditing={isEditingSummary}
							/>

							<TagSelector
								label={t(localizationConstants.regionLabel)}
								options={leadDetailRegionOptions}
								selected={isEditingSummary ? draftRegions : selectedRegions}
								onToggle={(value) =>
									setDraftRegions((prev) => toggleSelection(prev, value))
								}
								open={isRegionOpen}
								onOpenChange={(next) => {
									if (!isEditingSummary) return;
									setIsRegionOpen(next);
								}}
								isEditing={isEditingSummary}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function DetailCard({ titleKey, items }: DetailCardProps) {
	return (
		<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
			<div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
				<OverviewIcon />
				<div className="text-sm font-semibold text-slate-900">
					<Translate text={titleKey} />
				</div>
			</div>
			<div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
				{items.map((item) => (
					<div key={item.labelKey}>
						<div className="text-sm font-medium capitalize text-black">
							<Translate text={item.labelKey} />
						</div>
						<div className="mt-2 text-sm font-medium text-slate-500">
							{item.value}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function toggleSelection(values: string[], value: string) {
	return values.includes(value)
		? values.filter((item) => item !== value)
		: [...values, value];
}
