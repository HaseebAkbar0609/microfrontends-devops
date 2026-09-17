"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthStatus } from "@/context/AuthContext";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { listCompanyContent } from "../services/companyService";
import type { CompanyContentItem } from "../types";

const UpdatesTab = () => {
	const { company } = useAuthStatus();
	const [updates, setUpdates] = useState<CompanyContentItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		let cancelled = false;
		if (!company?.id) {
			setLoading(false);
			return;
		}
		setLoading(true);
		setError(false);
		listCompanyContent(company.id, "update")
			.then((items) => !cancelled && setUpdates(items))
			.catch(() => !cancelled && setError(true))
			.finally(() => !cancelled && setLoading(false));
		return () => { cancelled = true; };
	}, [company?.id]);

	return (
		<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
			<Table className="min-w-[36rem]">
				<TableHeader><TableRow><TableHead><Translate text={localizationConstants.companyMsgColDate} /></TableHead><TableHead><Translate text={localizationConstants.companyUpdColType} /></TableHead><TableHead><Translate text={localizationConstants.companyUpdColFunction} /></TableHead></TableRow></TableHeader>
				<TableBody>
					{loading && Array.from({ length: 3 }).map((_, index) => <TableRow key={index}>{Array.from({ length: 3 }).map((__, cell) => <TableCell key={cell}><div className="h-4 animate-pulse rounded bg-slate-100" /></TableCell>)}</TableRow>)}
					{!loading && updates.map((update) => <TableRow key={update.id}><TableCell>{new Date(update.created_at).toLocaleDateString()}</TableCell><TableCell>{update.title || "Update"}</TableCell><TableCell>{String(update.metadata.functionArea || update.body)}</TableCell></TableRow>)}
				</TableBody>
			</Table>
			{!loading && !error && updates.length === 0 && <div className="p-12 text-center text-slate-500">No company updates are available.</div>}
			{!loading && error && <div className="bg-red-50 p-8 text-center text-red-700">Company updates could not be loaded.</div>}
		</div>
	);
};

export default UpdatesTab;
