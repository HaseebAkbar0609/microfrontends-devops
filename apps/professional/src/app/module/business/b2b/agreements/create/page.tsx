import { B2BCreateAgreementView } from "@/features/b2b/components/B2BCreateAgreementView";

export default function B2BCreateAgreementPage() {
  // Project/offer context (if any) is read client-side from the URL's query
  // params inside the view -- real data is fetched from there, never seeded
  // from mock data or the server (no auth token/X-Company-ID on the server).
  return <B2BCreateAgreementView />;
}
