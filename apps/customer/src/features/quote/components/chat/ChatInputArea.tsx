import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export function ChatInputArea() {
	const t = useTranslate();
	return (
		<div className="p-4 bg-white border-t border-slate-200 shrink-0">
			<div className="border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:ring-1 focus-within:ring-slate-300 transition-shadow flex flex-col pt-2 shadow-sm">
				<Textarea
					placeholder={t(localizationConstants.chatPlaceholder)}
					className="border-0 focus-visible:ring-0 resize-none min-h-[60px] px-4 py-2 shadow-none text-sm placeholder:text-slate-400 focus:outline-none focus:ring-0"
				/>
				<div className="flex items-center justify-between p-2 pt-0 mt-2 border-t border-slate-100 bg-slate-50/50">
					<Button
						variant="ghost"
						size="sm"
						className="text-slate-700 font-medium h-9 hover:bg-slate-200/50"
					>
						<Paperclip className="h-4 w-4 mr-2 text-slate-500" />
						<Translate text={localizationConstants.attachLabel} />
					</Button>
					<div className="flex items-center gap-3 pr-1">
						<Button
							variant="ghost"
							size="sm"
							className="text-slate-700 font-medium h-9 px-4 hover:bg-slate-200/50"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							size="sm"
							className="bg-slate-900 hover:bg-slate-800 text-white font-medium h-9 px-6 rounded-md shadow-sm"
						>
							<Translate text={localizationConstants.sendLabel} />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
