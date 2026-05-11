import { CUSTOMER_REGISTER_URL } from "@/utils/constants";
import Hero from "../common/hero";

const ConsumerLandingHero: React.FC = () => {
	return (
		<Hero
			background="bg-[url('https://res.cloudinary.com/dtlt4zkth/image/upload/v1759372068/5fe91ab6cfdd7d504439b51dca97ea12f80f1920_wvcjoa.png')]"
			formTitle="Registra ert projekt och Kom igång direkt"
			formDescription="Timeflowsystem har komplett verktyg för privatpersoner att få offerter och gratis verktyg för projekthantering"
			formButton="Registrera ert projekt - Fortsätt"
			formButtonLink={CUSTOMER_REGISTER_URL}
		/>
	);
};

export default ConsumerLandingHero;
