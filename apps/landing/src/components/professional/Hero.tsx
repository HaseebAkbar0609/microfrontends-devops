import { PROFESSIONAL_REGISTER_URL } from "@/utils/constants";
import Hero from "../common/hero";

const ProfessionalHero: React.FC = () => {
	return (
		<div>
			<Hero
				background="bg-[url('/images/professional_hero.jpg')]"
				formTitle="Kraftfull programvara för hantverksbranschen"
				formDescription="Timeflowsystem har komplett verktyg för projekthantering och leads - få nya jobb idag"
				formButton="FORTSÄTT REGISTRERINGEN"
				formButtonLink={PROFESSIONAL_REGISTER_URL}
			/>
			<div className="bg-primary-500">
				<div className="container mx-auto py-8 px-4 text-black">
					Enkel allt-i-ett-programvara för hantverksbranschen
				</div>
			</div>
		</div>
	);
};

export default ProfessionalHero;
