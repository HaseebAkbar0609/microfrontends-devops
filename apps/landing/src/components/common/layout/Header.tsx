"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "../button";
import { Down, Login } from "../../icons";
import { HeaderMenu } from "@/configs";

import Dropdown from "../dropdown";
import DropdownBranscher from "../DropdownBranscher";
import DropdownWhyTimeFlow from "../DropdownWhyTimeFlow";
import DropdownOmOss from "../DropdownOmOss";
import DropdownHomeMenu from "../DropdownHomeMenu";
import DropdownAboutMenu from "../DropdownAboutMenu";
import MobileMenu from "./MobileMenu";
import { getCustomerLoginUrl, getProfessionalLoginUrl } from "@/utils/constants";
import { useTranslation } from "react-i18next";
import { RegionDropdown } from "@/components/site/RegionDropdown";

const modulePaths = [
	"/professional/offer",
	"/professional/B2b_page",
	"/professional/Calculation",
	"/professional/Project_Design",
	"/professional/KMA",
	"/professional/Order",
	"/professional/Project",
	"/professional/Purchase",
	"/professional/Machine",
	"/professional/Economy",
	"/professional/Invoice",
	"/professional/Forecast",
	"/professional/Personal",
	"/professional/Collection",
	"/professional/Legal",
	"/professional/Agreement",
	"/professional/Goods",
	"/professional/Market",
	"/professional/Data",
	"/professional/Management",
];

