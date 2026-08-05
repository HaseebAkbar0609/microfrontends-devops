import { B2BCompanyView } from "@/features/b2b/components/B2BCompanyView";
import { DUMMY_COMPANY_DETAIL } from "@/features/b2b/constants/companyMock";

export default function B2BCompanyPage() {
  return <B2BCompanyView data={DUMMY_COMPANY_DETAIL} />;
}
