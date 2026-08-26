"use client";

import { ComingSoonPage } from "@/components/common/ComingSoonPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Images } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

/**
 * Third tab of the wizard. TFS-805 links a Figma frame for this tab, but that
 * frame could not be read while building (Figma MCP seat quota), so the tab is
 * rendered as a placeholder rather than guessed at. It is deliberately kept in
 * the tab row so the navigation matches the design.
 */
export function MachinePhotosStep() {
	return (
		<Card>
			<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium">
					<Images className="h-5 w-5 text-slate-700" />
					<Translate text={localizationConstants.machineCreateTabPhotos} />
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ComingSoonPage hideTitle />
			</CardContent>
		</Card>
	);
}
