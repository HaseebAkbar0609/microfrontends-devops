import { KmaOverviewPage } from "@/features/kma/components/KmaOverviewPage";
import { MOCK_KMA_ITEMS } from "@/features/kma/constants/overviewMock";

export default function Page() {
	return <KmaOverviewPage items={MOCK_KMA_ITEMS} />;
}
