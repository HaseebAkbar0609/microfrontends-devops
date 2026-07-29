"use client";

import { ArrowUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { LicensePackage } from "../constants/mockData";

const LicensePackageCard = ({
	pkg,
	onAdd,
}: {
	pkg: LicensePackage;
	onAdd: (pkg: LicensePackage) => void;
}) => {
	const isUpgrade = pkg.action === "upgrade";

	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<div className="flex items-center justify-between bg-slate-100 px-5 py-3.5">
				<h2 className="text-lg font-semibold text-slate-800">
					{pkg.name}
				</h2>
				<span className="text-sm font-semibold text-slate-700">
					<Translate text={localizationConstants.licensesPriceLabel} />
					: {pkg.price}
				</span>
			</div>
			<div className="space-y-4 px-5 py-4">
				<div>
					<p className="text-sm font-semibold text-slate-900">
						<Translate
							text={localizationConstants.licensesFeeLabel}
						/>
					</p>
					<p className="mt-1 text-sm text-slate-600">
						<Translate text={pkg.feeKey} />
					</p>
				</div>
				<div>
					<p className="text-sm font-semibold text-slate-900">
						<Translate
							text={localizationConstants.licensesModulesLabel}
						/>
					</p>
					<p className="mt-1 text-sm text-slate-600">
						<Translate text={pkg.modulesKey} />
					</p>
				</div>
				<div className="flex justify-end">
					<Button
						type="button"
						onClick={() => onAdd(pkg)}
						className="h-9 gap-1.5 rounded-md bg-[#18181B] px-4 text-sm font-medium text-white hover:bg-[#18181B]/90"
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
