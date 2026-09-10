"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/context/AuthContext";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { listCompanyContent } from "../services/companyService";
import type { CompanyContentItem } from "../types";

const formatDate = (timestamp: number) =>
	new Date(timestamp).toLocaleDateString();

const NewsTab = () => {
	const { company } = useAuthStatus();
	const [news, setNews] = useState<CompanyContentItem[]>([]);
	const [selected, setSelected] = useState<CompanyContentItem | null>(null);
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
		listCompanyContent(company.id, "news")
			.then((items) => !cancelled && setNews(items))
			.catch(() => !cancelled && setError(true))
			.finally(() => !cancelled && setLoading(false));
		return () => {
			cancelled = true;
		};
	}, [company?.id]);

	if (selected) {
		return (
			<article className="mx-auto max-w-4xl space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<Button type="button" variant="ghost" onClick={() => setSelected(null)} className="gap-2">
					<ArrowLeft className="h-4 w-4" /> Back to news
				</Button>
				<header>
					<p className="text-sm text-slate-500">{formatDate(selected.created_at)}</p>
					<h2 className="mt-2 text-2xl font-bold text-slate-900">{selected.title}</h2>
				</header>
				<div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{selected.body}</div>
			</article>
		);
	}

	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold text-slate-900"><Translate text={localizationConstants.companyTabNews} /></h2>
			{loading && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-44 animate-pulse rounded-xl bg-slate-100" />)}</div>}
			{!loading && !error && news.length > 0 && (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{news.map((item) => (
						<button key={item.id} type="button" onClick={() => setSelected(item)} className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
							<span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Newspaper className="h-5 w-5" /></span>
							<p className="mt-4 text-xs text-slate-500">{formatDate(item.created_at)}</p>
							<h3 className="mt-1 font-semibold text-slate-900">{item.title || "Company news"}</h3>
							<p className="mt-2 line-clamp-3 text-sm text-slate-600">{item.body}</p>
						</button>
					))}
				</div>
			)}
			{!loading && !error && news.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">No company news has been published yet.</div>}
			{!loading && error && <div className="rounded-xl bg-red-50 p-8 text-center text-red-700">Company news could not be loaded.</div>}
		</div>
	);
};

export default NewsTab;
