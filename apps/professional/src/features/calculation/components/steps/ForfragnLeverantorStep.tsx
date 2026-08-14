"use client";

import { useEffect, useRef, useState } from "react";
import { Folder, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { SUPPLIER_OPTIONS } from "../../constants/createForfragnOptions";

export interface ForfragnLeverantorStepProps {
	suppliers: string[];
	onAdd: (name: string) => void;
	onRemove: (name: string) => void;
}

export function ForfragnLeverantorStep({ suppliers, onAdd, onRemove }: ForfragnLeverantorStepProps) {
	const t = useTranslate();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleOutside(e: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleOutside);
		return () => document.removeEventListener("mousedown", handleOutside);
	}, []);

	const available = SUPPLIER_OPTIONS.filter((s) => !suppliers.includes(s));

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex flex-1 items-center gap-2 text-base font-medium">
						<Folder className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.createForfrgnInbjudnaSection} />
					</CardTitle>
					<div ref={dropdownRef} className="relative">
						<Button
							type="button"
							size="sm"
							onClick={() => setDropdownOpen((v) => !v)}
							className="h-8 cursor-pointer gap-1.5 bg-[#111721] text-xs text-white hover:bg-slate-800"
						>
							<Plus className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.createForfrgnLaggTill} />
						</Button>
						{dropdownOpen && available.length > 0 && (
							<div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-md border border-slate-200 bg-white shadow-md">
								{available.map((s) => (
									<button
										key={s}
										type="button"
										onClick={() => {
											onAdd(s);
											setDropdownOpen(false);
										}}
										className="flex w-full cursor-pointer items-center px-3 py-2 text-sm text-zinc-700 hover:bg-slate-50"
									>
										{s}
									</button>
								))}
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent className="p-6">
					<div className="grid gap-1.5">
						<label className="text-sm font-medium text-slate-900">
							{t(localizationConstants.createForfrgnLeverantorLabel)}
						</label>
						<div className="flex min-h-10 flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
							{suppliers.length === 0 && (
								<span className="text-sm text-slate-400">—</span>
							)}
							{suppliers.map((s) => (
								<span
									key={s}
									className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700"
								>
									{s}
									<button
										type="button"
										onClick={() => onRemove(s)}
										className="cursor-pointer text-slate-400 hover:text-slate-600"
									>
										<X className="h-3 w-3" />
									</button>
								</span>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
