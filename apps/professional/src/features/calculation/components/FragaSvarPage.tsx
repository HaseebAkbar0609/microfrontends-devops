"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
	ChevronDown,
	ChevronRight,
	MoreVertical,
	Plus,
	Search,
	Send,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { QACard, QABadgeType, QAStatus } from "../types/fragaSvar";

const BADGE_CLASSES: Record<string, string> = {
	ue: "bg-[#0891B2] text-white",
	bestellare: "bg-[#059669] text-white",
	fraga: "bg-[#EAB308] text-white",
};

const BADGE_LABEL_KEYS: Record<string, string> = {
	ue: localizationConstants.calcQABadgeUE,
	bestellare: localizationConstants.calcQABadgeBestellare,
	fraga: localizationConstants.calcQABadgeFraga,
};


const COLUMN_LABEL_KEYS: Record<QAStatus, string> = {
	new: localizationConstants.calcQANew,
	opened: localizationConstants.calcQAOpened,
	answered: localizationConstants.calcQAAnswered,
};

const FUNKTION_OPTIONS = ["Bygg", "El", "Mark", "Måleri", "Ventilation", "VVS"];

const COLUMNS: QAStatus[] = ["new", "opened", "answered"];

const ALL_BADGE_TYPES: QABadgeType[] = ["ue", "bestellare", "fraga"];

function BadgeChip({ badge }: { badge: string }) {
	const t = useTranslate();
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
				BADGE_CLASSES[badge] ?? "bg-slate-100 text-slate-700",
			)}
		>
			{t(BADGE_LABEL_KEYS[badge] ?? localizationConstants.calcQABadgeFraga)}
		</span>
	);
}


interface QuestionCardProps {
	card: QACard;
	replyText: string;
	onReplyChange: (text: string) => void;
	onDelete: (id: string) => void;
	onArchive: (id: string) => void;
}

