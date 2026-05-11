import { useState } from "react";
import { ChatSidebar } from "./chat/ChatSidebar";
import { ChatArea } from "./chat/ChatArea";
import { COMPANIES } from "../constants";

export function ProjectChatTab() {
	const [selectedCompanyId, setSelectedCompanyId] = useState<string>("1");

	const selectedCompany = COMPANIES.find((c) => c.id === selectedCompanyId);

	return (
		<div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden h-[700px]">
			<ChatSidebar
				companies={COMPANIES}
				selectedCompanyId={selectedCompanyId}
				onSelectCompany={setSelectedCompanyId}
			/>
			<ChatArea company={selectedCompany} />
		</div>
	);
}
