"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
	ArrowLeft,
	PenLine,
	UserPlus,
	Package,
	FilePlus,
	ChevronUp,
	ChevronDown,
	ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";
import { getSupplierArticleDetailAPIAction } from "../api/articleRegister";
import type { SupplierArticleDetail } from "../types";

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col gap-1 min-w-0">
			<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
				<Translate text={label} />
			</span>
			<span className="truncate text-sm font-normal leading-5 tracking-normal text-zinc-500">
				{value || "\u2014"}
			</span>
		</div>
	);
}

function InfoRowLink({
	label,
	value,
	href,
}: {
	label: string;
	value: string;
	href: string;
}) {
	return (
		<div className="flex flex-col gap-1 min-w-0">
			<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
				<Translate text={label} />
			</span>
			<Link
				href={href}
				className="truncate text-sm font-normal leading-5 tracking-normal text-zinc-500 hover:underline"
			>
				{value || "\u2014"}
			</Link>
		</div>
	);
}

function SectionCard({
	icon,
	title,
	onEdit,
	children,
	collapsible = false,
	defaultOpen = true,
	className,
}: {
	icon?: React.ReactNode;
	title: string;
	onEdit?: () => void;
	children: React.ReactNode;
	collapsible?: boolean;
	defaultOpen?: boolean;
	className?: string;
}) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const headerContent = (
		<div className="flex h-14 flex-row items-center justify-between border-b border-slate-200 px-4">
			<CardTitle className="flex items-center gap-2 min-w-0 text-base font-medium leading-6 tracking-normal text-zinc-950">
				{icon && <span className="inline-flex shrink-0">{icon}</span>}
				<Translate text={title} />
			</CardTitle>
			<div className="flex items-center gap-2 shrink-0">
				{collapsible && (
					<span className="inline-flex items-center justify-center text-slate-500">
						{isOpen ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
					</span>
				)}
				{onEdit && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onEdit}
						className="hidden h-9 w-20.5 gap-2 rounded bg-zinc-100 px-4 py-2 text-sm font-medium leading-5 tracking-normal text-zinc-950 hover:opacity-80 sm:inline-flex"
					>
						<PenLine className="h-4 w-4" />
						<Translate text={localizationConstants.editLabel} />
					</Button>
				)}
			</div>
		</div>
	);

	if (collapsible) {
		return (
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<Card className={cn("rounded-lg w-full overflow-hidden", className)}>
					<CollapsibleTrigger asChild>
						<div className="cursor-pointer">{headerContent}</div>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<CardContent className="px-4 py-4">{children}</CardContent>
					</CollapsibleContent>
				</Card>
			</Collapsible>
		);
	}

	return (
		<Card className={cn("rounded-lg w-full overflow-hidden", className)}>
			{headerContent}
			<CardContent className="px-4 py-4">{children}</CardContent>
		</Card>
	);
}

