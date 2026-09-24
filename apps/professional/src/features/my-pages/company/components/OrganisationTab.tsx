"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAuthStatus } from "@/context/AuthContext";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { listCompanyContacts } from "../services/companyService";
import type { CompanyContact } from "../types";

type SortKey = "title" | "name" | "department" | "city";

const OrganisationTab = () => {
	const t = useTranslate();
	const { company } = useAuthStatus();
	const [search, setSearch] = useState("");
	const [contacts, setContacts] = useState<CompanyContact[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({
		key: "name",
		asc: true,
	});

	useEffect(() => {
		let cancelled = false;
		if (!company?.id) {
			setLoading(false);
			return;
		}
		setLoading(true);
		setError(false);
		const timer = window.setTimeout(() => {
			listCompanyContacts(company.id, search.trim())
				.then((data) => !cancelled && setContacts(data))
				.catch(() => !cancelled && setError(true))
				.finally(() => !cancelled && setLoading(false));
		}, 250);
		return () => {
			cancelled = true;
			window.clearTimeout(timer);
		};
	}, [company?.id, search]);

	const rows = useMemo(
		() =>
			[...contacts].sort((a, b) => {
				const result = a[sort.key].localeCompare(b[sort.key]);
				return sort.asc ? result : -result;
			}),
		[contacts, sort],
	);

	const toggleSort = (key: SortKey) =>
		setSort((current) => ({
			key,
			asc: current.key === key ? !current.asc : true,
		}));

	const columns: Array<{ key: SortKey; label: string }> = [
		{ key: "title", label: localizationConstants.companyOrgColTitle },
		{ key: "name", label: localizationConstants.companyOrgColPerson },
		{ key: "department", label: localizationConstants.companyOrgColDepartment },
		{ key: "city", label: localizationConstants.companyInfoCity },
	];

	return (
		<div className="space-y-5">
			<div className="relative w-full max-w-md">
				<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
				<Input
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder={t(localizationConstants.search)}
					className="h-10 rounded-lg border-slate-200 pl-9"
				/>
			</div>

			<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
				<Table className="min-w-[52rem]">
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead key={column.key}>
									<button type="button" onClick={() => toggleSort(column.key)} className="flex items-center gap-1.5 font-medium">
										<Translate text={column.label} /><ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
									</button>
								</TableHead>
							))}
							<TableHead><Translate text={localizationConstants.companyOrgColMobile} /></TableHead>
							<TableHead><Translate text={localizationConstants.companyInfoEmail} /></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading && Array.from({ length: 3 }).map((_, index) => (
							<TableRow key={index}>{Array.from({ length: 6 }).map((__, cell) => <TableCell key={cell}><div className="h-4 animate-pulse rounded bg-slate-100" /></TableCell>)}</TableRow>
						))}
						{!loading && rows.map((contact) => (
							<TableRow key={contact.id}>
								<TableCell>{contact.title}</TableCell><TableCell className="font-medium text-slate-900">{contact.name}</TableCell><TableCell>{contact.department}</TableCell><TableCell>{contact.city}</TableCell><TableCell>{contact.mobile}</TableCell><TableCell>{contact.email}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{!loading && !error && rows.length === 0 && (
					<div className="flex min-h-44 flex-col items-center justify-center gap-2 border-t border-slate-100 px-6 text-center text-slate-500"><Users className="h-7 w-7" /><p>No records found</p></div>
				)}
				{!loading && error && <div className="border-t border-red-100 bg-red-50 px-6 py-8 text-center text-red-700">Organisation could not be loaded.</div>}
			</div>
		</div>
	);
};

export default OrganisationTab;
