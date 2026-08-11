"use client";

import { useState, useEffect } from "react";
import { Login, Ribbon } from "@/components/icons";
import { NewsProps } from "./News.types";
import Button from "../button";
import { useRouter } from "next/router";
import {
	getCustomerRegisterUrl,
	getProfessionalRegisterUrl,
} from "@/utils/constants";

const News: React.FC<NewsProps> = ({ resource }) => {
	const { pathname } = useRouter();
	const isProfessional = pathname.includes("/professional");
	const [registerLink, setRegisterLink] = useState<string>("#");

	useEffect(() => {
		// Dynamic link
		const url = isProfessional
			? getProfessionalRegisterUrl()
			: getCustomerRegisterUrl();
		setRegisterLink(url);
	}, [isProfessional]);

	return (
		<>
			<div className="flex justify-center">
				<Ribbon />
			</div>

			<div className="mt-4 md:mt-8 grid lg:grid-cols-2 gap-8">
				{resource.map((item, key) => (
					<div
						key={key}
						className="flex flex-col md:flex-row gap-4 p-5 rounded-xl bg-white border border-[#E0E0E0] hover:border-primary-500"
					>
						<div className="md:flex-2/5 bg-primary-500 rounded-xl flex justify-center items-center overflow-hidden">
							<img
								className="object-cover w-full h-full"
								src={item.image}
								alt="news_1.png"
							/>
						</div>
						<div className="md:flex-3/5">
							<p className="text-sm text-primary-500">
								{item.date}
							</p>
							<p className="mt-4 font-bold text-xl">
								{item.title}
							</p>
							<p className="mt-4 text-base text-[#5B5B5B] line-clamp-6">
								{item.description}
							</p>
						</div>
					</div>
				))}
			</div>

			<div className="mt-4 md:mt-8 flex flex-col gap-4 justify-center items-center">
				<a href={registerLink} rel="noopener noreferrer">
					<Button className="flex gap-4 items-center">
						Skapa konto
						<Login width={20} height={20} color="white" />
					</Button>
				</a>
				<p className="text-xl text-[#5B5B5B]">
					Skapa ditt TimeFlow-konto och hitta hantverkare
				</p>
			</div>
		</>
	);
};

export default News;
