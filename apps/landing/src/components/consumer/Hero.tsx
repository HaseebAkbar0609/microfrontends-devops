"use client";

import { useState, useEffect } from "react";
import { getCustomerRegisterUrl } from "@/utils/constants";
import Button from "../common/button";
import HeroForm from "../common/hero-form";

const ConsumerHero: React.FC = () => {
	const [customerRegisterUrl, setCustomerRegisterUrl] = useState<string>("#");

	useEffect(() => {
		setCustomerRegisterUrl(getCustomerRegisterUrl());
	}, []);

	return (
		<div className="grid md:grid-cols-2">
			<div className="bg-[url('/images/consumer/hero_1.png')] bg-cover bg-no-repeat bg-center flex justify-center items-center py-8 px-4 lg:py-16 lg:px-25">
				<HeroForm
					title={"Registrera ert projekt och Kom igång direkt"}
					description={
						"Timeflowsystem har komplett verktyg för privatpersoner att få offerter och gratis verktyg för projekthantering"
					}
					button={"Registrera ert projekt - Fortsätt"}
					buttonLink={customerRegisterUrl}
				/>
			</div>
			<div className="bg-[url('/images/consumer/hero_2.png')] bg-cover bg-no-repeat bg-center relative flex items-center">
				<div className="absolute w-full h-full opacity-80 bg-primary-500"></div>
				<div className="flex flex-col gap-4 items-center md:items-start text-white py-8 px-4 lg:py-16 lg:px-25 z-10">
					<p className="header-primary-size font-bold">
						Hitta rätt hantverkare – få offert & hantera ditt
						projekt i mobilen
					</p>
					<p className="content-primary-size">
						Skapa ett konto och få offerter från kvalitetssäkrade
						proffs – helt kostnadsfritt för dig.
					</p>
					<a href={customerRegisterUrl}>
						<Button>Skapa konto</Button>
					</a>
				</div>
			</div>
		</div>
	);
};

export default ConsumerHero;
