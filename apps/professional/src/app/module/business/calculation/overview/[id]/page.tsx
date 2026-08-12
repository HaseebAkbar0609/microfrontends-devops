import { CalculationDetailView } from "@/features/calculation/components/CalculationDetailView";
import { DUMMY_KALKYL_DETAIL } from "@/features/calculation/constants/detailMock";

export default function CalculationDetailPage() {
	return <CalculationDetailView data={DUMMY_KALKYL_DETAIL} />;
}
