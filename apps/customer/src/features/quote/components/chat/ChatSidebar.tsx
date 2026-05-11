import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChatCompany } from "../../types/types";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";

interface ChatSidebarProps {
	companies: readonly ChatCompany[];
	selectedCompanyId: string;
	onSelectCompany: (id: string) => void;
}

export function ChatSidebar({
	companies,
	selectedCompanyId,
	onSelectCompany,
}: ChatSidebarProps) {
	const [searchTerm, setSearchTerm] = useState("");

	const { t } = useTranslation();

	const filteredCompanies = companies.filter((company) =>
		company.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="w-[320px] flex flex-col border-r border-slate-200 bg-white z-10 shrink-0">
			{/* Sidebar Header */}
			<div className="p-4 border-b border-slate-200 bg-white">
				<h3 className="font-semibold text-slate-900 mb-3 text-sm">
					Company
				</h3>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
					<Input
						placeholder={t(
							localizationConstants.companySearchPlaceholder,
						)}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-9 bg-white h-10 border-slate-200 text-sm focus-visible:ring-1 focus-visible:ring-slate-300"
					/>
				</div>
			</div>

			{/* Company List */}
			<div className="flex-1 overflow-y-auto">
				{filteredCompanies.map((company) => {
					const isSelected = company.id === selectedCompanyId;
					return (
						<div
							key={company.id}
							onClick={() => onSelectCompany(company.id)}
							className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${
								isSelected
									? "bg-slate-50 relative"
									: "bg-white hover:bg-slate-50/50"
							}`}
						>
							{isSelected && (
								<div className="absolute left-0 top-0 bottom-0 w-[3px] bg-slate-900" />
							)}
							<div className="flex justify-between items-start mb-2">
								<span className="font-semibold text-sm text-slate-900">
									{company.name}
								</span>
								<span className="text-xs text-slate-500 font-medium">
									{company.time}
								</span>
							</div>
							<div className="mb-2">
								<Badge
									variant={company.statusVariant}
									className={`rounded-full px-2 py-0.5 text-[10px] ${
										company.status === "Under review"
											? "bg-purple-50 text-purple-700"
											: ""
									}`}
								>
									{company.status}
								</Badge>
							</div>
							<div className="flex justify-between items-center text-sm text-slate-500">
								<span className="truncate pr-2 flex items-center gap-1.5 text-xs">
									{company.message}
									{company.hasCalendar && (
										<Calendar className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
									)}
								</span>
								{company.unread > 0 && (
									<span className="flex-shrink-0 w-5 h-5 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm">
										{company.unread}
									</span>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
