"use client";

import { CustomReportBuilderPage } from "../builder/CustomReportBuilderPage";

export interface CustomReportCreateRouteProps {
	/** Which module the builder is mounted in; Prognos by default. */
	basePath?: string;
}

/** What `/forecast/reports/custom/new` renders. */
export function CustomReportCreateRoute({ basePath }: CustomReportCreateRouteProps) {
	return <CustomReportBuilderPage basePath={basePath} />;
}

export default CustomReportCreateRoute;