export function SupplierArticleDetailPage() {
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;

	const [article, setArticle] = useState<SupplierArticleDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchArticle = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getSupplierArticleDetailAPIAction(id);
			setArticle(data);
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchArticle();
	}, [fetchArticle]);

	if (isLoading) {
		return (
			<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50 pt-6 pb-6 px-4 sm:px-6 md:px-8">
				<div className="flex items-center gap-2">
					<div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
					<div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
				</div>
				<div className="h-4 w-20 animate-pulse rounded bg-slate-200 opacity-60 my-2" />
				<div className="flex gap-6 border-b border-slate-200 mb-6">
					<div className="h-10 w-24 animate-pulse rounded bg-slate-200" />
					<div className="h-10 w-24 animate-pulse rounded bg-slate-200" />
				</div>
				<div className="grid grid-cols-1 gap-4 sm:gap-6">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="h-48 animate-pulse rounded-lg border border-slate-200 bg-white"
						/>
					))}
				</div>
			</div>
		);
	}

	if (!article) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-4 py-16">
				<h2 className="mb-2 text-lg font-semibold leading-7 text-zinc-950">
					<Translate text={localizationConstants.notFoundTitle} />
				</h2>
				<p className="mb-4 text-sm font-normal leading-5 text-zinc-500">
					<Translate text={localizationConstants.notFoundDescription} />
				</p>
				<Button onClick={() => router.back()}>
					<Translate text={localizationConstants.goBackButton} />
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50 pt-4 pb-4 px-2 sm:px-2 md:px-2">
			<div className="mb-0.5 flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => router.push("/tools/register/supplier-articles")}
					className="h-8 w-8 shrink-0"
				>
					<ArrowLeft className="h-5 w-5 text-slate-700" />
				</Button>
				<h1 className="text-2xl font-semibold leading-none tracking-[-0.6px] text-zinc-950">
					<Translate text={localizationConstants.articleDetailTitle} />
				</h1>
			</div>

			<p className="mb-2 ml-10 text-sm font-normal leading-5 text-zinc-500">
				#{article.articleNo}
			</p>

			<Tabs defaultValue="basic" className="ml-0 sm:ml-10">
				<TabsList variant="line" className="mb-2">
					<TabsTrigger
						value="basic"
						className="min-w-fit text-sm font-semibold leading-none tracking-normal text-center"
					>
						<Translate text={localizationConstants.basicInfoTab} />
					</TabsTrigger>
					<TabsTrigger
						value="articles"
						className="min-w-fit text-sm font-semibold leading-none tracking-normal text-center"
					>
						<Translate text={localizationConstants.articleListTab} />
					</TabsTrigger>
				</TabsList>

				<TabsContent value="basic">
					<div className="flex flex-col gap-4">
						<SectionCard
							icon={<UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />}
							title={localizationConstants.grundInformationSection}
							onEdit={() => {}}
						>
							<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
								<InfoRow
									label={localizationConstants.articleNoLabel}
									value={article.articleNo}
								/>
								<InfoRow
									label={localizationConstants.supplierArticleNoLabel}
									value={article.supplierArticleNo}
								/>
								<InfoRowLink
									label={localizationConstants.supplierNameLabel}
									value={article.supplierName}
									href={`/tools/register/suppliers/${article.supplierId}`}
								/>
								<InfoRow
									label={localizationConstants.unitPriceLabel}
									value={article.unitPrice}
								/>
								<InfoRow
									label={localizationConstants.linkedArticleLabel}
									value={article.linkedArticleNo}
								/>
								<div className="max-lg:col-span-2">
									<InfoRow
										label={localizationConstants.articleDescriptionLabel}
										value={article.articleDescription}
									/>
								</div>
							</div>
						</SectionCard>

						<SectionCard
							icon={<Package className="h-5 w-5 sm:h-6 sm:w-6" />}
							title={localizationConstants.artikelInformationSection}
							onEdit={() => {}}
						>
							<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
								<InfoRow
									label={localizationConstants.weightLabel}
									value={article.weight}
								/>
								<InfoRow
									label={localizationConstants.lengthLabel}
									value={article.length}
								/>
								<InfoRow
									label={localizationConstants.widthLabel}
									value={article.width}
								/>
								<InfoRow
									label={localizationConstants.heightLabel}
									value={article.height}
								/>
								<InfoRow
									label={localizationConstants.materialLabel}
									value={article.material}
								/>
							</div>
						</SectionCard>

						<SectionCard
							icon={<FilePlus className="h-5 w-5 sm:h-6 sm:w-6" />}
							title={localizationConstants.imagesSection}
							collapsible
							defaultOpen
						>
							<p className="mb-4 text-sm font-medium leading-5 text-zinc-950">
								<Translate text={localizationConstants.imagesSection} />
							</p>
							<div className="flex gap-4 flex-wrap">
								{article.images.length > 0 ? (
									article.images.map((img) => (
										<div
											key={img.id}
											className="flex flex-col items-start gap-2"
										>
											<div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-lg bg-slate-100 p-2">
												<ImageIcon className="h-8 w-8 text-slate-400" />
											</div>
											<span className="block w-24 sm:w-28 truncate text-center text-xs font-normal leading-4 text-zinc-500">
												{img.name}
											</span>
										</div>
									))
								) : (
									<p className="text-sm font-normal leading-5 text-zinc-500">
										<Translate text={localizationConstants.noImagesFound} />
									</p>
								)}
							</div>
						</SectionCard>
					</div>
				</TabsContent>

				<TabsContent value="articles" />
			</Tabs>
		</div>
	);
}
