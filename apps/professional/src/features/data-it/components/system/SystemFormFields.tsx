"use client";

import React from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	SYSTEM_CATEGORY_OPTIONS,
	SYSTEM_STATUS_OPTIONS,
	SYSTEM_CATEGORY_TRANSLATION_MAP,
	SYSTEM_STATUS_BADGE_CONFIG,
} from "@/features/data-it/constants/dataItSystem.constants";
import type {
	SystemCategory,
	SystemStatus,
} from "@/features/data-it/types/dataItSystem.types";

export interface SystemFormValues {
	systemId?: string;
	program: string;
	category: SystemCategory;
	status: SystemStatus;
	pricePerMonth: number;
	email: string;
	password: string;
	description: string;
}

interface SystemFormFieldsProps {
	values: SystemFormValues;
	onChange: (updates: Partial<SystemFormValues>) => void;
	errors: { [key: string]: string };
	isCreate?: boolean;
}

export const SystemFormFields: React.FC<SystemFormFieldsProps> = ({
	values,
	onChange,
	errors,
	isCreate = false,
}) => {
	const t = useTranslate();

	return (
		<div className="space-y-4 py-2">
			<div className="grid grid-cols-2 gap-3">
				{isCreate && (
					<div>
						<label className="block text-xs font-semibold text-slate-700">
							{t(localizationConstants.dataItSystemFieldSystemId)} *
						</label>
						<input
							type="text"
							value={values.systemId || ""}
							onChange={(e) => onChange({ systemId: e.target.value })}
							placeholder="#5010"
							className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-hidden"
						/>
						{errors.systemId && (
							<p className="mt-1 text-xs text-rose-500">{errors.systemId}</p>
						)}
					</div>
				)}

				<div className={isCreate ? "" : "col-span-2 sm:col-span-1"}>
					<label className="block text-xs font-semibold text-slate-700">
						{t(localizationConstants.dataItSystemColProgram)} *
					</label>
					<input
						type="text"
						value={values.program}
						onChange={(e) => onChange({ program: e.target.value })}
						placeholder="Fortnox / Autodesk"
						className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-hidden"
					/>
					{errors.program && (
						<p className="mt-1 text-xs text-rose-500">{errors.program}</p>
					)}
				</div>

				<div>
					<label className="block text-xs font-semibold text-slate-700">
						{t(localizationConstants.dataItSystemColCategory)}
					</label>
					<select
						value={values.category}
						onChange={(e) =>
							onChange({ category: e.target.value as SystemCategory })
						}
						className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-hidden"
					>
						{SYSTEM_CATEGORY_OPTIONS.map((cat) => (
							<option key={cat} value={cat}>
								{t(SYSTEM_CATEGORY_TRANSLATION_MAP[cat])}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className="block text-xs font-semibold text-slate-700">
						{t(localizationConstants.dataItSystemColStatus)}
					</label>
					<select
						value={values.status}
						onChange={(e) =>
							onChange({ status: e.target.value as SystemStatus })
						}
						className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-hidden"
					>
						{SYSTEM_STATUS_OPTIONS.map((st) => (
							<option key={st} value={st}>
								{t(SYSTEM_STATUS_BADGE_CONFIG[st].labelKey)}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-xs font-semibold text-slate-700">
						{t(localizationConstants.dataItSystemFieldPricePerMonth)}
					</label>
					<input
						type="number"
						min="0"
						value={values.pricePerMonth}
						onChange={(e) =>
							onChange({ pricePerMonth: Number(e.target.value) })
						}
						className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-hidden"
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className="block text-xs font-semibold text-slate-700">
						{t(localizationConstants.dataItSystemFieldEmail)}
					</label>
					<input
						type="email"
						value={values.email}
						onChange={(e) => onChange({ email: e.target.value })}
						placeholder="admin@system.se"
						className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-hidden"
					/>
					{errors.email && (
						<p className="mt-1 text-xs text-rose-500">{errors.email}</p>
					)}
				</div>

				<div>
					<label className="block text-xs font-semibold text-slate-700">
						{t(localizationConstants.dataItSystemFieldPassword)}
					</label>
					<input
						type="text"
						value={values.password}
						onChange={(e) => onChange({ password: e.target.value })}
						className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-hidden"
					/>
				</div>
			</div>

			<div>
				<label className="block text-xs font-semibold text-slate-700">
					{t(localizationConstants.dataItSystemFieldDescription)}
				</label>
				<textarea
					rows={2}
					value={values.description}
					onChange={(e) => onChange({ description: e.target.value })}
					className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-hidden"
				/>
			</div>
		</div>
	);
};

export default SystemFormFields;
