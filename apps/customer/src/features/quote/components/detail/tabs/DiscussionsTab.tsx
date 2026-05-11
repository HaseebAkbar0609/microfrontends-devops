import { TabsContent } from "@/components/ui/tabs";
import { ChatSidebar } from "../../chat/ChatSidebar";
import { ChatArea } from "../../chat/ChatArea";

import { ChatCompany } from "../../../types/types";

interface DiscussionsTabProps {
	companies: readonly ChatCompany[];
	selectedCompanyId: string;
	onSelectCompany: (id: string) => void;
	selectedCompany: ChatCompany | undefined;
}

export function DiscussionsTab({
	companies,
	selectedCompanyId,
	onSelectCompany,
	selectedCompany,
}: DiscussionsTabProps) {
	return (
		<TabsContent value="discussions">
			<div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden h-[700px] animate-in fade-in duration-300">
				<ChatSidebar
					companies={companies}
					selectedCompanyId={selectedCompanyId}
					onSelectCompany={onSelectCompany}
				/>
				<ChatArea company={selectedCompany} />
			</div>
		</TabsContent>
	);
}
