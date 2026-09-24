"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ApiError } from "@/types/api";
import { ArticleBasicInfoStep } from "./steps/ArticleBasicInfoStep";
import { ArticleStructuredInfoStep } from "./steps/ArticleStructuredInfoStep";
import { cn } from "@/lib/utils";
import {
    createArticleSchema,
    type CreateArticleFormData,
    type PriceListRow,
} from "../types";
import {
    createArticleAPIAction,
    updateArticleAPIAction,
    getArticleDetailAPIAction,
} from "../api/articleRegister";

const TABS = [
    { key: 1, labelKey: localizationConstants.createArticleBasicInfoTab },
    { key: 2, labelKey: localizationConstants.createArticleStructuredInfoTab },
];

const TOTAL_STEPS = 2;

const STEP_FIELDS: Record<number, (keyof CreateArticleFormData)[]> = {
    1: ["benamning", "leverantor", "enhet", "typAvArtikel", "forsaljning", "moms"],
    2: ["forsaljningSESkattskyldighet"],
};

const EMPTY_DEFAULTS: CreateArticleFormData = {
    articleNr: "",
    benamning: "",
    ean: "",
    leverantor: "",
    husarbete: "nej",
    supplierArticleNo: "",
    typHusarbete: "",
    enhet: "",
    typAvArtikel: "",
    lagerVara: "",
    forsaljning: "",
    moms: "",
    forsaljningSE: "",
    forsaljningEU: "",
    lagerkonto: "",
    forsaljningEUMoms: "",
    forsaljningExport: "",
    inkop: "",
    priserA: "",
    europrislista: "",
    kampanj: "",
    vipPriser: "",
    kalkylkostnad: "",
    bestallningspunkt: "",
    iLager: "",
    stock: "0",
    reserved: "0",
    status: "active",
    vikt: "",
    langd: "",
    bredd: "",
    hojd: "",
    material: "",
    forsaljningSESkattskyldighet: "",
    momsSESkattskyldighet: "",
    forsaljningEUSkattskyldighet: "",
    lagerforandring: "",
};

interface ArticleFormPageProps {
    readonly articleId?: string;
}

