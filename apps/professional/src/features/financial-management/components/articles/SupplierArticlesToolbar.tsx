"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface SupplierArticlesToolbarProps {
	readonly searchQuery: string;
	readonly supplierParam: string;
	readonly selectOptions: { label: string; value: string }[];
	readonly onSearchChange: (val: string) => void;
	readonly onSupplierFilterChange: (sup: string) => void;
}

export function SupplierArticlesToolbar({
	searchQuery,
	supplierParam,
	selectOptions,
	onSearchChange,
	onSupplierFilterChange,
}: SupplierArticlesToolbarProps) {
	return (
		<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
				<Search
					value={searchQuery}
					onChange={onSearchChange}
					placeholder={localizationConstants.search}
					className="h-10 w-full"
					wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
				/>

				<div className="w-full sm:w-48">
					<Select value={supplierParam} onValueChange={onSupplierFilterChange}>
						<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-xs shadow-2xs">
							<SelectValue placeholder="Välj leverantör" />
						</SelectTrigger>
						<SelectContent className="bg-white border-slate-200 shadow-md">
							<SelectItem value="all" className="text-xs cursor-pointer focus:bg-slate-100">
								<Translate text={localizationConstants.allSuppliersFilter} />
							</SelectItem>
							{selectOptions.map((opt) => (
								<SelectItem
									key={opt.value}
									value={opt.value}
									className="text-xs cursor-pointer focus:bg-slate-100"
								>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto justify-end">
				<Button
					onClick={() => window.location.reload()}
					className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center cursor-pointer"
				>
					<RefreshCw className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.updateArticlesAction} />
				</Button>
			</div>
		</div>
	);
}
