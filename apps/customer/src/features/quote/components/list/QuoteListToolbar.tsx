import { Search } from "@/components/search/Search";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { QuoteStatus } from "../../types/types";

interface QuoteListToolbarProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	statusFilter: QuoteStatus | "all";
	onStatusFilterChange: (value: QuoteStatus | "all") => void;
}

export function QuoteListToolbar({
	searchTerm,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
}: QuoteListToolbarProps) {
	return (
		<div className="flex flex-wrap items-center gap-4">
			<Search
				value={searchTerm}
				onChange={onSearchChange}
				wrapperClassName="w-full sm:w-72"
				placeholder={localizationConstants.searchPlaceholder}
				// className="h-10 border-slate-200 bg-white border rounded-md"
			/>
			<Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as QuoteStatus | "all")}>
				<SelectTrigger aria-label="Filter by quote status" className="h-10 w-full sm:w-48 border-slate-200">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all"><Translate text={localizationConstants.allStatuses} /></SelectItem>
					<SelectItem value="Invited"><Translate text={localizationConstants.statusInvited} /></SelectItem>
					<SelectItem value="Received Quote"><Translate text={localizationConstants.statusReceivedQuote} /></SelectItem>
					<SelectItem value="Approved"><Translate text={localizationConstants.statusApproved} /></SelectItem>
					<SelectItem value="Rejected"><Translate text={localizationConstants.statusRejected} /></SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
