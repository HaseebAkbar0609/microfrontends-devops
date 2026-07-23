"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search } from "@/components/search/Search";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DUMMY_ADMIN_GROUPS, type AdminGroup } from "../constants";

const AVATAR_COLORS = [
	"bg-orange-200 text-orange-800",
	"bg-emerald-200 text-emerald-800",
	"bg-sky-200 text-sky-800",
	"bg-violet-200 text-violet-800",
	"bg-amber-200 text-amber-800",
	"bg-rose-200 text-rose-800",
];

function MemberAvatar({ name, index }: { name: string; index: number }) {
	const initials = name
		.split(" ")
		.map((part) => part[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
	return (
		<span
			title={name}
			className={cn(
				"flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold",
				AVATAR_COLORS[index % AVATAR_COLORS.length],
			)}
		>
			{initials}
		</span>
	);
}

function GroupCard({
	group,
	onAction,
}: {
	group: AdminGroup;
	onAction: () => void;
}) {
	const t = useTranslate();
	return (
		<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
			<div className="bg-slate-100 px-5 py-4">
				<h3 className="text-lg font-semibold text-slate-500">
					{group.name}
				</h3>
			</div>
			<div className="flex flex-col gap-6 px-5 py-5">
				<div className="flex items-center gap-3">
					<div className="flex -space-x-2">
						{group.members.map((member, index) => (
							<MemberAvatar
								key={member}
								name={member}
								index={index}
							/>
						))}
						{group.extraMembers > 0 && (
							<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[11px] font-semibold text-slate-700">
								+{group.extraMembers}
							</span>
						)}
					</div>
					<button
						type="button"
						onClick={onAction}
						aria-label={t(localizationConstants.adminUsersAddUser)}
						className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
					>
						<Plus className="h-4 w-4" />
					</button>
				</div>
				<div className="flex items-center justify-end gap-3">
					<Button
						variant="secondary"
						onClick={onAction}
						className="h-10 rounded-md bg-slate-100 px-6 text-sm font-medium text-slate-900 hover:bg-slate-200"
					>
						<Translate text={localizationConstants.adminUsersEdit} />
					</Button>
					<Button
						variant="outline"
						onClick={onAction}
						className="h-10 rounded-md border-slate-200 bg-white px-6 text-sm font-medium text-slate-900 hover:bg-slate-50"
					>
						<Translate
							text={localizationConstants.adminGroupsOpen}
						/>
					</Button>
				</div>
			</div>
		</div>
	);
}

export default function GroupsTab() {
	const t = useTranslate();
	const [search, setSearch] = useState("");
	const [groupFilter, setGroupFilter] = useState("");

	const notifyComingSoon = () =>
		showToast("info", t(localizationConstants.comingSoon));

	const filteredGroups = useMemo(() => {
		const q = search.trim().toLowerCase();
		return DUMMY_ADMIN_GROUPS.filter((group) => {
			const matchesSearch = !q || group.name.toLowerCase().includes(q);
			const matchesFilter = !groupFilter || group.id === groupFilter;
			return matchesSearch && matchesFilter;
		});
	}, [search, groupFilter]);

	const activeFilterName = DUMMY_ADMIN_GROUPS.find(
		(group) => group.id === groupFilter,
	)?.name;

	return (
		<div className="flex flex-col gap-6">
			<h2 className="text-xl font-semibold text-slate-700">
				<Translate text={localizationConstants.adminGroupsManagement} />
			</h2>

			{/* Toolbar */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<Search
					value={search}
					onChange={setSearch}
					placeholder={t(localizationConstants.search)}
					wrapperClassName="w-full max-w-[320px]"
					className="h-10"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className={cn(
								"h-10 gap-2 border-slate-200 bg-white px-4 text-sm font-normal text-slate-700 hover:bg-slate-50",
								groupFilter &&
									"border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
							)}
						>
							<Translate text={localizationConstants.filter} />
							{activeFilterName && ` · ${activeFilterName}`}
							<ChevronDown className="h-4 w-4 text-slate-500" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-[210px]">
						<DropdownMenuItem
							onClick={() => setGroupFilter("")}
							className="flex items-center justify-between"
						>
							<Translate
								text={localizationConstants.adminUsersFilterAll}
							/>
							{!groupFilter && (
								<Check className="h-3.5 w-3.5 text-blue-600" />
							)}
						</DropdownMenuItem>
						{DUMMY_ADMIN_GROUPS.map((group) => (
							<DropdownMenuItem
								key={group.id}
								onClick={() => setGroupFilter(group.id)}
								className="flex items-center justify-between"
							>
								{group.name}
								{groupFilter === group.id && (
									<Check className="h-3.5 w-3.5 text-blue-600" />
								)}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
				<div className="flex flex-1 justify-end">
					<Button
						onClick={notifyComingSoon}
						className="h-10 gap-1.5 rounded-md bg-[#18181B] px-4 text-sm font-medium text-white hover:bg-[#18181B]/90"
					>
						<Plus className="h-4 w-4" />
						<Translate
							text={localizationConstants.adminGroupsCreate}
						/>
					</Button>
				</div>
			</div>

			{/* Group cards */}
			{filteredGroups.length > 0 ? (
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
					{filteredGroups.map((group) => (
						<GroupCard
							key={group.id}
							group={group}
							onAction={notifyComingSoon}
						/>
					))}
				</div>
			) : (
				<p className="py-16 text-center text-sm text-slate-500">
					<Translate
						text={localizationConstants.adminGroupsNoGroupsFound}
					/>
				</p>
			)}
		</div>
	);
}
