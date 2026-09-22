"use client";

import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ArticleImportResultBannerProps {
	readonly result: {
		success: boolean;
		successCount: number;
		failureCount: number;
	};
}

export function ArticleImportResultBanner({
	result,
}: ArticleImportResultBannerProps) {
	if (result.success) {
		return (
			<div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium">
				<CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
				<div>
					<p className="font-semibold">
						<Translate text={localizationConstants.importSuccessMessage} />
					</p>
					<p className="text-xs text-emerald-700 mt-0.5">
						{result.successCount}{" "}
						<Translate text={localizationConstants.importSuccessArticlesCreated} />
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm font-medium">
			<AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
			<div>
				<p className="font-semibold">
					<Translate text={localizationConstants.importErrorMessage} />
				</p>
				<p className="text-xs text-red-700 mt-0.5">
					{result.failureCount}{" "}
					<Translate text={localizationConstants.importFailedArticlesCount} />
				</p>
			</div>
		</div>
	);
}
