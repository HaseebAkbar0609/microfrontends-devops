import { useState } from "react";
import { QuoteListToolbar } from "./list/QuoteListToolbar";
import { QuoteListTable } from "./list/QuoteListTable";
import { DUMMY_QUOTES } from "../constants";

export function QuoteListTab() {
	const [searchTerm, setSearchTerm] = useState("");

	return (
		<div className="flex flex-col gap-4">
			<QuoteListToolbar
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
			/>
			<QuoteListTable quotes={DUMMY_QUOTES} />
		</div>
	);
}
