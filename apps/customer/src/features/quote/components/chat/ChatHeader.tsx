import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface ChatHeaderProps {
	companyName: string;
	companyInitials: string;
	responseTime: string;
	contactName: string;
}

export function ChatHeader({ companyName, companyInitials, responseTime, contactName }: ChatHeaderProps) {
	return (
		<div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white shrink-0">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm">
					{companyInitials}
				</div>
				<div>
					<h2 className="font-semibold text-slate-900 text-base">
						{companyName}
					</h2>
					<p className="text-xs text-slate-500 mt-0.5">
						<Translate text={localizationConstants.responseTimeLabel} />: {responseTime} • <Translate text={localizationConstants.contactLabel} />: {contactName}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<Button className="bg-slate-900 text-white hover:bg-slate-800 h-9 px-4 text-xs font-medium rounded-md">
					<Translate text={localizationConstants.bookMeetingLabel} />
				</Button>
				<Button
					variant="outline"
					className="h-9 px-4 text-xs font-medium border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
				>
					<Translate text={localizationConstants.viewQuoteButton} />
				</Button>
				<Button
					variant="ghost"
					className="h-9 px-2 text-xs font-medium text-slate-500 hover:text-slate-900 data-[state=open]:bg-slate-100"
				>
					<Translate text={localizationConstants.companyInformationLabel} />
					<MoreVertical className="h-4 w-4 ml-1" />
				</Button>
			</div>
		</div>
	);
}
