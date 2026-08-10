"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import {
	FaThumbsUp,
	FaLock,
	FaCalculator,
	FaShoppingCart,
	FaCog,
} from "react-icons/fa";
import { AiOutlineProject, AiOutlineDatabase } from "react-icons/ai";
import {
	MdOutlinePeople,
	MdOutlineGavel,
	MdOutlineAnalytics,
} from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import Button from "../common/button";
import { getProfessionalRegisterUrl } from "@/utils/constants";

const ProfessionalSmartFeatures: React.FC = () => {
	const [professionalRegisterUrl, setProfessionalRegisterUrl] = useState<string>("");

	useEffect(() => {
		setProfessionalRegisterUrl(getProfessionalRegisterUrl());
	}, []);
	interface FeatureItemType {
		label: string;
		icon: ReactNode;
		path?: string;
	}

	const data: Record<string, FeatureItemType[]> = {
		business: [
			{
				label: "OFFERT",
				icon: <FaThumbsUp />,
				path: "/professional/offer",
			},
			{ label: "B2B", icon: <FaLock />, path: "/professional/B2b_page" },
			{
				label: "KALKYL",
				icon: <FaCalculator />,
				path: "/professional/Calculation",
			},
		],
		production: [
			{
				label: "PROJEKTERING",
				icon: <AiOutlineProject />,
				path: "/professional/Project_Design",
			},
			{ label: "KMA", icon: <FaCog />, path: "/professional/KMA" },
			{ label: "ORDER", icon: <FaCog />, path: "/professional/Order" },
			{
				label: "PROJEKT",
				icon: <AiOutlineProject />,
				path: "/professional/Project",
			},
			{
				label: "INKÖP",
				icon: <FaShoppingCart />,
				path: "/professional/Purchase",
			},
			{
				label: "MATERAIL - LAGER",
				icon: <FaCog />,
				path: "/professional/Material",
			},
			{
				label: "FORDON",
				icon: <FaCog />,
				path: "/professional/vehicle",
			},
			{
				label: "MASKIN",
				icon: <FaCog />,
				path: "/professional/Machine",
			},
			{
				label: "ÅTKOMST",
				icon: <FaCog />,
				path: "/professional/Access",
			},
		],
		economy: [
			{
				label: "EKONOMI",
				icon: <MdOutlineAnalytics />,
				path: "/professional/Economy",
			},
			{
				label: "FAKTURA",
				icon: <AiOutlineProject />,
				path: "/professional/Invoice",
			},
			{
				label: "PROGNOS",
				icon: <MdOutlineAnalytics />,
				path: "/professional/Forecast",
			},
			{
				label: "PERSONAL",
				icon: <MdOutlinePeople />,
				path: "/professional/Personal",
			},
			{
				label: "INKASSO",
				icon: <FiSearch />,
				path: "/professional/Collection",
			},
			{
				label: "JURIDIK",
				icon: <MdOutlineGavel />,
				path: "/professional/Legal",
			},
		],
		work: [
			{
				label: "AVTAL",
				icon: <AiOutlineProject />,
				path: "/professional/Agreement",
			},
			{
				label: "MALLAR",
				icon: <AiOutlineDatabase />,
				path: "/professional/Goods",
			},
			{
				label: "MARKNAD-SÄLJ",
				icon: <FiSearch />,
				path: "/professional/Market",
			},
			{
				label: "DATA-IT",
				icon: <AiOutlineDatabase />,
				path: "/professional/Data",
			},
			{
				label: "LEDNINGSSTÖD",
				icon: <FaCog />,
				path: "/professional/Management",
			},
		],
	};

	return (
		<div id="smart-features" className="bg-[#F5F5F5] pt-10">
			<div className="container mx-auto flex flex-col items-center py-8 px-4">
				{/* Header */}
				<div className="text-center">
					<h1 className="header-primary-size font-bold">
						Smarta funktioner / Moduler
					</h1>
					<p className="content-primary-size text-[#5B5B5B] mt-4">
						Marknadens smartaste funktioner för enkel hantering
					</p>
				</div>

				{/* Sub Header */}
				<div className="text-center mt-8">
					<h4 className="header-secondary-size">
						Anpassade lösningar för just din verksamhet
					</h4>
					<p className="content-primary-size text-[#5B5B5B] mt-4">
						Mindre administration, mer intäkter - vårt system gör
						jobbet enklare för hantverksföretag.
					</p>
				</div>

				{/* Features Grid */}
				<div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:px-4 lg:px-8">
					{Object.keys(data).map((sectionKey) => (
						<div key={sectionKey} className="flex flex-col gap-3">
							{data[sectionKey].map((sub, key) =>
								sub.path ? (
									<Link
										key={key}
										href={sub.path}
										className="px-8 py-3 bg-white cursor-pointer border hover:border-[#FF914D] rounded-lg flex items-center gap-3 transition-all duration-200"
									>
										<span className="text-xl text-black">
											{sub.icon}
										</span>
										<p className="text-base">{sub.label}</p>
									</Link>
								) : (
									<div
										key={key}
										className="px-8 py-3 bg-white border rounded-lg flex items-center gap-3"
									>
										<span className="text-xl text-black">
											{sub.icon}
										</span>
										<p className="text-base">{sub.label}</p>
									</div>
								),
							)}
						</div>
					))}
				</div>

				{/* CTA Button */}
				<div className="mt-8 text-center">
					<a href={professionalRegisterUrl}>
						<Button>Skapa konto</Button>
					</a>
				</div>
			</div>
		</div>
	);
};

export default ProfessionalSmartFeatures;
