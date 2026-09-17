"use client";

import { useState, useMemo } from "react";
import {
	ChevronDown,
	ChevronRight,
	Eye,
	MoreHorizontal,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/toast";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { DesignOrgGroupId, DesignOrgMember } from "./types/designProjektInfo";

interface KontaktpersonerTableProps {
	member: DesignOrgMember;
}

function KontaktpersonerTable({ member }: KontaktpersonerTableProps) {
	return (
		<tr>
			<td colSpan={9} className="bg-slate-50 p-0">
				<div className="px-6 py-3">
					<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
						<Translate text={localizationConstants.designOrgKontaktpersoner} />
					</p>
					<div className="overflow-x-auto">
						<table className="min-w-full">
							<thead>
								<tr className="border-b border-slate-200">
									{(
										[
											localizationConstants.agreementDetailFornamn,
											localizationConstants.agreementDetailEfternamn,
											localizationConstants.mailHeader,
											localizationConstants.phoneHeader,
											localizationConstants.roleLabel,
										] as const
									).map((key) => (
										<th
											key={key}
											className="py-2 pr-6 text-left text-xs font-medium uppercase tracking-wide text-slate-500"
										>
											<Translate text={key} />
										</th>
									))}
									<th className="w-10" />
								</tr>
							</thead>
							<tbody>
								{member.kontaktpersoner.map((kp) => (
									<tr
										key={kp.id}
										className="border-b border-slate-100 last:border-0"
									>
										<td className="py-2 pr-6 text-sm text-slate-700">
											{kp.fornamn}
										</td>
										<td className="py-2 pr-6 text-sm text-slate-700">
											{kp.efternamn}
										</td>
										<td className="py-2 pr-6 text-sm text-slate-700">
											{kp.mail}
										</td>
										<td className="py-2 pr-6 text-sm text-slate-700">
											{kp.mobil}
										</td>
										<td className="py-2 pr-6 text-sm text-slate-700">
											{kp.roll}
										</td>
										<td className="py-2">
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="h-7 w-7 cursor-pointer text-slate-400 hover:text-slate-700"
											>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</td>
		</tr>
	);
}

interface OrgTableRowProps {
	member: DesignOrgMember;
	isExpanded: boolean;
	onToggle: () => void;
	onView: () => void;
	onRemove: () => void;
}

function OrgTableRow({
	member,
	isExpanded,
	onToggle,
	onView,
	onRemove,
}: OrgTableRowProps) {
	const t = useTranslate();
	const hasKontaktpersoner = member.kontaktpersoner.length > 0;

	return (
		<>
			<tr
				className={
					hasKontaktpersoner
						? "cursor-pointer border-b border-slate-100 hover:bg-slate-50"
						: "border-b border-slate-100"
				}
				onClick={hasKontaktpersoner ? onToggle : undefined}
			>
				<td className="px-4 py-3 text-sm text-slate-700">
					<div className="flex items-center gap-2">
						{hasKontaktpersoner ? (
							isExpanded ? (
								<ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
							) : (
								<ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
							)
						) : (
							<span className="h-4 w-4 shrink-0" />
						)}
						{member.foretag}
					</div>
				</td>
				<td className="px-4 py-3 text-sm text-slate-700">{member.roll}</td>
				<td className="px-4 py-3 text-sm text-slate-700">{member.kategori}</td>
				<td className="px-4 py-3 text-sm text-slate-700">{member.address}</td>
				<td className="px-4 py-3 text-sm text-slate-700">{member.postNr}</td>
				<td className="px-4 py-3 text-sm text-slate-700">{member.ort}</td>
				<td className="px-4 py-3 text-sm text-slate-700">{member.kontakt}</td>
				<td className="px-4 py-3 text-sm text-slate-700">{member.mail}</td>
				<td
					className="px-4 py-3"
					onClick={(e) => e.stopPropagation()}
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-8 w-8 cursor-pointer rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
								aria-label={`${t(localizationConstants.actions)} ${member.foretag}`}
							>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem
								className="cursor-pointer gap-2"
								onClick={() => setTimeout(onView, 0)}
							>
								<Eye className="h-4 w-4" />
								<Translate text={localizationConstants.viewLabel} />
							</DropdownMenuItem>
							<DropdownMenuItem
								className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
								onClick={() => setTimeout(onRemove, 0)}
							>
								<Trash2 className="h-4 w-4" />
								<Translate text={localizationConstants.deleteLabel} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</td>
			</tr>
			{isExpanded && hasKontaktpersoner && (
				<KontaktpersonerTable member={member} />
			)}
		</>
	);
}

interface OrgGroupSectionProps {
	groupId: DesignOrgGroupId;
	titleKey: TranslationKeys;
	rows: DesignOrgMember[];
	expandedId: string | null;
	onToggleExpand: (id: string) => void;
	onView: (member: DesignOrgMember) => void;
	onRemove: (id: string) => void;
}

function OrgGroupSection({
	titleKey,
	rows,
	expandedId,
	onToggleExpand,
	onView,
	onRemove,
}: OrgGroupSectionProps) {
	return (
		<CollapsibleSection
			className="overflow-hidden rounded-lg border border-slate-200 bg-white"
			headerClassName="mb-0 h-14 rounded-none border-b border-slate-200 bg-slate-100 px-4 pb-0 text-sm font-semibold text-slate-900 hover:bg-slate-100"
			contentClassName="[&>div]:gap-0"
			title={<Translate text={titleKey} />}
		>
			<div className="overflow-x-auto">
				<table className="min-w-full">
					<thead className="bg-slate-50">
						<tr>
							{(
								[
									localizationConstants.orgColForetag,
									localizationConstants.orgColRoll,
									localizationConstants.orgColKategori,
									localizationConstants.orgColAddress,
									localizationConstants.orgColPostNr,
									localizationConstants.orgColOrt,
									localizationConstants.orgColKontakt,
									localizationConstants.orgColMail,
								] as const
							).map((key) => (
								<th
									key={key}
									className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500"
								>
									<Translate text={key} />
								</th>
							))}
							<th className="w-12 px-4 py-3" />
						</tr>
					</thead>
					<tbody>
						{rows.map((member) => (
							<OrgTableRow
								key={member.id}
								member={member}
								isExpanded={expandedId === member.id}
								onToggle={() => onToggleExpand(member.id)}
								onView={() => onView(member)}
								onRemove={() => onRemove(member.id)}
							/>
						))}
					</tbody>
				</table>
			</div>
		</CollapsibleSection>
	);
}

const ORG_GROUPS: { id: DesignOrgGroupId; titleKey: TranslationKeys }[] = [
	{ id: "bestallare", titleKey: localizationConstants.orgGroupBestallare },
	{ id: "arkitekt", titleKey: localizationConstants.orgGroupArkitekt },
	{
		id: "byggentreprenor",
		titleKey: localizationConstants.orgGroupByggentreprenor,
	},
	{ id: "elektriker", titleKey: localizationConstants.orgGroupElektriker },
];

export interface DesignOrgTabProps {
	initialMembers: DesignOrgMember[];
}

export function DesignOrgTab({ initialMembers }: DesignOrgTabProps) {
	const t = useTranslate();
	const [members, setMembers] = useState(initialMembers);
	const [search, setSearch] = useState("");
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const filtered = useMemo(() => {
		if (!search.trim()) return members;
		const q = search.toLowerCase();
		return members.filter(
			(m) =>
				m.foretag.toLowerCase().includes(q) ||
				m.roll.toLowerCase().includes(q) ||
				m.kontakt.toLowerCase().includes(q) ||
				m.mail.toLowerCase().includes(q),
		);
	}, [members, search]);

	const groupRows = (groupId: DesignOrgGroupId) =>
		filtered.filter((m) => m.group === groupId);

	const handleToggleExpand = (id: string) =>
		setExpandedId((prev) => (prev === id ? null : id));

	const handleView = (member: DesignOrgMember) =>
		setExpandedId((prev) => (prev === member.id ? null : member.id));

	const handleRemove = (id: string) =>
		setMembers((prev) => prev.filter((m) => m.id !== id));

	const handleCreate = () =>
		showToast("info", t(localizationConstants.designProjectsCreateToast));

	const hasResults = ORG_GROUPS.some((g) => groupRows(g.id).length > 0);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="relative w-64 max-w-full">
					<Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t(localizationConstants.search)}
						className="h-9 rounded-none border-0 border-b border-slate-200 bg-transparent pl-6 text-sm shadow-none focus-visible:border-slate-400 focus-visible:ring-0"
					/>
				</div>
				<Button
					type="button"
					onClick={handleCreate}
					className="h-9 gap-2 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.designOrgSkapaBtn} />
				</Button>
			</div>

			{hasResults ? (
				<div className="flex flex-col gap-3">
					{ORG_GROUPS.map((group) => {
						const rows = groupRows(group.id);
						if (rows.length === 0) return null;
						return (
							<OrgGroupSection
								key={group.id}
								groupId={group.id}
								titleKey={group.titleKey}
								rows={rows}
								expandedId={expandedId}
								onToggleExpand={handleToggleExpand}
								onView={handleView}
								onRemove={handleRemove}
							/>
						);
					})}
				</div>
			) : (
				<p className="rounded-lg border border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
					<Translate
						text={
							search
								? localizationConstants.designOrgNoMatches
								: localizationConstants.designOrgEmpty
						}
					/>
				</p>
			)}
		</div>
	);
}

export default DesignOrgTab;
