import { TabsContent } from "@/components/ui/tabs";
import { CompanyWelcomeBanner } from "../CompanyWelcomeBanner";
import { CompanyDetailsCard } from "../CompanyDetailsCard";
import { CreditInformationCard } from "../CreditInformationCard";
import { CertificatesTable } from "../CertificatesTable";
import { PersonnelTable } from "../PersonnelTable";
import {
	COMPANY_DESCRIPTION,
	DUMMY_CERTIFICATES,
	DUMMY_PERSONNEL,
} from "../../../constants";

export function CompanyInfoTab() {
	return (
		<TabsContent value="company-info">
			<div className="space-y-8 animate-in fade-in duration-300">
				<CompanyWelcomeBanner
					companyName="Målarfirman Solen AB"
					imageUrl="/assets/images/bathroom_repair_intro.png"
					description={COMPANY_DESCRIPTION}
				/>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
					<CompanyDetailsCard
						companyName="Målarfirman Solen AB"
						website="www.malarfirman.se"
						address="Storgatan 11B"
						city="Solna"
						parentCompany="Pelle Construction"
						mobile="08-580 50 50"
						email="info@malarfirman.se"
					/>
					<CreditInformationCard
						companyName="Målarfirman Solen AB"
						registeredFTax="YES"
						registeredVat="YES"
						boardInformation="NO"
					/>
				</div>

				<CertificatesTable certificates={DUMMY_CERTIFICATES} />

				<PersonnelTable personnel={DUMMY_PERSONNEL} />
			</div>
		</TabsContent>
	);
}