function QuestionCard({
	card,
	replyText,
	onReplyChange,
	onDelete,
	onArchive,
}: QuestionCardProps) {
	const t = useTranslate();
	return (
		<div className="rounded-lg border border-[#E5E5E5] bg-white">
			<div className="flex items-start gap-3 p-4">
				<Image
					src="/assets/images/Avatar.svg"
					alt={card.authorName}
					width={36}
					height={36}
					className="h-9 w-9 shrink-0 rounded-full"
				/>
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-2">
						<div className="flex flex-wrap items-center gap-2">
							<span className="text-sm font-semibold text-zinc-950">
								{card.authorName}
							</span>
							<BadgeChip badge={card.badge} />
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-400 hover:bg-slate-100"
								>
									<MoreVertical className="h-4 w-4" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem className="cursor-pointer">
									<Translate
										text={localizationConstants.calcQAMarkAsRead}
									/>
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer"
									onSelect={() => onArchive(card.id)}
								>
									<Translate
										text={localizationConstants.calcQAArchivera}
									/>
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer text-red-600 focus:text-red-600"
									onSelect={() => onDelete(card.id)}
								>
									<Translate text={localizationConstants.calcQADelete} />
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<p className="mt-0.5 text-xs text-slate-400">
						{card.company} · {card.timestamp}
					</p>
					<p className="mt-2 text-sm text-zinc-800">{card.text}</p>
				</div>
			</div>

			{card.replies.length > 0 && (
				<div className="space-y-3 border-t border-[#E5E5E5] px-4 py-3">
					{card.replies.map((reply) => (
						<div key={reply.id} className="flex items-start gap-2">
							<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
								{reply.authorInitials}
							</span>
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<span className="text-xs font-semibold text-zinc-950">
										{reply.authorName}
									</span>
									<span className="text-xs text-slate-400">
										{reply.timestamp}
									</span>
								</div>
								<p className="mt-0.5 text-xs text-zinc-700">{reply.text}</p>
							</div>
						</div>
					))}
				</div>
			)}

			<div className="flex items-center gap-2 border-t border-[#E5E5E5] px-4 py-3">
				<Input
					value={replyText}
					onChange={(e) => onReplyChange(e.target.value)}
					placeholder={t(localizationConstants.calcQALeaveComment)}
					className="h-9 flex-1 border-slate-200 text-sm shadow-none focus-visible:ring-0"
				/>
				<button
					type="button"
					className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-[#111721] text-white hover:bg-[#111721]/90"
				>
					<Send className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}

interface KanbanColumnProps {
	status: QAStatus;
	cards: QACard[];
	collapsed: boolean;
	onToggleCollapse: () => void;
	replyTexts: Record<string, string>;
	onReplyChange: (id: string, text: string) => void;
	onDelete: (id: string) => void;
	onArchive: (id: string) => void;
}

function KanbanColumn({
	status,
	cards,
	collapsed,
	onToggleCollapse,
	replyTexts,
	onReplyChange,
	onDelete,
	onArchive,
}: KanbanColumnProps) {
	const t = useTranslate();
	return (
		<div className="flex min-w-0 flex-1 flex-col gap-3">
			<div className="flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-3 py-3">
				<button
					type="button"
					onClick={onToggleCollapse}
					className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-zinc-400 hover:bg-slate-100"
				>
					{collapsed ? (
						<ChevronRight className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</button>
				<span className="flex-1 text-sm font-semibold text-zinc-950">
					{t(COLUMN_LABEL_KEYS[status])}
				</span>
				<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-xs font-medium text-slate-600">
					{cards.length}
				</span>
			</div>

			{!collapsed && (
				<div className="flex flex-col gap-3">
					{cards.map((card) => (
						<QuestionCard
							key={card.id}
							card={card}
							replyText={replyTexts[card.id] ?? ""}
							onReplyChange={(text) => onReplyChange(card.id, text)}
							onDelete={onDelete}
							onArchive={onArchive}
						/>
					))}
					{cards.length === 0 && (
						<div className="rounded-lg border border-dashed border-[#E5E5E5] py-8 text-center text-sm text-slate-400">
							{t(localizationConstants.calcQANoQuestions)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

interface NyFragaModalProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (card: QACard) => void;
}

function NyFragaModal({ open, onClose, onSubmit }: NyFragaModalProps) {
	const t = useTranslate();
	const [typ, setTyp] = useState<"projekt" | "order">("projekt");
	const [funktion, setFunktion] = useState("");
	const [beskrivning, setBeskrivning] = useState("");

	const handleClose = () => {
		setTyp("projekt");
		setFunktion("");
		setBeskrivning("");
		onClose();
	};

	const handleSubmit = () => {
		if (!beskrivning.trim()) return;
		const now = new Date();
		const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
		onSubmit({
			id: `qa-${Date.now()}`,
			authorName: "Admin",
			authorInitials: "AD",
			company: typ === "projekt" ? "Projekt" : "Order",
			badge: "fraga",
			timestamp,
			text: funktion ? `[${funktion}] ${beskrivning.trim()}` : beskrivning.trim(),
			status: "new",
			replies: [],
		});
		handleClose();
	};

	return (
		<Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
			<DialogContent className="max-w-lg rounded-lg bg-white p-6">
				<div className="flex items-center justify-between">
					<DialogTitle className="text-lg font-semibold text-zinc-950">
						<Translate text={localizationConstants.calcQANewDialogTitle} />
					</DialogTitle>
					<button
						type="button"
						onClick={handleClose}
						className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-zinc-400 hover:bg-slate-100"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<div className="mt-4 flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-zinc-950">
							<Translate text={localizationConstants.calcQATyp} />
						</label>
						<div className="flex gap-6">
							<label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
								<input
									type="radio"
									name="qa-typ"
									value="projekt"
									checked={typ === "projekt"}
									onChange={() => setTyp("projekt")}
									className="cursor-pointer accent-zinc-900"
								/>
								<Translate text={localizationConstants.calcQATypProjekt} />
							</label>
							<label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
								<input
									type="radio"
									name="qa-typ"
									value="order"
									checked={typ === "order"}
									onChange={() => setTyp("order")}
									className="cursor-pointer accent-zinc-900"
								/>
								<Translate text={localizationConstants.calcQATypOrder} />
							</label>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-zinc-950">
							<Translate text={localizationConstants.calcQAFunktion} />
						</label>
						<Select value={funktion} onValueChange={setFunktion}>
							<SelectTrigger className="h-10 border-slate-200 text-sm">
								<SelectValue
									placeholder={t(
										localizationConstants.calcQAValjFunktion,
									)}
								/>
							</SelectTrigger>
							<SelectContent>
								{FUNKTION_OPTIONS.map((opt) => (
									<SelectItem key={opt} value={opt}>
										{opt}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-zinc-950">
							<Translate text={localizationConstants.calcQABeskrivning} />
						</label>
						<Textarea
							value={beskrivning}
							onChange={(e) => setBeskrivning(e.target.value)}
							rows={4}
							className="resize-none text-sm"
						/>
					</div>
				</div>

				<div className="mt-6 flex justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={handleClose}
						className="h-10 cursor-pointer border-slate-200 px-6 text-sm"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="button"
						onClick={handleSubmit}
						disabled={!beskrivning.trim()}
						className="h-10 cursor-pointer gap-2 bg-[#111721] px-6 text-sm text-white hover:bg-[#111721]/90 disabled:opacity-50"
					>
						<Translate text={localizationConstants.calcQASkicka} />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

interface FilterPanelProps {
	companies: string[];
	activeCompanies: string[];
	activeBadges: QABadgeType[];
	onToggleCompany: (c: string) => void;
	onToggleBadge: (b: QABadgeType) => void;
	onClose: () => void;
}

function FilterPanel({
	companies,
	activeCompanies,
	activeBadges,
	onToggleCompany,
	onToggleBadge,
	onClose,
}: FilterPanelProps) {
	const t = useTranslate();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				onClose();
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [onClose]);

	return (
		<div
			ref={ref}
			className="absolute left-0 top-full z-20 mt-1 w-60 rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
		>
			<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
				<Translate text={localizationConstants.calcQAForetagFilter} />
			</p>
			{companies.map((company) => (
				<label
					key={company}
					className="flex cursor-pointer items-center gap-2 rounded px-1 py-1.5 text-sm text-zinc-700 hover:bg-slate-50"
				>
					<input
						type="checkbox"
						checked={activeCompanies.includes(company)}
						onChange={() => onToggleCompany(company)}
						className="cursor-pointer accent-zinc-900"
					/>
					{company}
				</label>
			))}

			<p className="mb-2 mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
				{t(localizationConstants.calcQATyp)}
			</p>
			{ALL_BADGE_TYPES.map((badge) => (
				<label
					key={badge}
					className="flex cursor-pointer items-center gap-2 rounded px-1 py-1.5 text-sm text-zinc-700 hover:bg-slate-50"
				>
					<input
						type="checkbox"
						checked={activeBadges.includes(badge)}
						onChange={() => onToggleBadge(badge)}
						className="cursor-pointer accent-zinc-900"
					/>
					{t(BADGE_LABEL_KEYS[badge])}
				</label>
			))}
		</div>
	);
}

interface FragaSvarPageProps {
	calcId: string;
	cards: QACard[];
}

export function FragaSvarPage({
	calcId: _calcId,
	cards: initialCards,
}: FragaSvarPageProps) {
	const t = useTranslate();
	const [activeTab, setActiveTab] = useState<"all" | "archive">("all");
	const [showNewModal, setShowNewModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterOpen, setFilterOpen] = useState(false);
	const [activeCompanies, setActiveCompanies] = useState<string[]>([]);
	const [activeBadges, setActiveBadges] = useState<QABadgeType[]>([]);
	const [collapsedColumns, setCollapsedColumns] = useState<Set<QAStatus>>(
		new Set(),
	);
	const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
	const [cards, setCards] = useState<QACard[]>(initialCards);

	const allCompanies = useMemo(
		() => [...new Set(cards.map((c) => c.company))].sort(),
		[cards],
	);

	const filteredCards = useMemo(() => {
		return cards.filter((c) => {
			if (searchQuery) {
				const q = searchQuery.toLowerCase();
				if (
					!c.authorName.toLowerCase().includes(q) &&
					!c.company.toLowerCase().includes(q) &&
					!c.text.toLowerCase().includes(q)
				)
					return false;
			}
			if (activeCompanies.length > 0 && !activeCompanies.includes(c.company))
				return false;
			if (activeBadges.length > 0 && !activeBadges.includes(c.badge))
				return false;
			return true;
		});
	}, [cards, searchQuery, activeCompanies, activeBadges]);

	const cardsByStatus = useMemo(() => {
		const map: Record<QAStatus, QACard[]> = {
			new: [],
			opened: [],
			answered: [],
		};
		for (const c of filteredCards) map[c.status].push(c);
		return map;
	}, [filteredCards]);

	const activeChips = useMemo(() => {
		const chips: Array<{ type: "company" | "badge"; value: string }> = [];
		for (const c of activeCompanies) chips.push({ type: "company", value: c });
		for (const b of activeBadges) chips.push({ type: "badge", value: b });
		return chips;
	}, [activeCompanies, activeBadges]);

	function toggleColumn(status: QAStatus) {
		setCollapsedColumns((prev) => {
			const next = new Set(prev);
			if (next.has(status)) next.delete(status);
			else next.add(status);
			return next;
		});
	}

	function toggleCompany(company: string) {
		setActiveCompanies((prev) =>
			prev.includes(company)
				? prev.filter((c) => c !== company)
				: [...prev, company],
		);
	}

	function toggleBadge(badge: QABadgeType) {
		setActiveBadges((prev) =>
			prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge],
		);
	}

	function removeChip(chip: { type: "company" | "badge"; value: string }) {
		if (chip.type === "company") toggleCompany(chip.value);
		else toggleBadge(chip.value as QABadgeType);
	}

	function clearFilters() {
		setActiveCompanies([]);
		setActiveBadges([]);
	}

	function handleReplyChange(id: string, text: string) {
		setReplyTexts((prev) => ({ ...prev, [id]: text }));
	}

	function handleAddCard(card: QACard) {
		setCards((prev) => [card, ...prev]);
	}

	function handleDelete(id: string) {
		setCards((prev) => prev.filter((c) => c.id !== id));
	}

	function handleArchive(id: string) {
		setCards((prev) => prev.filter((c) => c.id !== id));
	}

	const hasActiveFilters = activeChips.length > 0;

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold text-zinc-950">
					<Translate text={localizationConstants.calcQATitle} />
				</h1>
				<Button
					type="button"
					onClick={() => setShowNewModal(true)}
					className="h-10 cursor-pointer gap-2 bg-[#111721] text-sm text-white hover:bg-[#111721]/90"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.calcQANewQuestion} />
				</Button>
			</div>

			{/* Tab bar */}
			<div className="flex gap-1 border-b border-slate-200">
				{(["all", "archive"] as const).map((tab) => (
					<button
						key={tab}
						type="button"
						onClick={() => setActiveTab(tab)}
						className={cn(
							"cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors",
							activeTab === tab
								? "border-b-2 border-zinc-950 text-zinc-950"
								: "text-slate-500 hover:text-zinc-950",
						)}
					>
						{tab === "all"
							? t(localizationConstants.calcQAAll)
							: t(localizationConstants.calcQAArchive)}
					</button>
				))}
			</div>

			{/* Search + filter toolbar */}
			<div className="flex flex-wrap items-center gap-3">
				<div className="relative">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
					<Input
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder={t(localizationConstants.calcQASearchPlaceholder)}
						className="h-10 w-72 border-slate-200 pl-9 text-sm shadow-none focus-visible:ring-0"
					/>
				</div>

				<div className="relative">
					<Button
						type="button"
						variant="outline"
						onClick={() => setFilterOpen((v) => !v)}
						className={cn(
							"h-10 cursor-pointer gap-1.5 border-slate-200 text-sm",
							hasActiveFilters && "border-zinc-900 bg-zinc-50",
						)}
					>
						<Translate text={localizationConstants.calcQAFilter} />
						{hasActiveFilters && (
							<span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">
								{activeChips.length}
							</span>
						)}
						<ChevronDown className="h-4 w-4" />
					</Button>

					{filterOpen && (
						<FilterPanel
							companies={allCompanies}
							activeCompanies={activeCompanies}
							activeBadges={activeBadges}
							onToggleCompany={toggleCompany}
							onToggleBadge={toggleBadge}
							onClose={() => setFilterOpen(false)}
						/>
					)}
				</div>
			</div>

			{/* Active filter chips */}
			{hasActiveFilters && (
				<div className="flex flex-wrap items-center gap-2">
					{activeChips.map((chip) => (
						<button
							key={`${chip.type}-${chip.value}`}
							type="button"
							onClick={() => removeChip(chip)}
							className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-zinc-700 hover:bg-slate-50"
						>
							{chip.type === "badge"
								? t(BADGE_LABEL_KEYS[chip.value])
								: chip.value}
							<X className="h-3 w-3 text-slate-400" />
						</button>
					))}
					<button
						type="button"
						onClick={clearFilters}
						className="cursor-pointer text-xs text-slate-400 underline hover:text-zinc-950"
					>
						Reset
					</button>
				</div>
			)}

			{/* Kanban board */}
			<div className="flex gap-4">
				{COLUMNS.map((status) => (
					<KanbanColumn
						key={status}
						status={status}
						cards={cardsByStatus[status]}
						collapsed={collapsedColumns.has(status)}
						onToggleCollapse={() => toggleColumn(status)}
						replyTexts={replyTexts}
						onReplyChange={handleReplyChange}
						onDelete={handleDelete}
						onArchive={handleArchive}
					/>
				))}
			</div>

			<NyFragaModal
				open={showNewModal}
				onClose={() => setShowNewModal(false)}
				onSubmit={handleAddCard}
			/>
		</div>
	);
}
