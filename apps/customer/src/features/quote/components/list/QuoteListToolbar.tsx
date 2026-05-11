import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search/Search";
import localizationConstants from "@/utils/translation/constants";

interface QuoteListToolbarProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
}

export function QuoteListToolbar({
	searchTerm,
	onSearchChange,
}: QuoteListToolbarProps) {
	return (
		<div className="flex items-center gap-4">
			<Search
				value={searchTerm}
				onChange={onSearchChange}
				wrapperClassName="w-72"
				placeholder={localizationConstants.searchPlaceholder}
				// className="h-10 border-slate-200 bg-white border rounded-md"
			/>
			<Button
				variant="outline"
				className="h-10 border-slate-200 text-slate-700 font-medium px-4"
			>
				Filter <ChevronDown className="ml-2 h-4 w-4" />
			</Button>
		</div>
	);
}
