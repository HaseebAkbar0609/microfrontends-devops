import { TabsContent } from "@/components/ui/tabs";
import { CompanyWelcomeBanner } from "../CompanyWelcomeBanner";
import { CompanyDetailsCard } from "../CompanyDetailsCard";
import { CreditInformationCard } from "../CreditInformationCard";
import { CertificatesTable } from "../CertificatesTable";
import { PersonnelTable } from "../PersonnelTable";
import type { QuoteSupplier } from "../../../types/form";

interface CompanyInfoTabProps {
	supplier?: QuoteSupplier | null;
}

export function CompanyInfoTab({ supplier }: CompanyInfoTabProps) {
	const name = supplier?.companyName || "Supplier";
	const desc = `Welcome to ${name}. We provide professional services tailored to your project requirements.`;

	return (
		<TabsContent value="company-info">
			<div className="space-y-8 animate-in fade-in duration-300">
				<CompanyWelcomeBanner
					companyName={name}
					imageUrl="/assets/images/bathroom_repair_intro.png"
					description={desc}
				/>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
					<CompanyDetailsCard
						companyName={name}
						website="-"
						address="-"
						city="-"
						parentCompany={name}
						mobile={supplier?.mobileNumber || "-"}
						email={supplier?.emailAddress || "-"}
					/>
					<CreditInformationCard
						companyName={name}
						registeredFTax="-"
						registeredVat="-"
						boardInformation="-"
					/>
				</div>

				<CertificatesTable certificates={[]} />

				<PersonnelTable personnel={[]} />
			</div>
		</TabsContent>
	);
}
