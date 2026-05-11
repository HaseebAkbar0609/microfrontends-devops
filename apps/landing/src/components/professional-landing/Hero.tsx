import { PROFESSIONAL_REGISTER_URL } from "@/utils/constants";
import Hero from "../common/hero";

const ProfessionalLandingHero: React.FC = () => {
	return (
		<Hero
			background="bg-[url('/images/hero/1.png')]"
			formTitle="Kraftfull programvara för hantverksbranschen"
			formDescription="Timeflowsystem har komplett verktyg för projekthantering och leads - få nya jobb idag"
			formButton="FORTSÄTT REGISTRERINGEN"
			formButtonLink={PROFESSIONAL_REGISTER_URL}
		/>
	);
};

export default ProfessionalLandingHero;
