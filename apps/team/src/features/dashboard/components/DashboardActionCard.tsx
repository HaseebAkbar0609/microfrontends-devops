"use client";

import { Check, X } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { Button } from "@/components/ui/button";

interface DashboardActionCardProps {
	saveLabel: string;
	discardLabel: string;
	onSave?: () => void;
	onDiscard?: () => void;
}

export default function DashboardActionCard({
	saveLabel,
	discardLabel,
	onSave,
	onDiscard,
}: DashboardActionCardProps) {
	return (
		<div className="rounded-md border border-slate-200 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.06)]">
			<div className="flex flex-col gap-3">
				<Button
					type="button"
					variant="ghost"
					onClick={onSave}
					className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 py-2 text-sm font-semibold text-white cursor-pointer"
				>
					<Check size={16} />
					<Translate text={saveLabel} />
				</Button>
				<Button
					type="button"
					variant="ghost"
					onClick={onDiscard}
					className="flex w-full items-center justify-center gap-2 rounded-md bg-app-secondary py-2 text-sm font-semibold text-slate-700 cursor-pointer"
				>
					<X size={16} />
					<Translate text={discardLabel} />
				</Button>
			</div>
		</div>
	);
}