export function ArticleFormPage({ articleId: articleIdProp }: ArticleFormPageProps) {
    const t = useTranslate();
    const router = useRouter();
    const params = useParams();
    const articleId = articleIdProp ?? (params?.id ? String(params.id) : undefined);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(Boolean(articleId));
    const [priceListRows, setPriceListRows] = useState<PriceListRow[]>([]);

    const isEdit = Boolean(articleId);

    const methods = useForm<CreateArticleFormData>({
        resolver: zodResolver(createArticleSchema),
        defaultValues: EMPTY_DEFAULTS,
    });

    const control = methods.control;

    useEffect(() => {
        if (!articleId) return;
        let cancelled = false;
        getArticleDetailAPIAction(articleId)
            .then((detail) => {
                if (cancelled) return;
                methods.reset({
                    articleNr: detail.articleNo,
                    benamning: detail.benamning,
                    ean: detail.ean,
                    leverantor: detail.leverantor,
                    husarbete: detail.husarbete || "nej",
                    supplierArticleNo: detail.supplierArticleNo,
                    typHusarbete: detail.typHusarbete,
                    enhet: detail.enhet,
                    typAvArtikel: detail.typAvArtikel,
                    lagerVara: detail.lagerVara,
                    forsaljning: detail.forsaljning,
                    moms: detail.moms,
                    forsaljningSE: detail.forsaljningSE,
                    forsaljningEU: detail.forsaljningEU,
                    lagerkonto: detail.lagerkonto,
                    forsaljningEUMoms: detail.forsaljningEUMoms,
                    forsaljningExport: detail.forsaljningExport,
                    inkop: detail.inkop,
                    priserA: detail.priserA,
                    europrislista: detail.europrislista,
                    kampanj: detail.kampanj,
                    vipPriser: detail.vipPriser,
                    kalkylkostnad: detail.kalkylkostnad,
                    bestallningspunkt: detail.bestallningspunkt,
                    iLager: detail.iLager,
                    stock: detail.stock,
                    reserved: detail.reserved,
                    status: detail.status,
                    vikt: detail.vikt,
                    langd: detail.langd,
                    bredd: detail.bredd,
                    hojd: detail.hojd,
                    material: detail.material,
                    forsaljningSESkattskyldighet: detail.forsaljningSESkattskyldighet,
                    momsSESkattskyldighet: detail.momsSESkattskyldighet,
                    forsaljningEUSkattskyldighet: detail.forsaljningEUSkattskyldighet,
                    lagerforandring: detail.lagerforandring,
                });
                setPriceListRows(detail.priceListRows);
            })
            .catch(() => {
                if (cancelled) return;
                showToast("error", t(localizationConstants.genericError));
                router.push("/tools/register?tab=artikel&subtab=artikel");
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [articleId, methods, router, t]);

    const validateStep = async (step: number): Promise<boolean> => {
        const fields = STEP_FIELDS[step];
        if (!fields) return true;
        const result = await methods.trigger(fields);
        return result;
    };

    const handleNext = async () => {
        if (currentStep >= TOTAL_STEPS) return;

        const isValid = await validateStep(currentStep);
        if (!isValid) return;

        setCurrentStep((prev) => prev + 1);
    };

    const handleTabClick = async (step: number) => {
        if (step <= currentStep) {
            setCurrentStep(step);
            return;
        }

        for (let s = currentStep; s < step; s++) {
            const isValid = await validateStep(s);
            if (!isValid) return;
        }

        setCurrentStep(step);
    };

    const handleSubmit = methods.handleSubmit(async (data) => {
        setIsSubmitting(true);
        try {
            const formData = { ...data, priceListRows };
            if (isEdit && articleId) {
                await updateArticleAPIAction(articleId, formData);
                showToast("success", t(localizationConstants.articleUpdatedSuccess));
            } else {
                await createArticleAPIAction(formData);
                showToast("success", t(localizationConstants.articleCreatedSuccess));
            }
            router.push("/tools/register?tab=artikel&subtab=artikel");
        } catch (error) {
            const backendMessage = (error as ApiError).response?.data?.message;
            showToast(
                "error",
                backendMessage ||
                    t(isEdit ? localizationConstants.articleUpdateError : localizationConstants.articleCreateError),
            );
        } finally {
            setIsSubmitting(false);
        }
    });

    const handleCancel = () => {
        router.push("/tools/register?tab=artikel&subtab=artikel");
    };

    const handleAddPriceListRow = useCallback((newRow: PriceListRow) => {
        setPriceListRows((prev) => [...prev, newRow]);
    }, []);

    const handleRemovePriceListRow = useCallback((id: string) => {
        setPriceListRows((prev) => prev.filter((row) => row.id !== id));
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-slate-50">
                <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col overflow-y-auto bg-slate-50">
            <div className="flex-1 gap-2 p-4">
                {/* Title with Back Arrow */}
                <div className="mb-4 flex items-center gap-2">
                    <button
                        type="button"
                        aria-label={t(localizationConstants.goBackToRegisterLabel)}
                        onClick={() => router.push("/tools/register?tab=artikel&subtab=artikel")}
                        className="rounded-md p-1 hover:bg-slate-100"
                    >
                        <ArrowLeft className="h-5 w-5 text-slate-700" />
                    </button>
                    <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
                        <Translate
                            text={
                                isEdit
                                    ? localizationConstants.editArticleTitle
                                    : localizationConstants.createArticleTitle
                            }
                        />
                    </h1>
                </div>

                {/* Clickable Tabs */}
                <div className="flex gap-4 ml-8 overflow-x-auto border-b border-slate-200 sm:mb-6 sm:gap-6">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => handleTabClick(tab.key)}
                            className={cn(
                                "whitespace-nowrap pb-3 text-sm font-medium transition-colors border-b-2",
                                currentStep === tab.key
                                    ? "border-slate-900 text-slate-900"
                                    : "border-transparent text-slate-500 hover:text-slate-700",
                            )}
                        >
                            <Translate text={tab.labelKey} />
                        </button>
                    ))}
                </div>

                {/* Step 1/2 Progress Card ABOVE Form on < xl screens */}
                <div className="mb-4 ml-6 rounded-lg border border-slate-200 bg-white p-3 sm:mb-6 sm:p-4 xl:hidden">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900">
                            <Translate text={localizationConstants.stepLabel} /> {currentStep}
                            /{TOTAL_STEPS}
                        </p>
                        <span className="text-xs font-semibold text-slate-600">
                            {Math.round((currentStep / TOTAL_STEPS) * 100)}%
                        </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full bg-[#111721] transition-all duration-300"
                            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Form Content + Right Sidebar for xl screens */}
                <div className="pl-6 flex flex-col items-start gap-6 lg:gap-8 xl:flex-row">
                    {/* Form Content */}
                    <div className="w-full min-w-0 flex-1">
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit}>
                                {currentStep === 1 && (
                                    <ArticleBasicInfoStep
                                        control={control}
                                        priceListRows={priceListRows}
                                        onAddRow={handleAddPriceListRow}
                                        onRemoveRow={handleRemovePriceListRow}
                                    />
                                )}
                                {currentStep === 2 && <ArticleStructuredInfoStep control={control} />}
                            </form>
                        </FormProvider>
                    </div>

                    {/* Step 1/2 Progress Card on RIGHT side for xl screens */}
                    <div className="hidden w-72 shrink-0 xl:block">
                        <div className="sticky top-6 rounded-lg bg-white p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-900">
                                    <Translate text={localizationConstants.stepLabel} /> {currentStep}/{TOTAL_STEPS}
                                </p>
                                <span className="text-xs font-semibold text-slate-600">
                                    {Math.round((currentStep / TOTAL_STEPS) * 100)}%
                                </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full bg-[#111721] transition-all duration-300"
                                    style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="sticky bottom-0 border-t border-slate-200 bg-white pt-4 sm:pt-6">
                <div className="flex flex-col-reverse gap-2 px-3 pb-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-4 sm:pb-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="default"
                        onClick={handleCancel}
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
                        <Translate text={isEdit ? localizationConstants.saveButton : localizationConstants.saveDraftButton} />

                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                    </Button>

                    {currentStep < TOTAL_STEPS ? (
                        <Button
                            type="button"
                            variant="default"
                            size="default"
                            onClick={handleNext}
                            className="h-9 w-full min-w-0 gap-2 bg-[#111721] text-white hover:bg-slate-800 sm:w-auto sm:min-w-[120px]"
                        >
                            <Translate text={localizationConstants.nextButton} />
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export function CreateArticlePage() {
    return <ArticleFormPage />;
}
