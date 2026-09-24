"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Pencil, Check, X } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

// In-place editable section card for detail views

export interface ArticleDetailFieldItem {
	key: string;
	label: string;
	value?: string | number | null;
	type?: "text" | "number" | "select";
	options?: { label: string; value: string }[];
	isBadge?: boolean;
	badgeVariant?: "success" | "secondary";
	readOnly?: boolean;
}

interface ArticleDetailSectionCardProps {
	title: string;
	items: ArticleDetailFieldItem[];
	onSave?: (updates: Record<string, string | number>) => void;
	columns?: 2 | 3 | 4;
	icon?: React.ReactNode;
}

export function ArticleDetailSectionCard({
	title,
	items,
	onSave,
	columns = 3,
	icon,
}: ArticleDetailSectionCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState<Record<string, string>>({});

	useEffect(() => {
		const initialDraft: Record<string, string> = {};
		items.forEach((item) => {
			initialDraft[item.key] = item.value != null ? String(item.value) : "";
		});
		setDraft(initialDraft);
	}, [items]);

	const handleEdit = () => {
		const initialDraft: Record<string, string> = {};
		items.forEach((item) => {
			initialDraft[item.key] = item.value != null ? String(item.value) : "";
		});
		setDraft(initialDraft);
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleSave = () => {
		if (onSave) {
			onSave(draft);
		}
		setIsEditing(false);
	};

	const gridColsClass =
		columns === 2
			? "grid-cols-1 sm:grid-cols-2"
			: columns === 4
				? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
				: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

	return (
		<Card className="rounded-xl border border-slate-200/90 bg-white shadow-none overflow-hidden">
			<CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/80 px-6 py-4">
				<CardTitle className="text-sm font-semibold text-zinc-900 flex items-center gap-2.5">
					{icon && <span className="text-slate-600 flex items-center">{icon}</span>}
					<Translate text={title} />
				</CardTitle>
				{onSave && (
					<div className="flex items-center gap-2">
						{isEditing ? (
							<>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleCancel}
									className="h-7 px-2.5 text-xs gap-1 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer rounded-lg font-medium"
								>
									<X className="h-3.5 w-3.5" />
									<Translate text={localizationConstants.customerBtnCancel} />
								</Button>
								<Button
									type="button"
									size="sm"
									onClick={handleSave}
									className="h-7 px-2.5 text-xs gap-1 bg-[#111721] hover:bg-slate-800 text-white cursor-pointer rounded-lg font-medium"
								>
									<Check className="h-3.5 w-3.5" />
									<Translate text={localizationConstants.customerBtnSave} />
								</Button>
							</>
						) : (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleEdit}
								aria-label="Edit section"
								className="h-7 px-3 text-xs gap-1.5 border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer rounded-lg font-medium shadow-none"
							>
								<Pencil className="h-3.5 w-3.5 text-slate-500" />
								<Translate text={localizationConstants.supplierArticleEditBtn} />
							</Button>
						)}
					</div>
				)}
			</CardHeader>
			<CardContent className="px-6 py-5">
				<div className={`grid gap-y-6 gap-x-8 ${gridColsClass}`}>
					{items.map((item) => (
						<div key={item.key || item.label} className="flex flex-col gap-1.5 min-w-0">
							<span className="text-xs font-semibold text-slate-900 tracking-tight">
								<Translate text={item.label} />
							</span>
							{isEditing && !item.readOnly ? (
								item.type === "select" && item.options ? (
									<Select
										value={draft[item.key] || ""}
										onValueChange={(val) =>
											setDraft((prev) => ({ ...prev, [item.key]: val }))
										}
									>
										<SelectTrigger className="h-8 border-slate-200 bg-white text-xs">
											<SelectValue placeholder="Välj..." />
										</SelectTrigger>
										<SelectContent className="bg-white border-slate-200 shadow-md">
											{item.options.map((opt) => (
												<SelectItem key={opt.value} value={opt.value}>
													{opt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								) : (
									<Input
										value={draft[item.key] ?? ""}
										onChange={(e) =>
											setDraft((prev) => ({ ...prev, [item.key]: e.target.value }))
										}
										className="h-8 text-xs bg-white border-slate-200"
									/>
								)
							) : item.isBadge ? (
								<span
									className={`inline-flex w-fit items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
										item.badgeVariant === "success"
											? "bg-emerald-50 text-emerald-700"
											: "bg-slate-100 text-slate-700"
									}`}
								>
									{item.value ? <Translate text={String(item.value)} /> : "-"}
								</span>
							) : (
								<span className="text-xs font-normal text-slate-500 break-words">
									{item.value || item.value === 0 ? String(item.value) : "-"}
								</span>
							)}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
