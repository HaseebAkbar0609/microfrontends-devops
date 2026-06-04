"use client";

import { useEffect } from "react";
import {
	Layout,
	ClipboardList,
	Mail,
	FileText,
} from "lucide-react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAuthStatus } from "@/context/AuthContext";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	CreateOfferFormValues,
	QuoteDocument,
	QuoteSupplier,
} from "../../types/form";
import type { FormSelectOption } from "@/components/form";
import { DetailCard } from "../shared/DetailCard";
import { resolveCategoryLabel } from "../../utils/categoryLabel";
import { getDocumentIconMeta } from "../../utils/documentIcon";
import { looksLikeCityUuid } from "../../utils/cityDisplay";
import { resolveCityNameById } from "../../utils/resolveCityName";

interface OfferOverviewProps {
	form: UseFormReturn<CreateOfferFormValues>;
	categoryOptions: FormSelectOption[];
	onEditStep?: (step: number) => void;
}

export function OfferOverview({
	form,
	categoryOptions,
	onEditStep,
}: OfferOverviewProps) {
	const { user } = useAuthStatus();
	const values = form.watch();
	const { t } = useTranslation();

	const countryForCities =
		values.country?.trim() || user?.user_profile?.country || "";

	useEffect(() => {
		let cancelled = false;
		void (async () => {
			if (!countryForCities) return;

			const cityId = values.city?.trim() ?? "";
			if (cityId && looksLikeCityUuid(cityId)) {
				const name = await resolveCityNameById(countryForCities, cityId);
				if (!cancelled && name) form.setValue("personalCityName", name);
			}

			const pcId = values.projectCity?.trim() ?? "";
			if (pcId && looksLikeCityUuid(pcId)) {
				const name = await resolveCityNameById(countryForCities, pcId);
				if (!cancelled && name) form.setValue("projectCityName", name);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [values.city, values.projectCity, countryForCities, form]);

	const personalCityDisplay =
		values.personalCityName?.trim() || values.city || "-";
	const projectCityDisplay =
		values.projectCityName?.trim() || values.projectCity || "-";

	const infoSection = (
		label: string,
		value: string | boolean | undefined,
	) => (
		<div className="space-y-1">
			<p className="text-sm text-slate-500 font-medium">{label}</p>
			<p className="text-sm text-slate-900 font-semibold">
				{typeof value === "boolean"
					? value
						? t(localizationConstants.ja)
						: t(localizationConstants.nej)
					: value || "-"}
			</p>
		</div>
	);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
			{/* Personal Information */}
			<DetailCard
				icon={FileText}
				title={localizationConstants.personalInformationSection}
				onEdit={() => onEditStep?.(1)}
			>
				<div className="grid grid-cols-2 gap-x-4 gap-y-6 ">
					{infoSection(
						t(localizationConstants.firstNameLabel),
						values.firstName,
					)}
					{infoSection(
						t(localizationConstants.lastNameLabel),
						values.lastName,
					)}
					{infoSection(
						t(localizationConstants.mobileNoLabel),
						values.mobileNumber,
					)}
					{infoSection(
						t(localizationConstants.emailLabel),
						values.personalEmail,
					)}
					<div className="col-span-2">
						{infoSection(
							t(localizationConstants.addressLabel),
							values.address,
						)}
					</div>
					{infoSection(
						t(localizationConstants.cityLabel),
						personalCityDisplay,
					)}
					{infoSection(
						t(localizationConstants.pincodeLabel),
						values.pincode,
					)}
				</div>
			</DetailCard>

			{/* Project Information */}
			<DetailCard
				icon={Layout}
				title={localizationConstants.projectInformationSection}
				onEdit={() => onEditStep?.(2)}
			>
				<div className="grid grid-cols-2 gap-x-4 gap-y-6">
					{infoSection(
						t(localizationConstants.projectNameLabel),
						values.projectName,
					)}
					{infoSection(
						t(localizationConstants.isExpressJobLabel),
						values.isExpressJob === "express" 
							? t(localizationConstants.offerExpress) 
							: values.isExpressJob === "b2c" 
								? t(localizationConstants.offerB2C)
								: values.isExpressJob,
					)}
					{infoSection(
						t(localizationConstants.clientNoLabel),
						values.clientNo,
					)}
					{infoSection(
						t(localizationConstants.categoryLabel),
						resolveCategoryLabel(
							categoryOptions,
							values.category,
						),
					)}
					<div className="col-span-2">
						{infoSection(
							t(localizationConstants.projectAddressLabel),
							values.projectAddress,
						)}
					</div>
					{infoSection(
						t(localizationConstants.cityLabel),
						projectCityDisplay,
					)}
					{infoSection(
						t(localizationConstants.pincodeLabel),
						values.projectPostalCode,
					)}
					<div className="col-span-2">
						{infoSection(
							t(localizationConstants.directionsLabel),
							values.directions,
						)}
					</div>
				</div>
			</DetailCard>

			{/* Project Description & Documents */}
			<DetailCard
				icon={ClipboardList}
				title={localizationConstants.projectDescriptionSection}
				onEdit={() => onEditStep?.(3)}
			>
				<div className="space-y-6 ">
					<div className="space-y-1">
						<p className="text-sm text-slate-500 font-medium">
							<Translate
								text={localizationConstants.descriptionLabel}
							/>
						</p>
						<p className="text-sm text-slate-700 leading-relaxed">
							{values.description || "-"}
						</p>
					</div>

					<div className="space-y-3">
						<p className="text-sm font-medium text-slate-900  pb-1">
							<Translate
								text={
									localizationConstants.projectDocumentsSection
								}
							/>
						</p>
						<div className="border border-slate-200 rounded-lg overflow-hidden">
							<Table>
								<TableHeader className="bg-slate-50/50">
									<TableRow className="hover:bg-transparent border-slate-200">
										<TableHead className="text-xs font-semibold py-3 h-auto">
											<Translate text={localizationConstants.dateLabel} />
										</TableHead>
										<TableHead className="text-xs font-semibold py-3 h-auto">
											<Translate text={localizationConstants.documentNameLabel} />
										</TableHead>
										<TableHead className="text-xs font-semibold py-3 h-auto">
											<Translate text={localizationConstants.fileLabel} />
										</TableHead>
										<TableHead className="text-xs font-semibold py-3 h-auto"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{values.documents &&
									values.documents.length > 0 ? (
										values.documents.map(
											(doc: QuoteDocument, idx: number) => {
												const icon = getDocumentIconMeta(
													doc.type,
												);
												return (
												<TableRow
													key={doc.id || idx}
													className="border-slate-100 hover:bg-slate-50/30"
												>
													<TableCell className="text-sm py-4">{doc.date}</TableCell>
													<TableCell className="text-sm font-medium py-4">
														<div className="flex items-center gap-3">
															<div className="flex shrink-0 items-center justify-center p-1.5 rounded-md bg-slate-50">
																<Image
																	src={icon.src}
																	alt={icon.alt}
																	width={40}
																	height={40}
																	className="object-contain"
																/>
															</div>
															{doc.name}
														</div>
													</TableCell>
													<TableCell className="text-sm text-slate-500 py-4 uppercase">
														{doc.type}
													</TableCell>
													<TableCell className="py-4 text-right pr-4">
														{doc.url ? (
															<Button
																variant="outline"
																size="sm"
																className="h-9 px-4 bg-transparent rounded-lg font-medium border-slate-200 text-slate-700"
																asChild
															>
																<a
																	href={doc.url}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	<Translate text={localizationConstants.viewFileButton} />
																</a>
															</Button>
														) : (
															<Button
																variant="outline"
																size="sm"
																className="h-9 px-4 bg-transparent rounded-lg font-medium border-slate-200 text-slate-700"
																disabled
															>
																<Translate text={localizationConstants.viewFileButton} />
															</Button>
														)}
													</TableCell>
												</TableRow>
											);
											},
										)
									) : (
										<TableRow>
											<TableCell
												colSpan={4}
												className="text-center py-4 text-sm text-slate-400 italic"
											>
												<Translate
													text={
														localizationConstants.noFileChosen
													}
												/>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</DetailCard>

			{/* Invited Suppliers */}
			<DetailCard
				icon={Mail}
				title={localizationConstants.inviteSupplierSection}
				onEdit={() => onEditStep?.(4)}
			>
				<div className="">
					<div className="border rounded-md overflow-hidden">
						<Table>
							<TableHeader className="bg-slate-50/50">
								<TableRow>
									<TableHead className="text-sm h-9">
										<Translate
											text={
												localizationConstants.companyNameLabel
											}
										/>
									</TableHead>
									<TableHead className="text-sm h-9">
										<Translate
											text={
												localizationConstants.orgNoLabel ||
												"Org. No."
											}
										/>
									</TableHead>
									<TableHead className="text-sm h-9">
										<Translate
											text={
												localizationConstants.emailLabel
											}
										/>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{values.invitedSuppliers &&
								values.invitedSuppliers.length > 0 ? (
									values.invitedSuppliers.map(
										(supplier: QuoteSupplier) => (
											<TableRow
												key={supplier.id}
												className="hover:bg-slate-50/50 transition-colors"
											>
												<TableCell className="text-sm py-2 font-medium">
													{supplier.companyName}
												</TableCell>
												<TableCell className="text-sm py-2">
													{supplier.orgNumber}
												</TableCell>
												<TableCell className="text-sm py-2 text-slate-500">
													{supplier.emailAddress}
												</TableCell>
											</TableRow>
										),
									)
								) : (
									<TableRow>
										<TableCell
											colSpan={3}
											className="text-center py-4 text-sm text-slate-400 italic"
										>
											<Translate
												text={
													localizationConstants.noQuotesFound
												}
											/>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</DetailCard>
		</div>
	);
}
