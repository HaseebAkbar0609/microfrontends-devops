"use client";

import React from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { DataItEmployeeOverview } from "../../types/dataItOverview.types";

interface DataItOverviewDialogsProps {
	deleteTarget: DataItEmployeeOverview | null;
	onConfirmDelete: () => void;
	onCancelDelete: () => void;
	archiveTarget: DataItEmployeeOverview | null;
	onConfirmArchive: () => void;
	onCancelArchive: () => void;
}

export function DataItOverviewDialogs({
	deleteTarget,
	onConfirmDelete,
	onCancelDelete,
	archiveTarget,
	onConfirmArchive,
	onCancelArchive,
}: DataItOverviewDialogsProps) {
	const t = useTranslate();

	return (
		<>
			{/* Delete Confirmation Modal */}
			{deleteTarget && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
					<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
						<h3 className="text-base font-semibold text-slate-900">
							{t(localizationConstants.dataItDeleteConfirmTitle)}
						</h3>
						<p className="mt-2 text-sm text-slate-600">
							{t(localizationConstants.dataItDeleteConfirmDesc)}
						</p>
						<div className="mt-6 flex justify-end gap-3">
							<button
								type="button"
								onClick={onCancelDelete}
								className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
							>
								{t(localizationConstants.dataItCancel)}
							</button>
							<button
								type="button"
								onClick={onConfirmDelete}
								className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
							>
								{t(localizationConstants.dataItConfirm)}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Archive Confirmation Modal */}
			{archiveTarget && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
					<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
						<h3 className="text-base font-semibold text-slate-900">
							{t(localizationConstants.dataItArchiveConfirmTitle)}
						</h3>
						<p className="mt-2 text-sm text-slate-600">
							{t(localizationConstants.dataItArchiveConfirmDesc)}
						</p>
						<div className="mt-6 flex justify-end gap-3">
							<button
								type="button"
								onClick={onCancelArchive}
								className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
							>
								{t(localizationConstants.dataItCancel)}
							</button>
							<button
								type="button"
								onClick={onConfirmArchive}
								className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
							>
								{t(localizationConstants.dataItConfirm)}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
