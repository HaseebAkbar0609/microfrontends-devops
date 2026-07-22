import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import localizationConstants from "@/utils/translation/constants";

export async function getCostCalculatorConfigAPIAction(
    categorySlug?: string
): Promise<ActionResult<unknown>> {
    try {
        const url = categorySlug 
            ? `${API_PATH.COST_CALCULATOR.CONFIG}?category=${categorySlug}`
            : API_PATH.COST_CALCULATOR.CONFIG;
        const { data } = await axiosInstance.get(url);
        return { success: true, data, error: null };
    } catch (error: unknown) {
        const apiError = error as ApiError;
        return {
            success: false,
            data: null,
            error: apiError.response?.data?.message || "Failed to load config",
        };
    }
}

export async function calculateEstimateAPIAction(
    payload: {
        category_id: string;
        answers: { question_id: string; value?: number; option_id?: string }[];
        apply_rot: boolean;
    }
): Promise<ActionResult<unknown>> {
    try {
        const { data } = await axiosInstance.post(
            API_PATH.COST_CALCULATOR.CALCULATE,
            payload
        );
        return { success: true, data, error: null };
    } catch (error: unknown) {
        const apiError = error as ApiError;
        return {
            success: false,
            data: null,
            error: apiError.response?.data?.message || "Failed to calculate estimate",
        };
    }
}

export async function getCostCalculatorProductsAPIAction(
    searchQuery: string = "",
    categorySlug: string = "",
    page: number = 1
): Promise<ActionResult<unknown>> {
    try {
        let url = `${API_PATH.COST_CALCULATOR.PRODUCTS}?page=${page}`;
        if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
        if (categorySlug) url += `&category=${encodeURIComponent(categorySlug)}`;
        
        const { data } = await axiosInstance.get(url);
        return { success: true, data, error: null };
    } catch (error: unknown) {
        const apiError = error as ApiError;
        return {
            success: false,
            data: null,
            error: apiError.response?.data?.message || "Failed to load products",
        };
    }
}

export async function getCostCalculatorHourlyRatesAPIAction(): Promise<ActionResult<unknown>> {
    try {
        const { data } = await axiosInstance.get(API_PATH.COST_CALCULATOR.HOURLY_RATES);
        return { success: true, data, error: null };
    } catch (error: unknown) {
        const apiError = error as ApiError;
        return {
            success: false,
            data: null,
            error: apiError.response?.data?.message || "Failed to load hourly rates",
        };
    }
}



export type ApiOption = { id: string; question_id: string; sort_order?: number; label: string };
export type ApiQuestion = {
    id: string;
    category_id: string;
    sort_order?: number;
    field_type: string;
    label: string;
    min?: number | string;
    min_val?: number | string;
    max?: number | string;
    max_val?: number | string;
    default?: string | number | null;
    default_value?: string | number | null;
    unit?: string;
    options?: ApiOption[];
};
export type ApiCategory = { id: string; slug: string; name: string };
export type ApiConfig = {
    categories?: ApiCategory[];
    questions?: ApiQuestion[];
    rot?: { eligible?: boolean; percentage?: number };
    currency?: string;
};

export type MappedOption = { value: string; labelKey: string };
export type MappedField = {
    id: string;
    type: string;
    labelKey: string;
    subtitleKey: undefined;
    min: number;
    max: number;
    step: number;
    defaultValue: number | string;
    unit?: string;
    options: MappedOption[];
};
export type MappedProjectType = {
    id: string;
    apiId: string;
    nameKey: string;
    titleKey: string;
    subtitleKey: string;
    fields: MappedField[];
    rotEligible: boolean;
    rotPercentage: number;
    currency?: string;
};

export function mapConfigToProjectTypes(apiConfig: ApiConfig): MappedProjectType[] {
    if (!apiConfig || !apiConfig.categories || apiConfig.categories.length === 0) return [];
    
    return apiConfig.categories.map((category: ApiCategory) => {
        const sortedQuestions = (apiConfig.questions || [])
            .filter((q: ApiQuestion) => q.category_id === category.id)
            .sort((a: ApiQuestion, b: ApiQuestion) => (a.sort_order || 0) - (b.sort_order || 0));

        const fields = sortedQuestions.map((q: ApiQuestion) => {
            const qMin = Number(q.min ?? q.min_val);
            const qMax = Number(q.max ?? q.max_val);
            const qDef = q.default ?? q.default_value;
            return {
                id: q.id,
                type: q.field_type,
                labelKey: q.label,
                subtitleKey: undefined,
                min: qMin,
                max: qMax,
                step: q.field_type === 'slider' ? (qMax > 20 ? 5 : 1) : 1,
                defaultValue: (qDef !== null && qDef !== undefined) ? Number(qDef) : (q.field_type === 'select' && q.options?.length ? q.options[0].id : ""),
                unit: q.unit,
                options: (q.options || [])
                    .filter((opt: ApiOption) => opt.question_id === q.id)
                    .sort((a: ApiOption, b: ApiOption) => (a.sort_order || 0) - (b.sort_order || 0))
                    .map((opt: ApiOption) => {
                        return {
                            value: opt.id,
                            labelKey: opt.label,
                        };
                    })
            };
        });

        return {
            id: category.slug,
            apiId: category.id,
            nameKey: category.name,
            titleKey: category.name,
            subtitleKey: localizationConstants.priceCalculatorAdjustValues,
            fields,
            rotEligible: apiConfig.rot?.eligible ?? true,
            rotPercentage: apiConfig.rot?.percentage ?? 30,
            currency: apiConfig.currency
        };
    });
}

export function mapConfigToProjectType(apiConfig: ApiConfig): MappedProjectType | null {
    const types = mapConfigToProjectTypes(apiConfig);
    return types.length > 0 ? types[0] : null;
}

