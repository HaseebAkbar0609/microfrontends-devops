"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
	ArrowBigRightDash,
	ArrowLeft,
	Briefcase,
	FileText,
	Heart,
	Image as ImageIcon,
	Map,
	MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { OfferModuleHeader } from "./OfferModuleHeader";
import { BusinessOfferModal } from "./BusinessOfferModal";
import { BusinessExpressModal } from "./BusinessExpressModal";
import { BusinessRentModal } from "./BusinessRentModal";
import { OfferConfirmationModal } from "./OfferConfirmationModal";
import { MODAL_CONSTANTS, type ModalType } from "@/constants/constant";
import useModal from "@/features/auth/hooks/useModal";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { OfferSendData } from "../types";
import { DUMMY_OFFERS } from "../constants/offerList";
import { DUMMY_OFFER_SEND } from "../constants/offerSend";
import { toggleOfferFavoriteAPIAction } from "@/api-actions/offers";

interface OfferAvailableProjectOpenedViewProps {
	offerId: string;
	initialData?: OfferSendData;
}

const getDocumentIconSrc = (filename: string) => {
	const ext = filename.split(".").pop()?.toLowerCase();
	if (ext === "doc" || ext === "docx") return "/file-type-doc.png";
	return "/file-type-pdf.png";
};

