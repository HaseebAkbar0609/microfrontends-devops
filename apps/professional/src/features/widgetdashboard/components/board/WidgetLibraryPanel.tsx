"use client";

import { useRef, useState } from "react";
import Draggable, { DraggableEvent } from "react-draggable";
import {
	EyeOff,
	GripVertical,
	Info,
	Lock,
	MoreVertical,
	PanelRightClose,
	Plus,
	Search,
	SquarePlus,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

interface WidgetLibraryPanelProps {
	isAdmin: boolean;
	libraryItems: WidgetItem[];
	standardItems: WidgetItem[];
	placedIds: string[];
	onAdd: (widgetId: string) => void;
	onCollapse: () => void;
	onSetStandard: (widgetId: string) => void;
	onRemoveStandard: (widgetId: string) => void;
	onHideForTeam: (widgetId: string) => void;
	onRowDrag: (clientX: number, clientY: number) => void;
	onRowDrop: (widgetId: string, clientX: number, clientY: number) => void;
	onRowDragEnd: () => void;
}

const LibraryRow = ({
	item,
	added,
	onDrag,
	onDrop,
	onDragEnd,
	children,
}: {
	item: WidgetItem;
	added: boolean;
	onDrag: (clientX: number, clientY: number) => void;
	onDrop: (widgetId: string, clientX: number, clientY: number) => void;
	onDragEnd: () => void;
	children: React.ReactNode;
}) => {
	const nodeRef = useRef<HTMLDivElement>(null);
	const [dragKey, setDragKey] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	return (
		<Draggable
			key={dragKey}
			nodeRef={nodeRef as React.RefObject<HTMLElement>}
			disabled={added}
			cancel="button"
			onStart={() => setIsDragging(true)}
			onDrag={(event: DraggableEvent) => {
				const { clientX, clientY } = event as MouseEvent;
				if (clientX !== undefined) onDrag(clientX, clientY);
			}}
			onStop={(event: DraggableEvent) => {
				setIsDragging(false);
				onDragEnd();
				const { clientX, clientY } = event as MouseEvent;
				if (clientX !== undefined) onDrop(item.id, clientX, clientY);
				setDragKey((key) => key + 1);
			}}
		>
			<div
				ref={nodeRef}
				className={cn(
					"flex items-center gap-2 rounded-md px-2 py-2",
					isDragging
						? "z-[9999] cursor-grabbing bg-slate-900 text-white shadow-2xl [&_*]:!text-white"
						: added
							? "opacity-60"
							: "cursor-grab hover:bg-slate-50",
				)}
				style={{ position: "relative" }}
			>
				{children}
			</div>
		</Draggable>
	);
};

const WidgetLibraryPanel = ({
	isAdmin,
	libraryItems,
	standardItems,
	placedIds,
	onAdd,
	onCollapse,
	onSetStandard,
	onRemoveStandard,
	onHideForTeam,
	onRowDrag,
	onRowDrop,
	onRowDragEnd,
}: WidgetLibraryPanelProps) => {
	const t = useTranslate();
	const [search, setSearch] = useState("");

	const term = search.trim().toLowerCase();
	const matches = (item: WidgetItem) =>
		term === "" || t(item.label).toLowerCase().includes(term);
	const filteredLibrary = libraryItems.filter(matches);
	const filteredStandard = standardItems.filter(matches);

	return (
		<div className="w-full rounded-md border border-slate-200 bg-white p-4 lg:w-[320px]">
			<div className="flex items-start justify-between">
				<div>
					<div className="flex items-center gap-2">
						<h2 className="text-base font-semibold text-slate-900">
							<Translate
								text={
									localizationConstants.widgetBoardLibraryTitle
								}
							/>
						</h2>
						{isAdmin && (
							<span className="rounded-sm bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
								Admin
							</span>
						)}
					</div>
					<p className="mt-0.5 text-xs text-slate-500">
						<Translate
							text={
								isAdmin
									? localizationConstants.widgetBoardLibraryAdminHint
									: localizationConstants.widgetBoardLibraryHint
							}
						/>
					</p>
				</div>
				<button
					type="button"
					onClick={onCollapse}
					aria-label={t(localizationConstants.widgetBoardLibraryTitle)}
					className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 cursor-pointer"
				>
					<PanelRightClose size={16} />
				</button>
			</div>

			<div className="relative mt-3">
				<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
				<Input
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder={t(
						localizationConstants.widgetBoardSearchWidget,
					)}
					className="h-9 rounded-md border-slate-200 pl-9 text-sm"
				/>
			</div>

			{isAdmin && (
				<div className="mt-4">
					<div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
						<Translate
							text={
								localizationConstants.widgetBoardStandardSection
							}
						/>
						<span>{standardItems.length}</span>
					</div>
					<div className="mt-2 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
						<p className="flex items-center gap-1.5 font-semibold text-slate-800">
							<Info size={13} />
							<Translate
								text={
									localizationConstants.widgetBoardStandardInfoTitle
								}
							/>
						</p>
						<p className="mt-1">
							<Translate
								text={
									localizationConstants.widgetBoardStandardInfoBody
								}
							/>
						</p>
					</div>
					<div className="mt-1">
						{filteredStandard.map((item) => (
							<div
								key={item.id}
								className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-slate-50"
							>
								<Lock size={14} className="text-slate-400" />
								<item.icon
									size={16}
									className="text-slate-600"
								/>
								<span className="flex-1 text-sm text-slate-800">
									<Translate text={item.label} />
								</span>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<button
											type="button"
											aria-label={t(item.label)}
											className="rounded-md p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
										>
											<MoreVertical size={15} />
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-64 rounded-md border border-slate-200 bg-white p-1 shadow-md"
									>
										<DropdownMenuItem
											onClick={() =>
												onRemoveStandard(item.id)
											}
											className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
										>
											<Lock className="h-4 w-4 text-slate-600" />
											<Translate
												text={
													localizationConstants.widgetBoardRemoveStandard
												}
											/>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="mt-4">
				<div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
					<Translate
						text={localizationConstants.widgetBoardAllWidgets}
					/>
					<span>{libraryItems.length}</span>
				</div>
				<div className="mt-1">
					{filteredLibrary.map((item) => {
						const added = placedIds.includes(item.id);
						return (
							<LibraryRow
								key={item.id}
								item={item}
								added={added}
								onDrag={onRowDrag}
								onDrop={onRowDrop}
								onDragEnd={onRowDragEnd}
							>
								<GripVertical
									size={14}
									className="text-slate-300"
								/>
								<item.icon
									size={16}
									className="text-slate-600"
								/>
								<span className="flex-1 text-sm text-slate-800">
									<Translate text={item.label} />
								</span>
								{added ? (
									<span className="text-xs text-slate-400">
										<Translate
											text={
												localizationConstants.widgetBoardAdded
											}
										/>
									</span>
								) : isAdmin ? (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<button
												type="button"
												aria-label={t(item.label)}
												className="rounded-md p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
											>
												<MoreVertical size={15} />
											</button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="w-64 rounded-md border border-slate-200 bg-white p-1 shadow-md"
										>
											<DropdownMenuItem
												onClick={() =>
													onSetStandard(item.id)
												}
												className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
											>
												<Lock className="h-4 w-4 text-slate-600" />
												<Translate
													text={
														localizationConstants.widgetBoardSetStandard
													}
												/>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => onAdd(item.id)}
												className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
											>
												<SquarePlus className="h-4 w-4 text-slate-600" />
												<Translate
													text={
														localizationConstants.widgetBoardAddToDashboard
													}
												/>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													onHideForTeam(item.id)
												}
												className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-red-600 focus:text-red-600"
											>
												<EyeOff className="h-4 w-4" />
												<Translate
													text={
														localizationConstants.widgetBoardHideForTeam
													}
												/>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								) : (
									<button
										type="button"
										onClick={() => onAdd(item.id)}
										aria-label={t(item.label)}
										className="rounded-md p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
									>
										<Plus size={15} />
									</button>
								)}
							</LibraryRow>
						);
					})}
				</div>
			</div>

			<p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
				<Translate
					text={
						isAdmin
							? localizationConstants.widgetBoardAdminLibraryFooter
							: localizationConstants.widgetBoardLibraryFooter
					}
				/>
			</p>
		</div>
	);
};

export default WidgetLibraryPanel;
