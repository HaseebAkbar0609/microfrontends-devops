"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { CustomerRegisterTable } from "./CustomerRegisterTable";
import { SupplierRegisterTable } from "./SupplierRegisterTable";
import { ArticleRegisterTable } from "./ArticleRegisterTable";
import { SupplierArticleRegisterTable } from "./SupplierArticleRegisterTable";

interface RegisterPageProps {
	defaultRegister?: "kund" | "supplier" | "artikel";
}

function RegisterContent({ defaultRegister }: RegisterPageProps) {
	const { t } = useTranslation();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const selectedRegister =
		defaultRegister ??
		(pathname.includes("/supplier")
			? "supplier"
			: pathname.includes("/articles")
				? "artikel"
				: "kund");

	const articleSubTab = searchParams.get("subtab") ?? "artikel";

	const updateSubTab = useCallback(
		(newSubTab: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("subtab", newSubTab);
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[pathname, router, searchParams],
	);

	const handleRegisterChange = (value: string) => {
		if (value === "supplier") {
			router.push("/tools/register/supplier");
		} else if (value === "artikel") {
			router.push("/tools/register/articles");
		} else {
			router.push("/tools/register/customer");
		}
	};

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Breadcrumbs & Page Header */}
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold tracking-tight text-slate-900">
					<Translate text={localizationConstants.registerDropdownLabel} />
				</h1>

				<nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
					<Link href="/" className="hover:text-slate-900 transition-colors">
						<Translate text={localizationConstants.home} />
					</Link>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span>
						<Translate text={localizationConstants.moduleItem} />
					</span>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span>
						<Translate text={localizationConstants.invoice} />
					</span>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span className="text-slate-900">
						<Translate text={localizationConstants.registerDropdownLabel} />
					</span>
				</nav>
			</div>

			{/* Register Section Dropdown Selector (Only 3 options: Customer, Supplier, Article) */}
			<div className="flex flex-col gap-2 w-full lg:w-1/3 xl:w-1/4">
				<label className="text-xs font-medium text-slate-700">
					<Translate text={localizationConstants.registerDropdownLabel} />
				</label>
				<Select value={selectedRegister} onValueChange={handleRegisterChange}>
					<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-2xs">
						<SelectValue placeholder={t(localizationConstants.selectRegisterPlaceholder)} />
					</SelectTrigger>
					<SelectContent className="bg-white border-slate-200 shadow-md">
						<SelectItem
							value="kund"
							className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer"
						>
							<Translate text={localizationConstants.customerOption} />
						</SelectItem>
						<SelectItem
							value="supplier"
							className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer"
						>
							<Translate text={localizationConstants.supplierOption} />
						</SelectItem>
						<SelectItem
							value="artikel"
							className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer"
						>
							<Translate text={localizationConstants.articleOption} />
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Sub Tabs Bar using Shadcn UI Tabs */}
			<div className="border-b border-slate-200">
				{selectedRegister === "artikel" ? (
					<Tabs value={articleSubTab} onValueChange={(val) => updateSubTab(val)}>
						<TabsList variant="line" className="gap-8 bg-transparent p-0 -mb-px">
							<TabsTrigger value="artikel" className="pb-3 pt-1 text-sm font-semibold">
								<Translate text={localizationConstants.articleListTab} />
							</TabsTrigger>
							<TabsTrigger value="leverantorsArtiklar" className="pb-3 pt-1 text-sm font-semibold">
								<Translate text={localizationConstants.supplierArticlesTab} />
							</TabsTrigger>
						</TabsList>
					</Tabs>
				) : (
					<Tabs value="active">
						<TabsList variant="line" className="gap-8 bg-transparent p-0 -mb-px">
							<TabsTrigger value="active" className="pb-3 pt-1 text-sm font-semibold">
								{selectedRegister === "kund" ? (
									<Translate text={localizationConstants.customerListTab} />
								) : (
									<Translate text={localizationConstants.supplierListTab} />
								)}
							</TabsTrigger>
						</TabsList>
					</Tabs>
				)}
			</div>

			{/* Table Content */}
			{selectedRegister === "kund" && (
				<Suspense fallback={<div className="py-8 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
					<CustomerRegisterTable />
				</Suspense>
			)}
			{selectedRegister === "supplier" && (
				<Suspense fallback={<div className="py-8 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
					<SupplierRegisterTable />
				</Suspense>
			)}
			{selectedRegister === "artikel" && articleSubTab === "artikel" && (
				<Suspense fallback={<div className="py-8 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
					<ArticleRegisterTable />
				</Suspense>
			)}
			{selectedRegister === "artikel" && articleSubTab === "leverantorsArtiklar" && (
				<Suspense fallback={<div className="py-8 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
					<SupplierArticleRegisterTable />
				</Suspense>
			)}
		</div>
	);
}

export function RegisterPage({ defaultRegister }: RegisterPageProps) {
	return (
		<Suspense fallback={<div className="p-6 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
			<RegisterContent defaultRegister={defaultRegister} />
		</Suspense>
	);
}
