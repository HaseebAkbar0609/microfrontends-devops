"use client";

import { ComingSoonPage } from "@/components/common/ComingSoonPage";
import { PageHeader } from "@/components/layout/PageHeader";
import { vehicleBreadcrumbs } from "@/features/vehicle/data/vehicleNav.config";
import localizationConstants from "@/utils/translation/constants";

export default function VehicleArchivePage() {
	return (
		<div className="flex flex-1 flex-col bg-slate-50/50">
			<PageHeader
				title={localizationConstants.vehicleTabArchive}
				breadcrumbs={vehicleBreadcrumbs(localizationConstants.vehicleTabArchive)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>
			<ComingSoonPage hideTitle />
		</div>
	);
}
