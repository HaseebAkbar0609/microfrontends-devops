"use client";

import type React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Translate } from "@/utils/translation/translate";

interface ArticleDetailItem {
	label: string;
	value?: string | number | null;
	isBadge?: boolean;
	badgeVariant?: "success" | "secondary";
}

interface ArticleDetailSectionCardProps {
	title: string;
	items: ArticleDetailItem[];
	onEdit?: () => void;
	columns?: 2 | 3 | 4;
}

export function ArticleDetailSectionCard({
	title,
	items,
	onEdit,
	columns = 3,
}: ArticleDetailSectionCardProps) {
	const gridColsClass =
		columns === 2
			? "grid-cols-1 sm:grid-cols-2"
			: columns === 4
				? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
				: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-2xs">
			<CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-3">
				<CardTitle className="text-sm font-semibold text-zinc-950">
					<Translate text={title} />
				</CardTitle>
				{onEdit && (
					<Button
						variant="ghost"
						size="icon"
						onClick={onEdit}
						aria-label="Edit section"
						className="h-8 w-8 text-slate-500 hover:text-slate-900 cursor-pointer"
					>
						<Pencil className="h-4 w-4" />
					</Button>
				)}
			</CardHeader>
			<CardContent className="px-4 sm:px-6 py-4">
				<div className={`grid gap-4 sm:gap-6 ${gridColsClass}`}>
					{items.map((item) => (
						<div key={item.label} className="flex flex-col gap-1">
							<span className="text-xs font-medium text-slate-500">
								<Translate text={item.label} />
							</span>
							{item.isBadge ? (
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
								<span className="text-sm font-medium text-slate-900 break-words">
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
