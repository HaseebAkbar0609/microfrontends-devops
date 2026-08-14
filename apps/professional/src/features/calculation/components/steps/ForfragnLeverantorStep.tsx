"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { SUPPLIER_OPTIONS } from "../../constants/createForfragnOptions";

// ── Sub-components ─────────────────────────────────────────────────────────

interface StepFormFieldProps {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	multiline?: boolean;
}

function StepFormField({ label, value, onChange, placeholder, multiline }: StepFormFieldProps) {
	return (
		<div className="grid gap-1.5">
			<label className="text-sm font-medium text-slate-900">{label}</label>
			{multiline ? (
				<textarea
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					rows={4}
					className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:border-slate-400 focus-visible:outline-none resize-none"
				/>
			) : (
				<input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:border-slate-400 focus-visible:outline-none"
				/>
			)}
		</div>
	);
}

// ── Main component ─────────────────────────────────────────────────────────

export interface ForfragnLeverantorData {
	supplier: string;
	message: string;
}

export interface ForfragnLeverantorStepProps {
	data: ForfragnLeverantorData;
	onChange: (patch: Partial<ForfragnLeverantorData>) => void;
}

export function ForfragnLeverantorStep({ data, onChange }: ForfragnLeverantorStepProps) {
	const t = useTranslate();
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Truck className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.calcInquiryWizStep4} />
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex flex-col gap-5">
						{/* Supplier dropdown */}
						<div className="grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.calcInquiryWizSupplierLabel} />
							</label>
							<div className="relative" ref={dropdownRef}>
								<button
									type="button"
									onClick={() => setOpen((v) => !v)}
									className="flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:border-slate-400 focus-visible:outline-none"
								>
									<span className={data.supplier ? "text-slate-900" : "text-slate-400"}>
										{data.supplier || t(localizationConstants.calcInquiryWizSupplierLabel)}
									</span>
									<ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
								</button>
								{open && (
									<div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white py-1 shadow-md">
										{SUPPLIER_OPTIONS.map((opt) => (
											<button
												key={opt}
												type="button"
												onClick={() => {
													onChange({ supplier: opt });
													setOpen(false);
												}}
												className={`w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 ${
													data.supplier === opt
														? "font-medium text-slate-900"
														: "text-slate-700"
												}`}
											>
												{opt}
											</button>
										))}
									</div>
								)}
							</div>
						</div>

						{/* Message to supplier */}
						<StepFormField
							label={t(localizationConstants.calcInquiryWizSupplierMsg)}
							value={data.message}
							onChange={(v) => onChange({ message: v })}
							placeholder={t(localizationConstants.calcInquiryWizSupplierMsg)}
							multiline
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
