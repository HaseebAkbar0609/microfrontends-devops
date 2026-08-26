"use client";

import { ComingSoonPage } from "@/components/common/ComingSoonPage";

/**
 * The "Gantt-schema" tab exists in the TFS-803 Figma frame but its contents are
 * not designed yet — only the tab label is. Rendering the shared placeholder
 * keeps the tab row faithful to the design without inventing an undesigned
 * timeline. The scheduling view is expected to be built on a third-party Gantt
 * component (Bryntum / Syncfusion / DHTMLX) rather than hand-rolled, so this
 * stays a seam rather than a partial implementation.
 */
export function MachineGanttTab() {
	return (
		<div className="rounded-lg bg-white">
			<ComingSoonPage hideTitle />
		</div>
	);
}
