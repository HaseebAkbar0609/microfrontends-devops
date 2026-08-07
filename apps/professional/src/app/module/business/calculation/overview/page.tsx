import { CalculationOverviewView } from "@/features/calculation/components/CalculationOverviewView";
import { DUMMY_CALC_OVERVIEW_LIST } from "@/features/calculation/constants/overviewMock";

export default function CalculationOverviewPage() {
  return <CalculationOverviewView items={DUMMY_CALC_OVERVIEW_LIST} />;
}
