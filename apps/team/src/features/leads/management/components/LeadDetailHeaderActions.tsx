import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type LeadDetailHeaderActionsProps = {
	isMonitoringView: boolean;
	showArchiveAction: boolean;
	monitorStatus: string;
	onMonitorStatusChange: (value: string) => void;
};

export default function LeadDetailHeaderActions({
	isMonitoringView,
	showArchiveAction,
	monitorStatus,
	onMonitorStatusChange,
}: LeadDetailHeaderActionsProps) {
	if (!isMonitoringView) return null;

	return (
		<div className="flex flex-wrap items-center gap-3">
			{showArchiveAction ? (
				<Button variant="outline" className="bg-white h-9 rounded-lg border-slate-300 px-6">
					<Translate text={localizationConstants.archiveLabel} />
				</Button>
			) : (
				<>
					<Select value={monitorStatus} onValueChange={onMonitorStatusChange}>
						<SelectTrigger className="h-9 rounded-lg border-slate-300 bg-white px-4 text-sm font-medium text-slate-900">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="monitor">
								<Translate text={localizationConstants.monitorLabel} />
							</SelectItem>
							<SelectItem value="active">
								<Translate text={localizationConstants.activeLabel} />
							</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="outline" className="rounded-lg h-9 border-slate-300 bg-white px-6">
						<Translate text={localizationConstants.activeLabel} />
					</Button>
				</>
			)}
		</div>
	);
}
