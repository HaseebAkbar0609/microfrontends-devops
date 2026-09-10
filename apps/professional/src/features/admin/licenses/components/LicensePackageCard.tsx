"use client";

import { useState } from "react";
import { ArrowUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { LicensePackage } from "../constants/mockData";
import { AddPackageSelection } from "../hooks/useLicenseCart";

const SectionLabel = ({ text }: { text: string }) => (
	<p className="text-sm font-semibold text-slate-900">
		<Translate text={text} />
	</p>
);

const LicensePackageCard = ({
	pkg,
	onAdd,
}: {
	pkg: LicensePackage;
	onAdd: (pkg: LicensePackage, selection: AddPackageSelection) => void;
}) => {
	const isUpgrade = pkg.action === "upgrade";
	const [versionId, setVersionId] = useState(
		pkg.versionOptions?.[0]?.id ?? "",
	);
	const [industry, setIndustry] = useState(pkg.industryOptionKeys?.[2] ?? "");
	const [checkedIds, setCheckedIds] = useState<string[]>(
		pkg.versionChecklist
			?.filter((option) => option.defaultChecked === true)
			.map((option) => option.id) ?? [],
	);

	const handleAdd = () =>
		onAdd(pkg, {
			versionOption: pkg.versionOptions?.find(
				(option) => option.id === versionId,
			),
			checkedOptions: pkg.versionChecklist?.filter((option) =>
				checkedIds.includes(option.id),
			),
		});

	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<div className="flex items-center justify-between bg-slate-200/60 px-5 py-3.5">
				<h3 className="text-lg font-semibold text-slate-800">
					{pkg.name}
				</h3>
				{pkg.priceLabel && (
					<span className="text-sm font-semibold text-slate-700">
						<Translate
							text={localizationConstants.licensesPriceLabel}
						/>
						: {pkg.priceLabel}
					</span>
				)}
			</div>
			<div className="space-y-4 px-5 py-4">
				<div>
					<SectionLabel text={localizationConstants.licensesFeeLabel} />
					<p className="mt-1 whitespace-pre-line text-sm text-slate-600">
						<Translate text={pkg.feeKey} />
					</p>
				</div>

				{pkg.modulesKey && (
					<div>
						<SectionLabel
							text={localizationConstants.licensesModulesLabel}
						/>
						<p className="mt-1 text-sm text-slate-600">
							<Translate text={pkg.modulesKey} />
						</p>
					</div>
				)}

				{pkg.versionText && (
					<div className="border-t border-slate-100 pt-3">
						<SectionLabel
							text={localizationConstants.licensesVersionLabel}
						/>
						<p className="mt-1 text-sm text-slate-600">
							{pkg.versionText}
						</p>
					</div>
				)}

				{pkg.versionOptions && (
					<div className="border-t border-slate-100 pt-3">
						<SectionLabel
							text={localizationConstants.licensesVersionLabel}
						/>
						<RadioGroup
							value={versionId}
							onValueChange={setVersionId}
							className="mt-2 gap-2"
						>
							{pkg.versionOptions.map((option) => (
								<div
									key={option.id}
									className="flex items-center justify-between gap-3"
								>
									<Label className="flex items-center gap-2 text-sm font-normal text-slate-700">
										<RadioGroupItem value={option.id} />
										{option.label}
									</Label>
									<span className="text-sm text-slate-700">
										<Translate
											text={
												localizationConstants.licensesPriceLabel
											}
										/>
										: {option.priceLabel}
									</span>
								</div>
							))}
						</RadioGroup>
					</div>
				)}

				{pkg.versionChecklist && (
					<div className="border-t border-slate-100 pt-3">
						<SectionLabel
							text={localizationConstants.licensesVersionLabel}
						/>
						<div className="mt-2 space-y-2">
							{pkg.versionChecklist.map((option) => (
								<div
									key={option.id}
									className="flex items-center justify-between gap-3"
								>
									<Label className="flex items-center gap-2 text-sm font-normal text-slate-700">
										<Checkbox
											checked={checkedIds.includes(
												option.id,
											)}
											onCheckedChange={(checked) =>
												setCheckedIds((current) =>
													checked
														? [
																...current,
																option.id,
															]
														: current.filter(
																(id) =>
																	id !==
																	option.id,
															),
												)
											}
										/>
										{option.label}
									</Label>
									<span className="text-sm text-slate-700">
										<Translate
											text={
												localizationConstants.licensesPriceLabel
											}
										/>
										: {option.priceLabel}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{pkg.connectedSystems && (
					<div className="border-t border-slate-100 pt-3">
						<SectionLabel
							text={localizationConstants.licensesConnectedLabel}
						/>
						<p className="mt-1 text-sm text-slate-600">
							{pkg.connectedSystems}
						</p>
					</div>
				)}

				{pkg.industryOptionKeys && (
					<div className="border-t border-slate-100 pt-3">
						<SectionLabel
							text={localizationConstants.licensesIndustryLabel}
						/>
						<RadioGroup
							value={industry}
							onValueChange={setIndustry}
							className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3"
						>
							{pkg.industryOptionKeys.map((optionKey) => (
								<Label
									key={optionKey}
									className="flex items-center gap-2 text-sm font-normal text-slate-700"
								>
									<RadioGroupItem value={optionKey} />
									<Translate text={optionKey} />
								</Label>
							))}
						</RadioGroup>
					</div>
				)}

				{pkg.industryText && (
					<div className="border-t border-slate-100 pt-3">
						<SectionLabel
							text={localizationConstants.licensesIndustryLabel}
						/>
						<p className="mt-1 text-sm text-slate-600">
							<Translate text={pkg.industryText} />
						</p>
					</div>
				)}

				<div className="flex justify-end">
					<Button
						type="button"
						onClick={handleAdd}
						className="h-9 gap-1.5 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-900/90"
					>
						{isUpgrade ? (
							<>
								<ArrowUp className="h-4 w-4" />
								<Translate
									text={
										localizationConstants.licensesUpgradeAction
									}
								/>
							</>
						) : (
							<>
								<Plus className="h-4 w-4" />
								<Translate
									text={
										localizationConstants.licensesAddAction
									}
								/>
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default LicensePackageCard;
