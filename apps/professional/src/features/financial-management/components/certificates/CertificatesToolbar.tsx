"use client";

import { Search } from "@/components/search/Search";
import { Plus, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto flex-1">
				{/* Search Input */}
				<Search
					value={searchQuery}
					onChange={onSearchChange}
					placeholder={t(localizationConstants.searchCertificatesPlaceholder)}
					className="h-10 w-full"
					wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
				/>

				{/* Filter Category Dropdown */}
				<Select
					value={categoryFilter}
					onValueChange={(val) => onCategoryFilterChange(val)}
				>
					<SelectTrigger className="w-full sm:w-[160px] h-10 text-xs bg-white border-slate-200 rounded-lg text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer">
						<div className="flex items-center gap-1.5">
							<Filter className="w-3.5 h-3.5 text-slate-500" />
							<SelectValue placeholder={t(localizationConstants.filterAllCertificates)} />
						</div>
					</SelectTrigger>
					<SelectContent className="bg-white border-slate-200 shadow-md">
						<SelectItem value="all" className="cursor-pointer text-xs focus:bg-slate-100">
							<Translate text={localizationConstants.filterAllCertificates} />
						</SelectItem>
						{CERTIFICATE_CATEGORY_OPTIONS.map((cat) => (
							<SelectItem key={cat} value={cat} className="cursor-pointer text-xs focus:bg-slate-100">
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
						className="h-10 w-10 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-2xs cursor-pointer"
						title={t(localizationConstants.btnResetSeedData)}
					>
						<RotateCcw className="w-4 h-4" />
					</Button>
				)}
			</div>

			{/* Right: + Skapa attest Button */}
			<div className="flex items-center justify-end">
				<Button
					type="button"
					onClick={onCreateClick}
					className="h-10 px-4 bg-[#111721] hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-2xs gap-2 cursor-pointer transition-colors w-full sm:w-auto justify-center"
				>
					<Plus className="w-4 h-4" />
					<Translate text={localizationConstants.btnCreateCertificate} />
				</Button>
			</div>
		</div>
	);
}

