import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface InfoSectionProps {
	label: string;
	value: string | boolean | undefined;
}

export function InfoSection({ label, value }: InfoSectionProps) {
	const { t } = useTranslation();

	return (
		<div className="space-y-1">
			<p className="text-sm text-slate-900 font-medium">
				<Translate text={label} />
			</p>
			<p className="text-sm text-slate-500 font-semibold">
				{typeof value === "boolean"
					? value
						? t(localizationConstants.ja)
						: t(localizationConstants.nej)
					: value || "-"}
			</p>
		</div>
	);
}
