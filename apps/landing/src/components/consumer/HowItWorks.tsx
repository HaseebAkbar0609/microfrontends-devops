"use client";

import { useState, useEffect } from "react";
import Blog from "../common/blog";
import Button from "../common/button";
import Link from "next/link";
import { Building, Edit, Employee } from "../icons";
import { getCustomerRegisterUrl } from "@/utils/constants";

const ConsumerHowItWorks: React.FC = () => {
	const [customerRegisterUrl, setCustomerRegisterUrl] = useState<string>("");

	useEffect(() => {
		setCustomerRegisterUrl(getCustomerRegisterUrl());
	}, []);
	const data = [
		{
			background: "bg-[url('/images/consumer/howitworks/bg_hover.svg')]",
			icon: (
				<div className="w-10 h-10 lg:w-20 lg:h-20">
					<Edit />
				</div>
			),
			title: "Lägg upp ditt jobb",
			description: "Beskriv vad du behöver hjälp med",
			button: "Step 1",
		},
		{
			background:
				"bg-[url('/images/consumer/howitworks/bg_default.svg')]",
			icon: (
				<div className="w-10 h-10 lg:w-20 lg:h-20">
					<Employee />
				</div>
			),
			title: "Jämför offerter",
			description: "Få svar från kvalitetssäkrade hantverkare",
			button: "Step 2",
		},
		{
			background:
				"bg-[url('/images/consumer/howitworks/bg_default.svg')]",
			icon: (
				<div className="w-10 h-10 lg:w-20 lg:h-20">
					<Building />
				</div>
			),
			title: "Hantera projektet",
			description: "Sköt allt direkt i TimeFlow",
			button: "Step 3",
		},
	];

	return (
		<div className="container mx-auto px-4 mt-10 lg:mt-20">
			<div className="flex flex-col gap-4">
				<p className="header-primary-size font-bold text-center">
					Så funkar det
				</p>

				{/* Steps Grid */}
				<div className="grid xl:grid-cols-3 gap-10 mt-4 md:mt-8 justify-center items-stretch">
					{data.map((item, key) => (
						<div
							key={key}
							className={`${item.background} bg-contain bg-no-repeat bg-center aspect-4/3 w-full flex flex-col items-center md:items-start justify-center p-6 pr-12 lg:p-8`}
						>
							{item.icon}
							<div className="mt-4 md:mt-8">
								<p className="content-primzry-size font-bold">
									{item.title}
								</p>
								<p className="content-primzry-size">
									{item.description}
								</p>
							</div>
							<button
								className={`rounded-4xl bg-primary-500 hover:bg-[#E8823D] text-white px-4 py-2 transition-colors duration-200 cursor-pointer mt-4 md:mt-8`}
							>
								{item.button}
							</button>
						</div>
					))}
				</div>
			</div>

			{/* 👇 Blog section with embedded video instead of image */}
			<div className="mt-8">
				<Blog
					direction="left"
					// Removed the image prop
					video={
						<div
							className="relative w-full rounded-xl overflow-hidden"
							style={{ aspectRatio: "16/9" }}
						>
							<iframe
								loading="lazy"
								title="Så här funkar det - TimeFlow Video"
								src="https://play.gumlet.io/embed/68f1eb22558b404636e47666"
								style={{
									border: "none",
									position: "absolute",
									top: 0,
									left: 0,
									height: "100%",
									width: "100%",
								}}
								className="rounded-xl shadow-lg"
								allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
							></iframe>
						</div>
					}
					title="Så här funkar det"
					description={
						<p>
							Lägg upp ditt jobb och välj mellan offerterna du får
							direkt i systemet TimeFlow.<br></br>
							Accepterar du en offert kan du sedan hantera hela
							projektet i TimeFlow – helt kostnadsfritt för dig.
							<br></br>
							Du får full koll och allt samlat på ett ställe, från
							avtal och fakturor till uppdateringar och
							godkännanden av utfört arbete.
						</p>
					}
					button={
						<Link href={customerRegisterUrl}>
							<Button className="mt-4">Skapa ditt konto</Button>
						</Link>
					}
				/>
			</div>
		</div>
	);
};

export default ConsumerHowItWorks;
