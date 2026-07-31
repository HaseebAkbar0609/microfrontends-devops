import ContractViewer from "@/features/my-pages/employment/components/ContractViewer";
import { getEmploymentContract } from "@/features/my-pages/employment/services/employmentService";

export default function Page() {
	return <ContractViewer contract={getEmploymentContract()} />;
}
