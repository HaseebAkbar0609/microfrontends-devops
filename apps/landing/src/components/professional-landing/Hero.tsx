"use client";

import { useState, useEffect } from "react";
import { getProfessionalRegisterUrl } from "@/utils/constants";
import Hero from "../common/hero";

const ProfessionalLandingHero: React.FC = () => {
	const [professionalRegisterUrl, setProfessionalRegisterUrl] = useState<string>("#");

	useEffect(() => {
		setProfessionalRegisterUrl(getProfessionalRegisterUrl());
	}, []);

	return (
		<Hero
			background="bg-[url('/images/hero/1.png')]"
			formTitle="Kraftfull programvara för hantverksbranschen"
			formDescription="Timeflowsystem har komplett verktyg för projekthantering och leads - få nya jobb idag"
			formButton="FORTSÄTT REGISTRERINGEN"
			formButtonLink={professionalRegisterUrl}
		/>
	);
};

export default ProfessionalLandingHero;
