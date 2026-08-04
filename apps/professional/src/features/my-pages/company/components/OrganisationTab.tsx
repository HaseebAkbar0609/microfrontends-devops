"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { OrgNode } from "../constants/mockData";
import {
	getOrganisationRoot,
	listCompanyContacts,
} from "../services/companyService";

const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");

const OrgCard = ({ node }: { node: OrgNode }) => (
	<div className="flex w-40 flex-col items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50/60 px-3 py-4 text-center">
		<span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-500">
			{initials(node.name)}
		</span>
		<p className="text-sm font-semibold text-slate-900">{node.name}</p>
		<span
			className={cn(
				"rounded-md border px-2 py-0.5 text-[11px] font-medium",
				node.roleClass,
			)}
		>
			{node.role}
		</span>
		<p className="w-full truncate text-xs text-slate-500">{node.email}</p>
	</div>
);

const Stub = () => <div className="mx-auto h-6 w-px bg-slate-300" />;

const OrgBranch = ({ node }: { node: OrgNode }) => (
	<div className="flex flex-col items-center">
		<OrgCard node={node} />
		{node.children && node.children.length > 0 && (
			<>
				<Stub />
				{node.children.length > 1 && (
					<div className="relative h-px w-full">
						<div className="absolute inset-y-0 left-20 right-20 bg-slate-300" />
					</div>
				)}
				<div className="flex flex-nowrap items-start justify-center gap-6">
					{node.children.map((child) => (
						<div key={child.id} className="flex flex-none flex-col">
							<Stub />
							<OrgBranch node={child} />
						</div>
					))}
				</div>
			</>
		)}
	</div>
);

const OrganisationTab = () => {
	const t = useTranslate();
	const [search, setSearch] = useState("");
	const contacts = useMemo(() => {
		const term = search.trim().toLowerCase();
		const all = listCompanyContacts();
		if (!term) return all;
		return all.filter(
			(contact) =>
				contact.name.toLowerCase().includes(term) ||
				contact.title.toLowerCase().includes(term) ||
				contact.department.toLowerCase().includes(term),
		);
	}, [search]);
	const root = getOrganisationRoot();

	const columns = [
		{ labelKey: localizationConstants.companyOrgColTitle, sortable: true },
		{ labelKey: localizationConstants.companyOrgColPerson, sortable: true },
		{
			labelKey: localizationConstants.companyOrgColDepartment,
			sortable: true,
		},
		{ labelKey: localizationConstants.companyInfoCity, sortable: true },
		{
			labelKey: localizationConstants.companyOrgColMobile,
			sortable: false,
		},
		{ labelKey: localizationConstants.companyInfoEmail, sortable: false },
	];

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-center gap-4">
				<div className="relative w-full max-w-xs">
					<Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
					<Input
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder={t(localizationConstants.search)}
						className="h-9 rounded-none border-0 border-b border-slate-200 bg-transparent pl-6 text-sm shadow-none focus-visible:border-slate-400 focus-visible:ring-0"
					/>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							className="h-9 gap-1.5 rounded-md border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
						>
							<Translate text={localizationConstants.filter} />
							<ChevronDown className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-40 rounded-md border border-slate-200 bg-white p-1 shadow-md"
					>
						<DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700">
							<Translate
								text={localizationConstants.licensesModuleAll}
							/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="w-full overflow-x-auto rounded-md border border-slate-200 bg-white">
				<Table className="w-full min-w-[48rem]">
					<TableHeader>
						<TableRow className="border-b border-slate-200 hover:bg-transparent">
							{columns.map((column) => (
								<TableHead
									key={column.labelKey}
									className="px-4 py-3 text-sm font-medium text-slate-500"
								>
									<span className="flex items-center gap-1">
										<Translate text={column.labelKey} />
										{column.sortable && (
											<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
										)}
									</span>
								</TableHead>
							))}
							<TableHead className="px-4 py-3" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{contacts.map((contact) => (
							<TableRow
								key={contact.id}
								className="border-b border-slate-100 hover:bg-slate-50/60"
							>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{contact.title}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{contact.name}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{contact.department}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{contact.city}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{contact.mobile}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700">
									{contact.email}
								</TableCell>
								<TableCell className="px-4 py-3.5">
									<Button
										type="button"
										variant="outline"
										className="h-8 rounded-md border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
									>
										<Translate
											text={
												localizationConstants.companyOrgMessageAction
											}
										/>
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="overflow-hidden w-full rounded-md border border-slate-200 bg-white">
				<div className="bg-slate-200/60 px-5 py-3.5">
					<h2 className="text-base font-semibold text-slate-800">
						<Translate
							text={localizationConstants.companyOrgSchemaTitle}
						/>
					</h2>
				</div>
				<div className="overflow-x-auto px-5 py-6">
					<OrgBranch node={root} />
				</div>
			</div>
		</div>
	);
};

export default OrganisationTab;
