import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export const dynamic = "force-dynamic";

export default function ArchivePage() {
	return (
		<div className="flex h-full flex-1 flex-col items-center justify-center p-8 text-center bg-slate-50">
			<h1 className="text-2xl font-bold text-slate-900 mb-2">
				<Translate text={localizationConstants.archiveItem} />
			</h1>
			<p className="text-sm text-slate-500">
				<Translate text={localizationConstants.comingSoonMessage} />
			</p>
		</div>
	);
}
