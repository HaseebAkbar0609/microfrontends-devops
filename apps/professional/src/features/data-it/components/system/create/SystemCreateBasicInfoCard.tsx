"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	SYSTEM_CATEGORY_OPTIONS,
	SYSTEM_CATEGORY_TRANSLATION_MAP,
} from "@/features/data-it/constants/dataItSystem.constants";
import type { SystemCreateFormState } from "@/features/data-it/hooks/useDataItSystemCreate";
import type { SystemCategory } from "@/features/data-it/types/dataItSystem.types";

interface SystemCreateBasicInfoCardProps {
	form: SystemCreateFormState;
	errors: Record<string, string>;
	showPassword: boolean;
	onTogglePassword: () => void;
	onFieldChange: <K extends keyof SystemCreateFormState>(
		field: K,
		value: SystemCreateFormState[K],
	) => void;
}

export const SystemCreateBasicInfoCard: React.FC<
	SystemCreateBasicInfoCardProps
> = ({ form, errors, showPassword, onTogglePassword, onFieldChange }) => {
	const t = useTranslate();
	const placeholderInfo = t(localizationConstants.dataItSystemPlaceholderInfo);

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
			<h2 className="border-b border-slate-100 pb-4 text-base font-semibold text-slate-900">
				{t(localizationConstants.dataItSystemCreateBasicInfoCard)}
			</h2>

			<div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
				{/* Row 1 Left: System-ID (Styled with muted read-only fill matching Figma M005) */}
				<div>
					<label
						htmlFor="system-create-id"
						className="block text-xs font-semibold text-slate-700"
					>
						{t(localizationConstants.dataItSystemFieldSystemId)} *
					</label>
					<input
						id="system-create-id"
						type="text"
						value={form.systemId}
						onChange={(e) => onFieldChange("systemId", e.target.value)}
						placeholder={placeholderInfo}
						className={`mt-1.5 h-10 w-full rounded-lg border bg-slate-50/80 px-3.5 text-sm font-medium text-slate-600 transition-colors focus:bg-white focus:outline-hidden ${
							errors.systemId
								? "border-rose-300 focus:border-rose-500"
								: "border-slate-200 focus:border-slate-400"
						}`}
					/>
					{errors.systemId && (
						<p className="mt-1 text-xs text-rose-500">{errors.systemId}</p>
					)}
				</div>

				{/* Row 1 Right: Kategori */}
				<div>
					<label
						htmlFor="system-create-category"
						className="block text-xs font-semibold text-slate-700"
					>
						{t(localizationConstants.dataItSystemFieldCategory)}
					</label>
					<select
						id="system-create-category"
						value={form.category}
						onChange={(e) =>
							onFieldChange("category", e.target.value as SystemCategory)
						}
						className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 transition-colors focus:border-slate-400 focus:outline-hidden"
					>
						{SYSTEM_CATEGORY_OPTIONS.map((cat: SystemCategory) => (
							<option key={cat} value={cat}>
								{t(SYSTEM_CATEGORY_TRANSLATION_MAP[cat])}
							</option>
						))}
					</select>
				</div>

				{/* Row 2 Left: Program namn */}
				<div>
					<label
						htmlFor="system-create-program"
						className="block text-xs font-semibold text-slate-700"
					>
						{t(localizationConstants.dataItSystemFieldProgramName)} *
					</label>
					<input
						id="system-create-program"
						type="text"
						value={form.program}
						onChange={(e) => onFieldChange("program", e.target.value)}
						placeholder={placeholderInfo}
						className={`mt-1.5 h-10 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 transition-colors focus:outline-hidden ${
							errors.program
								? "border-rose-300 focus:border-rose-500"
								: "border-slate-200 focus:border-slate-400"
						}`}
					/>
					{errors.program && (
						<p className="mt-1 text-xs text-rose-500">{errors.program}</p>
					)}
				</div>

				{/* Row 2 Right: Email */}
				<div>
					<label
						htmlFor="system-create-email"
						className="block text-xs font-semibold text-slate-700"
					>
						{t(localizationConstants.dataItSystemFieldEmail)}
					</label>
					<input
						id="system-create-email"
						type="email"
						value={form.email}
						onChange={(e) => onFieldChange("email", e.target.value)}
						placeholder={placeholderInfo}
						className={`mt-1.5 h-10 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 transition-colors focus:outline-hidden ${
							errors.email
								? "border-rose-300 focus:border-rose-500"
								: "border-slate-200 focus:border-slate-400"
						}`}
					/>
					{errors.email && (
						<p className="mt-1 text-xs text-rose-500">{errors.email}</p>
					)}
				</div>

				{/* Row 3 Left: Lösenord */}
				<div>
					<label
						htmlFor="system-create-password"
						className="block text-xs font-semibold text-slate-700"
					>
						{t(localizationConstants.dataItSystemFieldPassword)}
					</label>
					<div className="relative mt-1.5">
						<input
							id="system-create-password"
							type={showPassword ? "text" : "password"}
							value={form.password}
							onChange={(e) => onFieldChange("password", e.target.value)}
							placeholder={placeholderInfo}
							className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-3.5 pr-10 text-sm text-slate-900 transition-colors focus:border-slate-400 focus:outline-hidden"
						/>
						<button
							type="button"
							onClick={onTogglePassword}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
							aria-label={
								showPassword
									? t(localizationConstants.dataItSystemHidePassword)
									: t(localizationConstants.dataItSystemShowPassword)
							}
						>
							{showPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</button>
					</div>
				</div>

				{/* Row 3 Right: Beskrivning */}
				<div>
					<label
						htmlFor="system-create-description"
						className="block text-xs font-semibold text-slate-700"
					>
						{t(localizationConstants.dataItSystemFieldDescription)}
					</label>
					<input
						id="system-create-description"
						type="text"
						value={form.description}
						onChange={(e) => onFieldChange("description", e.target.value)}
						placeholder={placeholderInfo}
						className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 transition-colors focus:border-slate-400 focus:outline-hidden"
					>
					</input>
				</div>
			</div>
		</div>
	);
};

export default SystemCreateBasicInfoCard;
