"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
	ArrowBigRightDash,
	ArrowLeft,
	Briefcase,
	FileText,
	Heart,
	Map,
	MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import {
	getOfferDetailByIdAPIAction,
	toggleOfferFavoriteAPIAction,
} from "@/api-actions/offers";

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

	const [projectData, setProjectData] = useState<OfferSendData | null>(
		initialData ?? null,
	);
	const [isLoading, setIsLoading] = useState(!initialData);
	const [hasError, setHasError] = useState(false);
	const [isFavorite, setIsFavorite] = useState(Boolean(initialData?.isFavorite));
	const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

	// Fetch dynamic data from API if initialData was not passed from server
	useEffect(() => {
		let isMounted = true;
		if (!initialData && offerId) {
			setIsLoading(true);
			getOfferDetailByIdAPIAction(offerId)
				.then((res) => {
					if (!isMounted) return;
					if (res.success && res.data) {
						setProjectData(res.data);
						setIsFavorite(Boolean(res.data.isFavorite));
					} else {
						setHasError(true);
					}
				})
				.catch(() => isMounted && setHasError(true))
				.finally(() => isMounted && setIsLoading(false));
		}
		return () => {
			isMounted = false;
		};
	}, [offerId, initialData]);

	const { isOpen, openModal, closeModal, type } = useModal<ModalType>();

	const handleToggleFavorite = async () => {
		const previousState = isFavorite;
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
			const res = await toggleOfferFavoriteAPIAction(offerId, next);
			if (!res.success) {
				setIsFavorite(previousState);
				showToast("error", res.error || "Failed to update favorite");
			}
		} catch {
			setIsFavorite(previousState);
			showToast("error", "Failed to update favorite");
		}
	};

	const handleOpenTakeJobModal = () => {
		if (!projectData) return;
		if (projectData.contactMasked) {
			setUpgradeDialogOpen(true);
			return;
		}
		const typeStr = projectData.type.toLowerCase();
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
		if (!projectData) return;
		closeModal();
		const formType =
			projectData.type.toLowerCase().includes("rent") ||
			projectData.type.toLowerCase().includes("hyra")
				? "rent"
				: projectData.type.toLowerCase().includes("express")
					? "express"
					: "b2c";
		router.push(`/module/business/offer/send/${offerId}?type=${formType}`);
	};

	if (isLoading) return <div className="flex min-h-screen items-center justify-center">Loading project…</div>;
	if (hasError) return <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">Project could not be loaded. Please try again.</div>;
	if (!projectData) return null;
	const projectCode = projectData.id;

	return (
		<div className="flex flex-1 flex-col bg-slate-50 min-h-screen font-sans">
			{/* Top Offer Module Header with Tabs */}
			<OfferModuleHeader activeTab="available" />

			{/* Back Navigation Bar & Breadcrumb */}
			<div className="px-6 pt-5 pb-1">
				<button
					type="button"
					onClick={() => router.push("/module/business/offer/list")}
					className="flex items-center gap-2 text-base font-bold text-slate-900 hover:text-slate-700 cursor-pointer transition-colors"
				>
					<ArrowLeft className="h-5 w-5 stroke-[2.25]" />
					<span>
						<Translate text={localizationConstants.offerTabAvailable} />
					</span>
				</button>

				{/* Breadcrumb path */}
				<nav className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 pl-7 font-normal">
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
			<div className="px-6 py-4 flex-1 flex flex-col pb-10">
				<div className="flex flex-col gap-6 pl-7">
					{/* Main Project Card Container */}
					<div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6">
						{/* Top Row: Title, Date, Badges & Action Buttons */}
						<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
							{/* Left: Project title & metadata */}
							<div className="flex flex-col">
								<h1 className="text-xl font-bold text-slate-900 leading-tight">
									{projectData.title}
								</h1>

								<p className="text-xs text-slate-500 mt-1">
									{`${t(localizationConstants.offerDetailPostedLabel) || "Publicerat"}: ${projectData.postedDate}`}
								</p>

								{/* Badges */}
								<div className="flex flex-wrap items-center gap-2 mt-3">
									<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
										<Briefcase className="h-3.5 w-3.5 stroke-2" />
										<span>{projectData.badges[0] || "—"}</span>
									</span>

									<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
										<Map className="h-3.5 w-3.5 stroke-2" />
										<span>{projectData.badges[1] || "—"}</span>
									</span>

									<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
										<MapPin className="h-3.5 w-3.5 stroke-2" />
										<span>{projectData.badges[2] || "—"}</span>
									</span>
								</div>
							</div>

							{/* Right: Action Buttons */}
							<div className="flex items-center gap-3 shrink-0 pt-1">
								<Button
									type="button"
									variant="outline"
									onClick={handleToggleFavorite}
									className="h-9 px-4 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-900 flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
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
									className="h-9 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
								>
									<ArrowBigRightDash className="h-4 w-4 stroke-2" />
									<span>
										<Translate text={localizationConstants.takeJob} />
									</span>
								</Button>
							</div>
						</div>

						{/* Divider 1 - attached with border */}
						<div className="h-px bg-slate-200 -mx-6 my-5" />

						{/* Section: Beskrivning */}
						<div className="space-y-2">
							<h2 className="text-sm font-bold text-slate-900">
								<Translate
									text={localizationConstants.offerDetailDescriptionTitle}
								/>
							</h2>
							<p className="text-xs text-slate-600 leading-relaxed max-w-4xl font-normal">
								{projectData.description}
							</p>
						</div>

						{/* Divider 2 - attached with border */}
						<div className="h-px bg-slate-200 -mx-6 my-5" />

						{/* Section: Dokument och Bilder */}
						<div className="space-y-5">
							<h2 className="text-sm font-bold text-slate-900">
								<Translate
									text={localizationConstants.offerSendDocumentsAndImages}
								/>
							</h2>

							{/* Sub-block 1: Bilder */}
							<div className="space-y-3">
								<h3 className="text-xs font-semibold text-slate-700">
									<Translate
										text={localizationConstants.offerDetailImagesTitle}
									/>
								</h3>

								<div className="flex flex-wrap gap-4">
									{projectData.images.length === 0 && (
										<p className="text-xs text-slate-500">No images attached.</p>
									)}
									{projectData.images.map((img) => (
										<div key={img.id} className="flex flex-col items-center w-27">
											<div className="h-22 w-27 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
											<Image
												src={img.src ?? ""}
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
								</div>
							</div>

							{/* Divider */}
							<div className="h-px w-full bg-slate-100 my-4" />

							{/* Sub-block 2: Dokumentera */}
							<div className="space-y-3">
								<h3 className="text-xs font-semibold text-slate-700">
									<Translate
										text={localizationConstants.offerDetailDocumentTitle}
									/>
								</h3>

								<div className="flex flex-wrap gap-4">
									{projectData.documents.length === 0 && (
										<p className="text-xs text-slate-500">No documents attached.</p>
									)}
									{projectData.documents.map((doc) => (
										<div key={doc.id} className="flex flex-col items-center w-27">
											<div className="flex h-18 w-27 items-center justify-center rounded-lg bg-transparent">
												<Image
													src={doc.src || getDocumentIconSrc(doc.label)}
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
									<Translate
										text={localizationConstants.offerDetailDrawingTitle}
									/>
								</h3>

								<div className="flex flex-wrap gap-4">
									{projectData.drawings.length === 0 && (
										<p className="text-xs text-slate-500">No drawings attached.</p>
									)}
									{projectData.drawings.map((drawing) => {
										const isPdf = drawing.label.toLowerCase().endsWith(".pdf");
										return (
											<div key={drawing.id} className="flex flex-col items-center w-27">
												<div className="flex h-18 w-27 items-center justify-center rounded-lg bg-transparent">
													{drawing.src ? (
														<Image
															src={drawing.src}
															alt={drawing.label}
															width={40}
															height={40}
															className="h-10 w-10 object-contain"
														/>
													) : isPdf ? (
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
			<Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle><Translate text={localizationConstants.demoLeadTitle} /></DialogTitle>
						<DialogDescription><Translate text={localizationConstants.demoLeadDescription} /></DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button type="button" onClick={() => router.push("/manage-plans")}>
							<Translate text={localizationConstants.demoLeadUpgrade} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{isOpen && type === MODAL_CONSTANTS.BUSINESS_OFFER && (
				<BusinessOfferModal
					open={isOpen}
					onOpenChange={(openState) => {
						if (!openState) closeModal();
					}}
					quote={{ id: offerId, type: projectData.type }}
					onConfirm={handleModalConfirm}
				/>
			)}
			{isOpen && type === MODAL_CONSTANTS.BUSINESS_EXPRESS && (
				<BusinessExpressModal
					open={isOpen}
					onOpenChange={(openState) => {
						if (!openState) closeModal();
					}}
					quote={{ id: offerId, type: projectData.type }}
					onConfirm={handleModalConfirm}
				/>
			)}
			{isOpen && type === MODAL_CONSTANTS.BUSINESS_RENT && (
				<BusinessRentModal
					open={isOpen}
					onOpenChange={(openState) => {
						if (!openState) closeModal();
					}}
					quote={{ id: offerId, type: projectData.type }}
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
