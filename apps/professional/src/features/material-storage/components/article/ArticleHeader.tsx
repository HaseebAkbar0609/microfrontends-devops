"use client";

import { Download, Package, Pencil, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { MaterialArticle, StockStatus } from "../../types/materialStorage.types";
import { StockStatusBadge } from "../common/StockStatusBadge";

const OUTLINE_BUTTON_CLASS = "h-10 cursor-pointer gap-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-50";

interface ArticleHeaderProps {
	article: MaterialArticle;
	/** In the overview's depot. */
	status: StockStatus;
	onEdit: () => void;
	onReceive: () => void;
	onWithdraw: () => void;
	onClose: () => void;
}

/** Icon, name, article number and status on the left; Redigera, Ta in and Ta ut on the right; ✕ in the corner. */
export function ArticleHeader({ article, status, onEdit, onReceive, onWithdraw, onClose }: ArticleHeaderProps) {
	const t = useTranslate();

	return (
		<div className="relative flex flex-wrap items-center justify-between gap-4 px-5 pt-6 pb-4 pr-12">
			<div className="flex min-w-0 items-center gap-4">
				<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500" aria-hidden>
					<Package className="h-7 w-7" strokeWidth={1.75} />
				</span>
				<div className="min-w-0">
					<DialogTitle className="truncate text-lg font-semibold text-slate-900">{article.name}</DialogTitle>
					<DialogDescription className="text-sm text-slate-600">
						{t(localizationConstants.materialArticleNumber, { articleNo: article.articleNo })}
					</DialogDescription>
					<div className="mt-1.5">
						<StockStatusBadge status={status} />
					</div>
				</div>
			</div>
			<div className="flex flex-wrap items-center gap-3">
				<Button type="button" variant="outline" className={OUTLINE_BUTTON_CLASS} onClick={onEdit}>
					<Pencil className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.materialActionEdit} />
				</Button>
				<Button type="button" variant="outline" className={OUTLINE_BUTTON_CLASS} onClick={onReceive}>
					<Download className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.materialReceiveMaterial} />
				</Button>
				<Button type="button" className="h-10 cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800" onClick={onWithdraw}>
					<Upload className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.materialWithdrawMaterial} />
				</Button>
			</div>
			<button
				type="button"
				onClick={onClose}
				aria-label={t(localizationConstants.materialCloseDialog)}
				className="absolute top-3 right-3 cursor-pointer rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
			>
				<X className="h-5 w-5" aria-hidden />
			</button>
		</div>
	);
}
