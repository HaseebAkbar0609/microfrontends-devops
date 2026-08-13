"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput, FormSelect } from "@/components/form";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	getSupplierArticleDetailAPIAction,
	updateSupplierArticleAPIAction,
} from "../api/articleRegister";

interface EditSupplierArticleFormData {
	supplierArticleNo: string;
	supplierDescription: string;
	purchasePrice: string;
	linkedArticleNo: string;
	leadTime: string;
	status: string;
}

const STATUS_OPTIONS = [
	{ value: "active", labelKey: localizationConstants.activeStatus },
	{ value: "inactive", labelKey: localizationConstants.inactiveStatus },
	{ value: "discontinued", labelKey: localizationConstants.discontinuedStatus },
];

export function EditSupplierArticlePage() {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const articleId = params?.id ? String(params.id) : undefined;
	const [isLoading, setIsLoading] = useState(Boolean(articleId));
	const [isSubmitting, setIsSubmitting] = useState(false);

	const methods = useForm<EditSupplierArticleFormData>({
		defaultValues: {
			supplierArticleNo: "",
			supplierDescription: "",
			purchasePrice: "",
			linkedArticleNo: "",
			leadTime: "",
			status: "active",
		},
	});

	useEffect(() => {
		if (!articleId) return;
		setIsLoading(true);
		let cancelled = false;
		getSupplierArticleDetailAPIAction(articleId)
			.then((detail) => {
				if (cancelled) return;
				methods.reset({
					supplierArticleNo: detail.supplierArticleNo,
					supplierDescription: detail.supplierDescription,
					purchasePrice: detail.purchasePrice,
					linkedArticleNo: detail.linkedArticleNo,
					leadTime: detail.leadTime,
					status: detail.status,
				});
			})
			.catch(() => {
				if (cancelled) return;
				showToast("error", t(localizationConstants.genericError));
				router.push("/tools/register?tab=artikel&subtab=leverantorsArtiklar");
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [articleId, methods, router, t]);

	const handleSubmit = methods.handleSubmit(async (data) => {
		if (!articleId) return;
		setIsSubmitting(true);
		try {
			await updateSupplierArticleAPIAction(articleId, {
				supplier_article_no: data.supplierArticleNo || null,
				supplier_description: data.supplierDescription || null,
				purchase_price: data.purchasePrice || null,
				article_no: data.linkedArticleNo || null,
				lead_time: data.leadTime || null,
				status: data.status || null,
			});
			showToast("success", t(localizationConstants.supplierArticleUpdatedSuccess));
			router.push("/tools/register?tab=artikel&subtab=leverantorsArtiklar");
		} catch {
			showToast("error", t(localizationConstants.supplierArticleUpdateError));
		} finally {
			setIsSubmitting(false);
		}
	});

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center bg-slate-50">
				<Loader2 className="h-6 w-6 animate-spin text-slate-500" />
			</div>
		);
	}

	if (!articleId) {
		return (
			<div className="flex h-full flex-col items-center justify-center bg-slate-50 p-6 text-center">
				<h2 className="text-lg font-semibold text-slate-900 mb-2">
					<Translate text={localizationConstants.notFoundTitle} />
				</h2>
				<p className="text-sm text-slate-500 mb-4">
					<Translate text={localizationConstants.notFoundDescription} />
				</p>
				<Button
					type="button"
					onClick={() => router.push("/tools/register?tab=artikel&subtab=leverantorsArtiklar")}
					className="h-9 rounded-md bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800 cursor-pointer"
				>
					<Translate text={localizationConstants.goBackButton} />
				</Button>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col overflow-y-auto bg-slate-50">
			<div className="flex-1 gap-2 p-4">
				<div className="mb-4 flex items-center gap-2">
					<button
						type="button"
						aria-label={t(localizationConstants.goBackToRegisterLabel)}
						onClick={() => router.push("/tools/register?tab=artikel&subtab=leverantorsArtiklar")}
						className="rounded-md p-1 hover:bg-slate-100"
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
						<Translate text={localizationConstants.editSupplierArticleTitle} />
					</h1>
				</div>

				<Card className="w-full max-w-[737px] gap-0 p-0">
					<CardHeader className="h-12 flex flex-row items-center border-b border-slate-200 px-4 py-0 sm:h-14 sm:px-6">
						<CardTitle className="text-sm font-medium sm:text-base">
							<Translate text={localizationConstants.createArticleGrundInfoSection} />
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0 px-4 sm:px-6 pt-4 pb-4">
						<FormProvider {...methods}>
							<form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 items-start">
								<FormInput
									control={methods.control}
									name="supplierArticleNo"
									label={localizationConstants.supplierArticleNoLabel}
								/>
								<FormInput
									control={methods.control}
									name="purchasePrice"
									label={localizationConstants.purchasePriceHeader}
								/>
								<FormInput
									control={methods.control}
									name="supplierDescription"
									label={localizationConstants.articleDescriptionLabel}
								/>
								<FormInput
									control={methods.control}
									name="linkedArticleNo"
									label={localizationConstants.linkedArticleLabel}
								/>
								<FormInput
									control={methods.control}
									name="leadTime"
									label={localizationConstants.leadTimeLabel}
								/>
								<FormSelect
									control={methods.control}
									name="status"
									label={localizationConstants.statusLabel}
									options={STATUS_OPTIONS.map((option) => ({
										value: option.value,
										label: t(option.labelKey),
									}))}
								/>
							</form>
						</FormProvider>
					</CardContent>
				</Card>
			</div>

			<div className="sticky bottom-0 border-t border-slate-200 bg-white pt-4 sm:pt-6">
				<div className="flex flex-col-reverse gap-2 px-3 pb-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-4 sm:pb-4">
					<Button
						type="button"
						variant="ghost"
						size="default"
						onClick={() => router.push("/tools/register?tab=artikel&subtab=leverantorsArtiklar")}
						className="h-9 w-full min-w-0 bg-transparent border border-slate-300 px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-none sm:w-auto sm:min-w-[120px]"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					<Button
						type="button"
						variant="default"
						size="default"
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="h-9 w-full min-w-0 gap-2 bg-[#111721] text-white hover:bg-slate-800 sm:w-auto sm:min-w-[120px]"
					>
						<Translate text={localizationConstants.saveDraftButton} />
						{isSubmitting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Save className="h-4 w-4" />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}