export function OfferAvailableProjectOpenedView({
	offerId,
	initialData,
}: OfferAvailableProjectOpenedViewProps) {
	const t = useTranslate();
	const router = useRouter();

	const matchedOffer = useMemo(() => {
		return DUMMY_OFFERS.find((o) => o.id === offerId) ?? DUMMY_OFFERS[0];
	}, [offerId]);

	const data: OfferSendData = useMemo(() => {
		if (initialData) return initialData;

		return {
			...DUMMY_OFFER_SEND,
			id: offerId,
			title: matchedOffer?.jobName || "Köksrenoveringsjobb",
			postedDate: "2024-12-18",
			type: matchedOffer?.type || "Express",
			badges: [
				"Expressen är bättre",
				"Stockholm",
				matchedOffer?.municipality || "Järfälla",
			],
			description:
				"Företaget behöver Beprövad erfarenhet av köksrenovering eller inredning. Ett skarpt öga för designtrender och en passion för att skapa snygga och funktionella utrymmen.",
			images: [
				{ id: "img-1", label: "Photo.img" },
				{ id: "img-2", label: "Photo.img" },
				{ id: "img-3", label: "Photo.img" },
			],
			extraImagesCount: 6,
			documents: [
				{ id: "doc-1", label: "Förmulärsmall #1.doc" },
				{ id: "doc-2", label: "Förmulärsmall #1.doc" },
				{ id: "doc-3", label: "projekt.pdf" },
			],
			drawings: [
				{ id: "drawing-1", label: "projekt.pdf" },
				{ id: "drawing-2", label: "bild 1" },
				{ id: "drawing-3", label: "bild 1" },
				{ id: "drawing-4", label: "bild 1" },
			],
		};
	}, [initialData, offerId, matchedOffer]);

	const [isFavorite, setIsFavorite] = useState<boolean>(
		matchedOffer?.isFavorite ?? false,
	);

	const { isOpen, openModal, closeModal, type } = useModal<ModalType>();

	const handleToggleFavorite = async () => {
		const next = !isFavorite;
		setIsFavorite(next);
		if (next) {
			showToast(
				"success",
				t(localizationConstants.offerDetailMarkAsFavourite) ||
					"Marked as favorite",
			);
		}
		try {
			await toggleOfferFavoriteAPIAction(offerId, next);
		} catch {
			// graceful fallback
		}
	};

	const handleOpenTakeJobModal = () => {
		const typeStr = data.type.toLowerCase();
		const isExpress = typeStr.includes("express");
		const isRent = typeStr.includes("rent") || typeStr.includes("hyra");
		const isConfirmation =
			typeStr.includes("confirm") ||
			typeStr.includes("direkt") ||
			typeStr.includes("direct");

		if (isConfirmation) {
			openModal(MODAL_CONSTANTS.OFFER_CONFIRMATION, offerId);
			return;
		}

		if (isExpress) {
			openModal(MODAL_CONSTANTS.BUSINESS_EXPRESS, offerId);
			return;
		}

		if (isRent) {
			openModal(MODAL_CONSTANTS.BUSINESS_RENT, offerId);
			return;
		}

		openModal(MODAL_CONSTANTS.BUSINESS_OFFER, offerId);
	};

	const handleModalConfirm = () => {
		closeModal();
		const formType = data.type.toLowerCase().includes("rent") || data.type.toLowerCase().includes("hyra")
			? "rent"
			: data.type.toLowerCase().includes("express")
				? "express"
				: "b2c";
		router.push(`/module/business/offer/send/${offerId}?type=${formType}`);
	};

	const projectCode = matchedOffer?.idNumber || "OFN001";

	return (
		<div className="flex flex-1 flex-col bg-slate-50 min-h-screen font-sans">
			{/* Top Offer Module Header with Tabs */}
			<OfferModuleHeader activeTab="available" />

			{/* Back Navigation Bar & Breadcrumb */}
			<div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-1">
				<button
					type="button"
					onClick={() => router.push("/module/business/offer/list")}
					className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900 hover:text-slate-700 cursor-pointer transition-colors"
				>
					<ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.25]" />
					<span>
						<Translate text={localizationConstants.offerTabAvailable} />
					</span>
				</button>

				{/* Breadcrumb path */}
				<nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-1 pl-0 sm:pl-7 font-normal">
					<span className="hover:text-slate-700 cursor-pointer" onClick={() => router.push("/home")}>
						<Translate text={localizationConstants.moduleItem} />
					</span>
					<span className="text-slate-400">&gt;</span>
					<span className="hover:text-slate-700 cursor-pointer" onClick={() => router.push("/module/business")}>
						<Translate text={localizationConstants.business} />
					</span>
					<span className="text-slate-400">&gt;</span>
					<span className="hover:text-slate-700 cursor-pointer" onClick={() => router.push("/module/business/offer/list")}>
						<Translate text={localizationConstants.offerList} />
					</span>
					<span className="text-slate-400">&gt;</span>
					<span className="text-slate-900 font-semibold">{projectCode}</span>
				</nav>
			</div>

			{/* Main Content Area */}
			<div className="px-4 sm:px-6 py-3 sm:py-4 flex-1 flex flex-col pb-10">
				<div className="flex flex-col gap-6 pl-0 sm:pl-7">
					{/* Main Project Card Container */}
					<div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 sm:p-6">
						{/* Top Row: Title, Date, Badges & Action Buttons */}
						<div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
							{/* Left: Project title & metadata */}
							<div className="flex flex-col flex-1 min-w-0">
								<h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight break-words">
									{data.title}
								</h1>

								<p className="text-xs text-slate-500 mt-1">
									{`${t(localizationConstants.offerDetailPostedLabel) || "Publicerat"}: ${data.postedDate}`}
								</p>

								{/* Badges */}
								<div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3">
									<span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
										<Briefcase className="h-3.5 w-3.5 stroke-2 shrink-0" />
										<span>{data.badges[0] || "Expressen är bättre"}</span>
									</span>

									<span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
										<Map className="h-3.5 w-3.5 stroke-2 shrink-0" />
										<span>{data.badges[1] || "Stockholm"}</span>
									</span>

									<span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
										<MapPin className="h-3.5 w-3.5 stroke-2 shrink-0" />
										<span>{data.badges[2] || "Järfälla"}</span>
									</span>
								</div>
							</div>

							{/* Right: Action Buttons */}
							<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 pt-1 w-full lg:w-auto">
								<Button
									type="button"
									variant="outline"
									onClick={handleToggleFavorite}
									className="h-9 px-4 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-900 flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors w-full sm:w-auto"
								>
									<Heart
										className={cn(
											"h-4 w-4 stroke-2",
											isFavorite
												? "fill-slate-900 text-slate-900"
												: "text-slate-700 fill-none",
										)}
									/>
									<span>
										{t(localizationConstants.offerDetailMarkAsFavourite) || "Mark as favorite"}
									</span>
								</Button>

								<Button
									type="button"
									onClick={handleOpenTakeJobModal}
									className="h-9 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors w-full sm:w-auto"
								>
									<ArrowBigRightDash className="h-4 w-4 stroke-2" />
									<span>
										<Translate text={localizationConstants.takeJob} />
									</span>
								</Button>
							</div>
						</div>

						{/* Divider */}
						<div className="h-px w-full bg-slate-100 my-5" />

						{/* Section: Beskrivning */}
						<div className="space-y-2">
							<h2 className="text-sm font-bold text-slate-900">
								<Translate text={localizationConstants.offerDetailDescriptionTitle} />
							</h2>
							<p className="text-xs text-slate-600 leading-relaxed max-w-4xl font-normal">
								{data.description}
							</p>
						</div>

						{/* Divider */}
						<div className="h-px w-full bg-slate-100 my-5" />

						{/* Section: Dokument och Bilder */}
						<div className="space-y-5">
							<h2 className="text-sm font-bold text-slate-900">
								<Translate text={localizationConstants.offerSendDocumentsAndImages} />
							</h2>

							{/* Sub-block 1: Bilder */}
							<div className="space-y-3">
								<h3 className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.offerDetailImagesTitle} />
								</h3>

								<div className="flex flex-wrap gap-3 sm:gap-4">
									{data.images.map((img) => (
										<div key={img.id} className="flex flex-col items-center w-27">
											<div className="h-22 w-27 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
												<Image
													src="/offer-details.png"
													alt={img.label}
													width={108}
													height={88}
													className="h-full w-full object-cover"
												/>
											</div>
											<span className="mt-2 w-full truncate text-center text-xs text-slate-500">
												{img.label}
											</span>
										</div>
									))}

									{/* Placeholder boxes */}
									<div className="flex flex-col items-center w-27">
										<div className="flex h-22 w-27 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
											<ImageIcon className="h-6 w-6 text-slate-400 stroke-[1.5]" />
										</div>
										<span className="mt-2 w-full truncate text-center text-xs text-slate-500">
											Photo.img
										</span>
									</div>

									<div className="flex flex-col items-center w-27">
										<div className="flex h-22 w-27 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
											<ImageIcon className="h-6 w-6 text-slate-400 stroke-[1.5]" />
										</div>
										<span className="mt-2 w-full truncate text-center text-xs text-slate-500">
											Photo.img
										</span>
									</div>

									<div className="flex flex-col items-center w-27">
										<div className="flex h-22 w-27 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
											<ImageIcon className="h-6 w-6 text-slate-400 stroke-[1.5]" />
										</div>
										<span className="mt-2 w-full truncate text-center text-xs text-slate-500 font-medium">
											+6 more
										</span>
									</div>
								</div>
							</div>

							{/* Divider */}
							<div className="h-px w-full bg-slate-100 my-4" />

							{/* Sub-block 2: Dokumentera */}
							<div className="space-y-3">
								<h3 className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.offerDetailDocumentTitle} />
								</h3>

								<div className="flex flex-wrap gap-3 sm:gap-4">
									{data.documents.map((doc) => (
										<div key={doc.id} className="flex flex-col items-center w-27">
											<div className="flex h-18 w-27 items-center justify-center rounded-lg bg-transparent">
												<Image
													src={getDocumentIconSrc(doc.label)}
													alt={doc.label}
													width={40}
													height={40}
													className="h-10 w-10 object-contain"
												/>
											</div>
											<span className="mt-2 w-full truncate text-center text-xs text-slate-700 font-medium">
												{doc.label}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Divider */}
							<div className="h-px w-full bg-slate-100 my-4" />

							{/* Sub-block 3: Ritning */}
							<div className="space-y-3">
								<h3 className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.offerDetailDrawingTitle} />
								</h3>

								<div className="flex flex-wrap gap-3 sm:gap-4">
									{data.drawings.map((drawing) => {
										const isPdf = drawing.label.toLowerCase().endsWith(".pdf");
										return (
											<div key={drawing.id} className="flex flex-col items-center w-27">
												<div className="flex h-18 w-27 items-center justify-center rounded-lg bg-transparent">
													{isPdf ? (
														<Image
															src="/file-type-pdf.png"
															alt={drawing.label}
															width={40}
															height={40}
															className="h-10 w-10 object-contain"
														/>
													) : (
														<FileText className="h-10 w-10 text-slate-300 stroke-[1.25]" />
													)}
												</div>
												<span className="mt-2 w-full truncate text-center text-xs text-slate-700 font-medium">
													{drawing.label}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Modal Dialogs */}
			{isOpen && type === MODAL_CONSTANTS.BUSINESS_OFFER && (
				<BusinessOfferModal
					open={isOpen}
					onOpenChange={(openState) => {
						if (!openState) closeModal();
					}}
					quote={{ id: offerId, type: data.type }}
					onConfirm={handleModalConfirm}
				/>
			)}
			{isOpen && type === MODAL_CONSTANTS.BUSINESS_EXPRESS && (
				<BusinessExpressModal
					open={isOpen}
					onOpenChange={(openState) => {
						if (!openState) closeModal();
					}}
					quote={{ id: offerId, type: data.type }}
					onConfirm={handleModalConfirm}
				/>
			)}
			{isOpen && type === MODAL_CONSTANTS.BUSINESS_RENT && (
				<BusinessRentModal
					open={isOpen}
					onOpenChange={(openState) => {
						if (!openState) closeModal();
					}}
					quote={{ id: offerId, type: data.type }}
					onConfirm={handleModalConfirm}
				/>
			)}
			{isOpen && type === MODAL_CONSTANTS.OFFER_CONFIRMATION && (
				<OfferConfirmationModal
					open={isOpen}
					onOpenChange={(openState) => {
						if (!openState) closeModal();
					}}
					onConfirm={handleModalConfirm}
				/>
			)}
		</div>
	);
}

export default OfferAvailableProjectOpenedView;
