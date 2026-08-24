"use client";

import { useState } from "react";
import { Expand, Lock, MoreVertical, Move, Trash2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

interface BoardWidgetCardProps {
	widget: WidgetProps;
	locked?: boolean;
	editMode?: boolean;
	onMove?: () => void;
	onRemove?: () => void;
}

const BoardWidgetCard = ({
	widget,
	locked,
	editMode,
	onMove,
	onRemove,
}: BoardWidgetCardProps) => {
	const t = useTranslate();
	const [fullscreenOpen, setFullscreenOpen] = useState(false);
	const Icon = widget.icon;

	return (
		<div
			className={cn(
				"relative flex h-full min-h-[281px] flex-col rounded-sm bg-slate-100 px-3 py-3",
				editMode && !locked && "cursor-grab",
			)}
		>
			<div className="flex items-start justify-between">
				<div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white">
					<Icon size={20} strokeWidth={2} className="text-slate-700" />
				</div>
				<div className="flex items-center gap-1.5">
					{locked && (
						<span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600">
							<Lock size={12} />
							<Translate
								text={localizationConstants.offerBoardLocked}
							/>
						</span>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								aria-label={t(widget.title)}
								className="rounded-md p-1 text-slate-500 hover:text-slate-700 cursor-pointer"
							>
								<MoreVertical size={18} />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-72 rounded-md border border-slate-200 bg-white p-1 shadow-md"
						>
							<DropdownMenuItem
								onClick={() => setFullscreenOpen(true)}
								className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
							>
								<Expand className="h-4 w-4 text-slate-600" />
								<Translate
									text={
										localizationConstants.offerBoardOpenFullscreen
									}
								/>
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={locked}
								onClick={() => onMove?.()}
								className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
							>
								<Move className="h-4 w-4 text-slate-600" />
								<Translate
									text={
										localizationConstants.offerBoardMoveWidget
									}
								/>
								{locked && (
									<Lock className="ml-auto h-3.5 w-3.5 text-slate-400" />
								)}
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={locked}
								onClick={() => onRemove?.()}
								className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
							>
								<Trash2 className="h-4 w-4 text-slate-600" />
								<Translate
									text={
										localizationConstants.offerBoardRemoveWidget
									}
								/>
								{locked && (
									<Lock className="ml-auto h-3.5 w-3.5 text-slate-400" />
								)}
							</DropdownMenuItem>
							{locked && (
								<p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500">
									<Translate
										text={
											localizationConstants.offerBoardLockedExplainer
										}
									/>
								</p>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="mt-2">
				<h3 className="text-base font-semibold text-slate-900">
					<Translate text={widget.title} />
				</h3>
				{widget.subtitle && (
					<div className="mt-1 text-sm text-slate-500">
						{widget.subtitle}
					</div>
				)}
				{widget.content && <div className="mt-1">{widget.content}</div>}
			</div>

			<Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
				<DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Icon size={20} className="text-slate-700" />
							<Translate text={widget.title} />
						</DialogTitle>
					</DialogHeader>
					{widget.content && (
						<div className="mt-2">{widget.content}</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default BoardWidgetCard;
