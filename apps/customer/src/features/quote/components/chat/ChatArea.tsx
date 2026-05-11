import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInputArea } from "./ChatInputArea";
import { ChatCompany } from "../../types/types";

interface ChatAreaProps {
	company?: ChatCompany;
}

export function ChatArea({ company }: ChatAreaProps) {
	const companyName = company?.name || "Pelle Bygg";
	const companyInitials = companyName.substring(0, 2).toUpperCase();

	return (
		<div className="flex-1 flex flex-col bg-slate-50/30 min-w-0">
			<ChatHeader
				companyName={companyName}
				companyInitials={companyInitials}
				responseTime="~2h"
				contactName="Peter Svensson"
			/>
			<ChatMessages />
			<ChatInputArea />
		</div>
	);
}