const Header: React.FC = () => {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuCompRef = useRef<HTMLDivElement>(null);
	const [isProfessionalPage, setIsProfessionalPage] = useState(true);
	const [headerMenu, setHeaderMenu] = useState("professional");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const _path = router.pathname;
		setHeaderMenu(_path.split("/")[1] || "professional");
		setIsProfessionalPage(_path.includes("professional"));
	}, [router.pathname]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				menuCompRef.current &&
				!menuCompRef.current.contains(event.target as Node)
			) {
				setIsMenuOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleMobileLinkClick = () => setIsMobileMenuOpen(false);

	const { t } = useTranslation();

	// Button redirect logic
	const [buttonHref, setButtonHref] = useState<string>("#");

	useEffect(() => {
		setButtonHref(
			isProfessionalPage ? getProfessionalLoginUrl() : getCustomerLoginUrl()
		);
	}, [isProfessionalPage]);

	// Button text logic
	const buttonText = t("nav.login");

	const isModulePage = modulePaths.includes(router.pathname);

	return (
		<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
			<div className="container mx-auto flex flex-col gap-4 pt-4 pb-4 px-4">
				{/* Row 1: Logo + Selector + Button */}
				<div className="flex items-center justify-between w-full">
					{/* Left: Logo + selector */}
					<div className="flex items-end gap-4 md:gap-10">
						<Link
							href={
								isProfessionalPage ? "/professional" : "/consumer"
							}
						>
							<img
								src="/images/logo.png"
								className="w-40 h-auto"
								alt="logo.png"
							/>
						</Link>
						<div
							className="relative"
							onClick={() => setIsMenuOpen((val) => !val)}
							ref={menuCompRef}
						>
							<div className="flex gap-4 items-center cursor-pointer">
								<div className="text-primary-500">
									{isProfessionalPage
										? "Professionell"
										: "Konsument"}
								</div>
								<div
									className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""
										}`}
								>
									<Down />
								</div>
							</div>

							{/* Switch Menu */}
							<div
								className="absolute right-0 rounded-lg bg-white p-4 top-[36px] border border-gray-300 transition-opacity duration-300"
								style={{
									display: isMenuOpen ? "block" : "none",
									zIndex: 9999,
									opacity: isMenuOpen ? 1 : 0,
								}}
							>
								<div className="flex flex-col">
									<Link
										href="/professional"
										className={`${isProfessionalPage
												? "text-primary-500"
												: ""
											} hover:bg-primary-500 hover:text-white cursor-pointer rounded-[6px] px-4 py-2 transition-colors duration-200`}
									>
										Professionell
									</Link>
									<Link
										href="/consumer"
										className={`${isProfessionalPage
												? ""
												: "text-primary-500"
											} hover:bg-primary-500 hover:text-white cursor-pointer rounded-[6px] px-4 py-2 transition-colors duration-200`}
									>
										Konsument
									</Link>
								</div>
							</div>
						</div>
					</div>

					{/* Right: Button + Region Dropdown */}
					<div className="flex items-center gap-3">
						<RegionDropdown dropDirection="down" />
						<Link
							href={buttonHref}
							rel={
								buttonHref.startsWith("https")
									? "noopener noreferrer"
									: undefined
							}
						>
							<Button className="flex gap-2">
								{buttonText}{" "}
								<Login width={20} height={20} color="white" />
							</Button>
						</Link>
					</div>
				</div>

				{/* Row 2: Menu Items (centered) */}
				<div className="hidden lg:flex justify-center gap-6 text-[#5B5B5B] content-primary-size">
					{HeaderMenu[headerMenu]
						.filter((item) => {
							const label = item.label.toLowerCase();

							// Hide Webinar entirely on module pages
							if (isModulePage && label === "webinar") {
								return false;
							}

							// Show only On-demand Webinar on module pages
							if (isModulePage && label === "on-demand webinar") {
								return true;
							}

							// Hide On-demand Webinar on non-module pages
							if (!isModulePage && label === "on-demand webinar") {
								return false;
							}

							// Keep normal logic for everything else
							return label !== "on-demand webinar";
						})
						.map((item, key) => {
							const label = item.label.trim().toLowerCase();

							if (
								headerMenu === "consumer" &&
								label === "hitta hantverkare"
							) {
								return (
									<DropdownHomeMenu
										key={key}
										label={item.label}
									/>
								);
							} else if (
								headerMenu === "consumer" &&
								label === "om oss"
							) {
								return <DropdownAboutMenu key={key} />;
							} else if (label === "moduler") {
								return (
									<Dropdown
										key={key}
										label={item.label}
										noButtonStyle
									/>
								);
							} else if (label === "branscher") {
								return (
									<DropdownBranscher
										key={key}
										label={item.label}
									/>
								);
							} else if (label === "varför timeflow") {
								return <DropdownWhyTimeFlow key={key} />;
							} else if (label === "om oss") {
								return <DropdownOmOss key={key} />;
							} else {
								return (
									<Link
										key={key}
										href={item.path}
										target={
											item.path.includes("https")
												? "_blank"
												: "_self"
										}
										className="px-4 text-[#5B5B5B] hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200 content-primary-size"
										onClick={handleMobileLinkClick}
									>
										{item.label}
									</Link>
								);
							}
						})}
				</div>

				{/* Mobile Menu Toggle + Drawer */}
				<div className="flex lg:hidden">
					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="p-2 rounded-lg bg-primary-500 hover:bg-primary-600 transition-colors"
						aria-label="Toggle mobile menu"
					>
						<div className="w-6 h-6 flex flex-col justify-center items-center">
							<span
								className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isMobileMenuOpen
										? "rotate-45 translate-y-2"
										: ""
									}`}
							/>
							<span
								className={`block h-0.5 w-6 bg-white transition-all duration-300 mt-1 ${isMobileMenuOpen ? "opacity-0" : ""
									}`}
							/>
							<span
								className={`block h-0.5 w-6 bg-white transition-all duration-300 mt-1 ${isMobileMenuOpen
										? "-rotate-45 -translate-y-1"
										: ""
									}`}
							/>
						</div>
					</button>

					{/* Overlay */}
					<div
						className={`fixed inset-0 bg-opacity-50 z-40 transition-opacity duration-300 ${isMobileMenuOpen
								? "opacity-100"
								: "opacity-0 pointer-events-none"
							}`}
						onClick={() => setIsMobileMenuOpen(false)}
					/>

					{/* Mobile Drawer */}
					<div
						className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
							}`}
					>
						<div className="flex flex-col h-full">
							<div className="flex items-center justify-between p-5 border-b border-gray-200">
								<img
									src="/images/logo.png"
									width="120"
									height="auto"
									alt="TimeFlow Logo"
								/>
								<button
									onClick={() => setIsMobileMenuOpen(false)}
									className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
									aria-label="Close mobile menu"
								>
									<div className="w-4 h-4 flex flex-col justify-center items-center">
										<span className="block h-0.5 w-4 bg-gray-700 rotate-45 translate-y-0.9" />
										<span className="block h-0.5 w-4 bg-gray-700 -rotate-45 -translate-y-0.5" />
									</div>
								</button>
							</div>

							<div className="flex flex-col p-5 space-y-1 overflow-y-auto">
								<MobileMenu
									currentMenu={headerMenu}
									onClose={() => setIsMobileMenuOpen(false)}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
