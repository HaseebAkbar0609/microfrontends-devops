import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ACCESS_NEW_TOTAL_STEPS } from "../../constants/accessNewLimits.constants";

/** The "Step 1/2" card: the step number over a bar that fills as the steps go. */
export function AccessStepProgress({ step }: { step: number }) {
	const percent = Math.round((step / ACCESS_NEW_TOTAL_STEPS) * 100);

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-5">
			<p className="text-sm font-medium text-slate-950">
				<Translate text={localizationConstants.accessNewStepLabel} values={{ step, total: ACCESS_NEW_TOTAL_STEPS }} />
			</p>
			<div
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={ACCESS_NEW_TOTAL_STEPS}
				aria-valuenow={step}
				className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
			>
				<div className="h-full rounded-full bg-zinc-900" style={{ width: `${percent}%` }} />
			</div>
		</div>
	);
}
