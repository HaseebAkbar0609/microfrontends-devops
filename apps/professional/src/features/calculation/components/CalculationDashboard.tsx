"use client";

import { useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import WidgetBoard from "@/features/widgetdashboard/components/board/WidgetBoard";
import {
	CALCULATION_BOARD_LIBRARY_ITEMS,
	CALCULATION_STANDARD_WIDGET_IDS,
} from "../constants/calculationWidgetBoard";
import { CALCULATION_SIDEBAR_WIDGET_MAP } from "./CalculationDashboardConfig";
import CalculationDashboardContent, { CALCULATION_CONNECTED_WIDGETS } from "./CalculationDashboardContent";
import { useCalculationDashboard } from "../hooks/useCalculationDashboard";

const CalculationDashboard = () => {
    const dashboard = useCalculationDashboard();
    const t = useTranslate();
    const widgetMap = useMemo(() => {
        const map = { ...CALCULATION_SIDEBAR_WIDGET_MAP };
        for (const kind of CALCULATION_CONNECTED_WIDGETS) {
            map[kind] = { ...map[kind], content: <CalculationDashboardContent kind={kind}
                data={dashboard.data} loading={dashboard.isPending || dashboard.isFetching} error={dashboard.isError} /> };
        }
        return map;
    }, [dashboard.data, dashboard.isPending, dashboard.isFetching, dashboard.isError]);
    return <>
    <div className="mb-3 flex justify-end">
        <Button variant="outline" size="icon" title={t(localizationConstants.calcDashboardRefresh)} aria-label={t(localizationConstants.calcDashboardRefresh)}
            disabled={dashboard.isFetching} onClick={() => void dashboard.refetch()}>
            <RefreshCw size={16} className={dashboard.isFetching ? "animate-spin" : ""} />
        </Button>
    </div>
	<WidgetBoard
		widgetMap={widgetMap}
		items={CALCULATION_BOARD_LIBRARY_ITEMS}
		standardWidgetIds={CALCULATION_STANDARD_WIDGET_IDS}
		persistenceLocation="calculation_dashboard"
	/>
    </>;
};

export default CalculationDashboard;
