import { Folders } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { WidgetSourceUnavailable } from "./WidgetContent";

export const ModulesSection = () => (
	<Card className="p-6 gap-2.5 ">
		<CardHeader className="flex flex-row items-center gap-3 border-slate-100 px-0  ">
			<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
				<Folders size={24} className="text-slate-600" />
			</div>
			<CardTitle className="text-2xl font-semibold text-foreground">
				<Translate text={localizationConstants.modulesTitle} />
			</CardTitle>
		</CardHeader>
		<CardContent className="px-0">
			<WidgetSourceUnavailable />
		</CardContent>
	</Card>
);
