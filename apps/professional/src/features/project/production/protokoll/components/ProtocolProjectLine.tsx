import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

function Fact({ labelKey, value }: { labelKey: TranslationKeys; value: string }) {
	return (
		<div className="flex min-w-0 gap-1.5">
			<dt className="shrink-0 font-semibold">
				<Translate text={labelKey} />:
			</dt>
			<dd className="min-w-0 break-words">{value}</dd>
		</div>
	);
}

/** "Projekt nr: 5001   Projekt namn: …" — the line Nytt möte and the protocol open with. */
export function ProtocolProjectLine({ projectNo, projectName }: { projectNo: string; projectName: string }) {
	return (
		<dl className="flex flex-wrap gap-x-10 gap-y-1 text-sm text-slate-900">
			<Fact labelKey={localizationConstants.protocolProjectNr} value={projectNo} />
			<Fact labelKey={localizationConstants.protocolProjectName} value={projectName} />
		</dl>
	);
}
