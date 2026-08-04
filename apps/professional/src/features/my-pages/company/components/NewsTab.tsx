"use client";

import { useState } from "react";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { CompanyNewsItem } from "../constants/mockData";
import { listCompanyNews } from "../services/companyService";

const formatNewsDate = (isoDate: string) =>
	isoDate.split("-").reverse().join("/");

const ImageBox = ({ className }: { className?: string }) => (
	<div
		className={`flex items-center justify-center rounded-md bg-slate-100 text-slate-400 ${className ?? ""}`}
		aria-hidden
	>
		<ImageIcon className="h-8 w-8" />
	</div>
);

const NewsDetail = ({
	item,
	onBack,
}: {
	item: CompanyNewsItem;
	onBack: () => void;
}) => (
	<div className="flex flex-col gap-6">
		<div className="flex items-start gap-3">
			<Button
				type="button"
				variant="ghost"
				size="icon"
				onClick={onBack}
				className="mt-1 h-8 w-8 rounded-md text-slate-700"
			>
				<ArrowLeft className="h-5 w-5" />
			</Button>
			<div>
				<h2 className="max-w-xl text-2xl font-bold text-slate-900">
					{item.title}
				</h2>
				<p className="mt-1 text-sm text-slate-500">
					{formatNewsDate(item.date)}
				</p>
			</div>
		</div>

		<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
			<ImageBox className="h-96" />
			<div className="space-y-4 text-sm leading-relaxed text-slate-500">
				{item.paragraphs.map((paragraph, index) => (
					<p key={`side-${index}`}>{paragraph}</p>
				))}
			</div>
		</div>

		<div className="space-y-4 text-sm leading-relaxed text-slate-500">
			<p>
				{item.excerpt}. {item.excerpt}
			</p>
			<p>{item.excerpt}</p>
		</div>

		<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
			<ImageBox className="h-64" />
			<ImageBox className="h-64" />
			<ImageBox className="h-64" />
		</div>

		<div className="space-y-4 text-sm leading-relaxed text-slate-500">
			<p>
				{item.excerpt}. {item.excerpt}
			</p>
			<p>{item.excerpt}</p>
		</div>
	</div>
);

const NewsTab = () => {
	const [selected, setSelected] = useState<CompanyNewsItem | null>(null);
	const news = listCompanyNews();

	if (selected)
		return <NewsDetail item={selected} onBack={() => setSelected(null)} />;

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-lg font-semibold text-slate-900">
				<Translate text={localizationConstants.companyTabNews} />
			</h2>
			<div className="max-w-3xl">
				{news.map((item) => (
					<button
						key={item.id}
						type="button"
						onClick={() => setSelected(item)}
						className="flex w-full cursor-pointer gap-6 border-b border-slate-100 py-4 text-left last:border-b-0"
					>
						<ImageBox className="h-56 w-56 shrink-0" />
						<div className="flex-1 pt-2">
							<p className="text-sm text-slate-500">
								{formatNewsDate(item.date)}
							</p>
							<h3 className="mt-2 text-lg font-bold text-slate-900">
								{item.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-slate-500">
								{item.excerpt}
							</p>
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default NewsTab;
