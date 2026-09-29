"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { CASE_STATUS_META } from "../../../constants/cases.constants";
import type { CaseStatus } from "../../../types/cases.types";
import { CaseStatusBadge, CaseStatusConfirmDialog } from "../shared";

/** Every status a case can take, in the order the menu offers them. */
const STATUSES = Object.keys(CASE_STATUS_META) as CaseStatus[];

export interface CaseStatusMenuProps {
	status: CaseStatus;
	onStatusChange: (status: CaseStatus) => void;
}

/**
 * The coloured pill that also changes the status.
 *
 * It wears the status's own colour and says its own name, from the same map
 * the row badge reads, and every change goes through a confirmation — a case
 * moving to Stängd is not something to do by a stray click.
 */
export function CaseStatusMenu({ status, onStatusChange }: CaseStatusMenuProps) {
	const [open, setOpen] = useState(false);
	const [pending, setPending] = useState<CaseStatus | null>(null);
	const meta = CASE_STATUS_META[status] ?? CASE_STATUS_META.not_started;

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setOpen((previous) => !previous)}
				aria-haspopup="menu"
				aria-expanded={open}
				className={`h-9 px-4 ${meta.bgClass} ${meta.hoverClass} ${meta.textClass} text-xs font-semibold rounded-lg flex items-center gap-2 shadow-2xs cursor-pointer transition-colors`}
			>
				<span>
					<Translate text={meta.labelKey} />
				</span>
				<ChevronDown className="w-3.5 h-3.5" aria-hidden />
			</button>

			{open && (
				<div
					role="menu"
					className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1.5 text-xs"
				>
					<div className="px-3 py-1 font-semibold text-slate-400 text-[10px] uppercase">
						<Translate text={localizationConstants.casesDetailChangeStatus} />
					</div>
					{STATUSES.map((option) => (
						<button
							key={option}
							type="button"
							role="menuitem"
							onClick={() => {
								setOpen(false);
								if (option !== status) setPending(option);
							}}
							className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
						>
							<CaseStatusBadge status={option} />
							{status === option && <span className="text-[10px] text-slate-500 font-bold">✓</span>}
						</button>
					))}
				</div>
			)}

			<CaseStatusConfirmDialog
				isOpen={pending !== null}
				newStatus={pending}
				onClose={() => setPending(null)}
				onConfirm={() => {
					if (pending) onStatusChange(pending);
					setPending(null);
				}}
			/>
		</div>
	);
}

export default CaseStatusMenu;
