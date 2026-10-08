"use client";

import { useState } from "react";
import Link from "next/link";
import { Archive, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	patchProjectStatusAPIAction,
	type ProjectStatusPatchValue,
} from "@/api-actions";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

const CONFIRM_TEXT: Record<
	ProjectStatusPatchValue,
	{ title: string; description: string; action: string }
> = {
	archived: {
		title: localizationConstants.archiveConfirmTitle,
		description: localizationConstants.archiveConfirmDescription,
		action: localizationConstants.archive,
	},
	deleted: {
		title: localizationConstants.deleteProjectConfirmTitle,
		description: localizationConstants.deleteProjectConfirmDescription,
		action: localizationConstants.deleteLabel,
	},
};

interface ActiveProjectRowActionsProps {
	projectId: string;
	/** Where Edit goes: the project, or the wizard for a draft */
	editHref: string;
	onStatusChanged: () => void;
}

export function ActiveProjectRowActions({
	projectId,
	editHref,
	onStatusChanged,
}: ActiveProjectRowActionsProps) {
	const t = useTranslate();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [targetStatus, setTargetStatus] =
		useState<ProjectStatusPatchValue>("archived");
	const [isPending, setIsPending] = useState(false);
	const confirmText = CONFIRM_TEXT[targetStatus];

	function requestConfirm(status: ProjectStatusPatchValue) {
		setTargetStatus(status);
		setConfirmOpen(true);
	}

	async function handleConfirm() {
		setIsPending(true);
		try {
			// The API action shows the success / error toast itself.
			const result = await patchProjectStatusAPIAction(
				projectId,
				targetStatus,
			);
			if (result.success) {
				setConfirmOpen(false);
				onStatusChanged();
			}
		} finally {
			setIsPending(false);
		}
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						aria-label={t(localizationConstants.projectRowActionsLabel)}
						className="p-1 rounded hover:bg-slate-100 text-[#94A3B8] transition-colors"
					>
						<MoreVertical className="h-4 w-4" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-36">
					<DropdownMenuItem asChild className="gap-2 cursor-pointer py-2">
						<Link href={editHref}>
							<Pencil className="h-4 w-4 text-accent-foreground" />
							<Translate text={localizationConstants.edit} />
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 cursor-pointer py-2"
						onClick={() => requestConfirm("archived")}
					>
						<Archive className="h-4 w-4 text-accent-foreground" />
						<Translate text={localizationConstants.archive} />
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 cursor-pointer py-2 text-red-600 focus:text-red-700"
						onClick={() => requestConfirm("deleted")}
					>
						<Trash2 className="h-4 w-4 text-accent-foreground" />
						<Translate text={localizationConstants.deleteLabel} />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog
				open={confirmOpen}
				onOpenChange={(open) => {
					if (!isPending) setConfirmOpen(open);
				}}
			>
				<AlertDialogContent className="max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-lg font-semibold text-slate-800">
							<Translate text={confirmText.title} />
						</AlertDialogTitle>
						<AlertDialogDescription className="text-sm text-slate-500">
							<Translate text={confirmText.description} />
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="gap-2">
						<AlertDialogCancel className="min-w-24" disabled={isPending}>
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={isPending}
							onClick={(e) => {
								e.preventDefault();
								void handleConfirm();
							}}
							className={cn(
								"min-w-24 text-white",
								targetStatus === "deleted"
									? "bg-red-600 hover:bg-red-700"
									: "bg-slate-800 hover:bg-slate-900",
							)}
						>
							<Translate text={confirmText.action} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
