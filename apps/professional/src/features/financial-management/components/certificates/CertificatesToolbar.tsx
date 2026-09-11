"use client";

import React from "react";
import { Search, Plus, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { CERTIFICATE_CATEGORY_OPTIONS } from "../../constants/certificates.constants";
import type { CertificateStatus } from "../../types/certificates.types";

interface CertificatesToolbarProps {
	searchQuery: string;
	onSearchChange: (val: string) => void;
	categoryFilter: string;
	onCategoryFilterChange: (val: string) => void;
	statusFilter: CertificateStatus | "all";
	onStatusFilterChange: (val: CertificateStatus | "all") => void;
	onCreateClick: () => void;
	onResetSeedData?: () => void;
}

export function CertificatesToolbar({
	searchQuery,
	onSearchChange,
	categoryFilter,
	onCategoryFilterChange,
	statusFilter: _statusFilter,
	onStatusFilterChange: _onStatusFilterChange,
	onCreateClick,
	onResetSeedData,
}: CertificatesToolbarProps) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
			{/* Left: Search input & Filter dropdown */}
			<div className="flex flex-wrap items-center gap-3 flex-1">
				{/* Search Input */}
				<div className="relative min-w-[200px] max-w-xs flex-1">
					<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
					<Input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t(localizationConstants.searchCertificatesPlaceholder)}
						className="pl-9 h-10 text-sm bg-white border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-slate-400"
					/>
				</div>

				{/* Filter Category Dropdown */}
				<Select
					value={categoryFilter}
					onValueChange={(val) => onCategoryFilterChange(val)}
				>
					<SelectTrigger className="w-[140px] h-10 text-sm bg-white border-slate-200 rounded-lg text-slate-700">
						<div className="flex items-center gap-1.5">
							<Filter className="w-3.5 h-3.5 text-slate-500" />
							<SelectValue placeholder={t(localizationConstants.filterAllCertificates)} />
						</div>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">
							<Translate text={localizationConstants.filterAllCertificates} />
						</SelectItem>
						{CERTIFICATE_CATEGORY_OPTIONS.map((cat) => (
							<SelectItem key={cat} value={cat}>
								{cat}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{onResetSeedData && (
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={onResetSeedData}
						className="h-10 w-10 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
						title={t(localizationConstants.btnResetSeedData)}
					>
						<RotateCcw className="w-4 h-4" />
					</Button>
				)}
			</div>

			{/* Right: + Skapa attest Button */}
			<div className="flex items-center gap-2">
				<Button
					type="button"
					onClick={onCreateClick}
					className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-sm gap-2 transition-colors cursor-pointer"
				>
					<Plus className="w-4 h-4" />
					<Translate text={localizationConstants.btnCreateCertificate} />
				</Button>
			</div>
		</div>
	);
}
