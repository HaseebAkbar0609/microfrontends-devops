"use client";

import React, { useState, useEffect } from "react";
import { FileText, Edit, Check, X } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { DataItEmployeeOverview } from "../../types/dataItOverview.types";
import { showToast } from "@/lib/toast";

interface DataItDetailBasicInfoCardProps {
	employee: DataItEmployeeOverview;
	onUpdateEmployee?: (updated: DataItEmployeeOverview) => void;
}

export function DataItDetailBasicInfoCard({
	employee,
	onUpdateEmployee,
}: DataItDetailBasicInfoCardProps) {
	const t = useTranslate();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		personCode: employee.personCode,
		name: employee.name,
		email: employee.email,
		role: employee.role,
		phone: employee.phone,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		setFormData({
			personCode: employee.personCode,
			name: employee.name,
			email: employee.email,
			role: employee.role,
			phone: employee.phone,
		});
	}, [employee]);

	const handleCancel = () => {
		setFormData({
			personCode: employee.personCode,
			name: employee.name,
			email: employee.email,
			role: employee.role,
			phone: employee.phone,
		});
		setErrors({});
		setIsEditing(false);
	};

	const handleSave = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.name.trim()) newErrors.name = t(localizationConstants.dataItValidationRequired);
		if (!formData.email.trim()) newErrors.email = t(localizationConstants.dataItValidationRequired);

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		onUpdateEmployee?.({ ...employee, ...formData });
		showToast("success", t(localizationConstants.dataItToastSaveSuccess));
		setErrors({});
		setIsEditing(false);
	};

	const fieldConfigs: Array<{
		key: keyof typeof formData;
		label: string;
		type?: string;
	}> = [
		{ key: "personCode", label: t(localizationConstants.dataItFieldId) },
		{ key: "name", label: t(localizationConstants.dataItFieldName) },
		{ key: "email", label: t(localizationConstants.dataItFieldEmail), type: "email" },
		{ key: "role", label: t(localizationConstants.dataItFieldRole) },
		{ key: "phone", label: t(localizationConstants.dataItFieldPhone), type: "tel" },
	];

	return (
		<div className="rounded-lg border border-slate-200 bg-white shadow-sm">
			{/* Card Header */}
			<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
				<div className="flex items-center gap-2.5">
					<FileText size={18} className="text-slate-600" />
					<h3 className="text-base font-semibold text-slate-900">
						{t(localizationConstants.dataItBasicInfoCardTitle)}
					</h3>
				</div>
				{!isEditing ? (
					<button
						type="button"
						onClick={() => setIsEditing(true)}
						className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none"
					>
						<Edit size={13} />
						<span>{t(localizationConstants.dataItBtnEdit)}</span>
					</button>
				) : (
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={handleCancel}
							className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
						>
							<X size={13} />
							<span>{t(localizationConstants.dataItBtnCancel)}</span>
						</button>
						<button
							type="button"
							onClick={handleSave}
							className="inline-flex items-center gap-1 rounded-md bg-slate-950 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
						>
							<Check size={13} />
							<span>{t(localizationConstants.dataItBtnSave)}</span>
						</button>
					</div>
				)}
			</div>

			{/* Card Fields Grid */}
			<div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3">
				{fieldConfigs.map((f) => (
					<div key={f.key}>
						<label className="text-xs font-medium text-slate-400">{f.label}</label>
						{isEditing ? (
							<div>
								<input
									type={f.type || "text"}
									value={formData[f.key]}
									onChange={(e) => {
										setFormData((p) => ({ ...p, [f.key]: e.target.value }));
										if (errors[f.key]) setErrors((prev) => ({ ...prev, [f.key]: "" }));
									}}
									className={`mt-1 h-9 w-full rounded-md border bg-white px-3 text-sm text-slate-800 focus:outline-none ${
										errors[f.key] ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-slate-400"
									}`}
								/>
								{errors[f.key] && <p className="mt-1 text-xs text-rose-500">{errors[f.key]}</p>}
							</div>
						) : (
							<p className="mt-1 text-sm font-medium text-slate-800">{formData[f.key]}</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
