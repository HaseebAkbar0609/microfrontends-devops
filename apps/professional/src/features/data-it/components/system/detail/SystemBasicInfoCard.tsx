"use client";

import React from "react";
import { FileText, Pencil, Eye, EyeOff } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { SYSTEM_CATEGORY_TRANSLATION_MAP } from "@/features/data-it/constants/dataItSystem.constants";
import type { SystemItem } from "@/features/data-it/types/dataItSystem.types";

interface SystemBasicInfoCardProps {
	system: SystemItem;
	showPassword?: boolean;
	onTogglePassword?: () => void;
	onEdit: () => void;
}

export const SystemBasicInfoCard: React.FC<SystemBasicInfoCardProps> = ({
	system,
	showPassword = false,
	onTogglePassword,
	onEdit,
}) => {
	const t = useTranslate();
	const categoryLabel =
		SYSTEM_CATEGORY_TRANSLATION_MAP[system.category]
			? t(SYSTEM_CATEGORY_TRANSLATION_MAP[system.category])
			: system.categoryLabel;

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
			{/* Card Header */}
			<div className="flex items-center justify-between border-b border-slate-100 pb-4">
				<div className="flex items-center gap-2.5">
					<FileText className="h-5 w-5 text-slate-700" />
					<h2 className="text-base font-semibold text-slate-900">
						{t(localizationConstants.dataItSystemBasicInfoTitle)}
					</h2>
				</div>
				<button
					type="button"
					onClick={onEdit}
					className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
				>
					<Pencil className="h-3.5 w-3.5 text-slate-500" />
					<span>{t(localizationConstants.dataItSystemBtnEdit)}</span>
				</button>
			</div>

			{/* Info Grid matching Figma Screenshot 2 */}
			<div className="mt-5 grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
				{/* System ID */}
				<div>
					<p className="text-xs font-medium text-slate-500">
						{t(localizationConstants.dataItSystemFieldSystemId)}
					</p>
					<p className="mt-1 text-sm font-semibold text-slate-900">
						{system.systemId}
					</p>
				</div>

				{/* Category */}
				<div>
					<p className="text-xs font-medium text-slate-500">
						{t(localizationConstants.dataItSystemFieldCategory)}
					</p>
					<p className="mt-1 text-sm font-semibold text-slate-900">
						{categoryLabel}
					</p>
				</div>

				{/* Program name */}
				<div>
					<p className="text-xs font-medium text-slate-500">
						{t(localizationConstants.dataItSystemFieldProgramName)}
					</p>
					<p className="mt-1 text-sm font-semibold text-slate-900">
						{system.program}
					</p>
				</div>

				{/* Email */}
				<div>
					<p className="text-xs font-medium text-slate-500">
						{t(localizationConstants.dataItSystemFieldEmail)}
					</p>
					<p className="mt-1 text-sm font-semibold text-slate-900">
						{system.email || "—"}
					</p>
				</div>

				{/* Password */}
				<div>
					<p className="text-xs font-medium text-slate-500">
						{t(localizationConstants.dataItSystemFieldPassword)}
					</p>
					<div className="mt-1 flex items-center gap-2">
						<p className="text-sm font-semibold text-slate-900">
							{showPassword ? system.password || "—" : "••••••••"}
						</p>
						{system.password && onTogglePassword && (
							<button
								type="button"
								onClick={onTogglePassword}
								className="text-slate-400 hover:text-slate-600"
								aria-label={
									showPassword
										? t(localizationConstants.dataItSystemHidePassword)
										: t(localizationConstants.dataItSystemShowPassword)
								}
							>
								{showPassword ? (
									<EyeOff className="h-3.5 w-3.5" />
								) : (
									<Eye className="h-3.5 w-3.5" />
								)}
							</button>
						)}
					</div>
				</div>

				{/* Description */}
				<div className="sm:col-span-2 lg:col-span-3">
					<p className="text-xs font-medium text-slate-500">
						{t(localizationConstants.dataItSystemFieldDescription)}
					</p>
					<p className="mt-1 text-sm text-slate-700">
						{system.description || "—"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default SystemBasicInfoCard;
