"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslate, Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { detailIdSchema } from "../types";
import { useWageTypeDetailQuery } from "../hooks/useWageTypeRegister";
import { DetailSectionCard } from "./DetailSectionCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WageTypeDetailPage() {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const rawId = params.id as string;
	const cleanId = typeof rawId === "string" ? rawId.trim() : "";
	const isValidId = detailIdSchema.safeParse(cleanId).success;

	const { data: wageType, isLoading } = useWageTypeDetailQuery(cleanId, isValidId);

	const handleBack = () => {
		router.push("/tools/register/wage-type");
	};

	const handleEdit = () => {
		if (!cleanId) return;
		router.push(`/tools/register/wage-type/edit/${cleanId}`);
	};

	if (isLoading || !wageType) {
		return (
			<div className="flex h-full flex-col overflow-y-auto bg-slate-50 p-4">
				<div className="flex items-center gap-2 mb-2">
					<div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
					<div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
				</div>
				<div className="h-4 w-16 animate-pulse rounded bg-slate-200 opacity-60 ml-8 mb-6" />
				<div className="h-9 w-40 animate-pulse rounded-md bg-slate-200 ml-8 mb-6" />
				<div className="pl-6 space-y-6">
					<div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col overflow-y-auto bg-slate-50">
			{/* Main Content Area */}
			<div className="flex-1 gap-2 p-4">
				{/* Top Header with Back Arrow */}
				<div className="mb-1 flex items-center gap-2">
					<button
						type="button"
						onClick={handleBack}
						className="rounded-md p-1 hover:bg-slate-100 cursor-pointer"
						aria-label={t(localizationConstants.goBackToWageTypeListLabel)}
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
						<Translate text={localizationConstants.detaljerHeaderTitle} />
					</h1>
				</div>

				{/* Wage Type Code Subtitle */}
				<p className="mb-4 ml-8 text-sm text-slate-500 font-medium">
					#{wageType.code}
				</p>

				{/* Sub-tab Header Line */}
				<div className="ml-8 border-b border-slate-200 mb-6 h-[36px] -mb-[1px]">
					<Tabs defaultValue="grund" className="w-fit">
						<TabsList variant="line" className="h-[36px]">
							<TabsTrigger value="grund" className="cursor-pointer">
								<Translate text={localizationConstants.grundlaggandeInfoTab} />
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				{/* Information Cards Container */}
				<div className="pl-6 flex flex-col items-start gap-6">
					{/* Card: Grund information */}
					<DetailSectionCard
						titleKey={localizationConstants.grundInformationSection}
						editAriaLabelKey={localizationConstants.editWageTypeBasicInfoAriaLabel}
						onEdit={handleEdit}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-5">
							{/* Column 1 */}
							<div className="flex flex-col gap-5">
								{/* Löneart id */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypeCodeLabel} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.code || "-"}
									</span>
								</div>

								{/* Transaktionstyp */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypeTransactionTypeHeader} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.transactionType || "-"}
									</span>
								</div>

								{/* Konto debet */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypeAccountDebitLabel} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.accountDebit || "-"}
									</span>
								</div>

								{/* Semestergrundad */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypeSemestergrundadLabel} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.semestergrundad ? <Translate text={localizationConstants.yesLabel} /> : <Translate text={localizationConstants.noLabel} />}
									</span>
								</div>
							</div>

							{/* Column 2 */}
							<div className="flex flex-col gap-5">
								{/* Benämning */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypeNameLabel} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.name || "-"}
									</span>
								</div>

								{/* Enhet */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypeUnitLabel} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.unit || "-"}
									</span>
								</div>

								{/* Konto kredit */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypeAccountCreditLabel} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.accountCredit || "-"}
									</span>
								</div>

								{/* AGI - KOD */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypeAgiCodeLabel} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.agiCode || "-"}
									</span>
								</div>
							</div>

							{/* Column 3 */}
							<div className="flex flex-col gap-5">
								{/* Personal typ */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypePersonalTypeHeader} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.personalType || "-"}
									</span>
								</div>

								{/* Preliminarskatt % */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypePreliminaryTaxHeader} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.preliminaryTax || "-"}
									</span>
								</div>

								{/* Mot konto AG */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypeAccountOppositeAGLabel} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.accountOppositeAG || "-"}
									</span>
								</div>

								{/* Beskrivning */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypeDescriptionLabel} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.description || "-"}
									</span>
								</div>
							</div>

							{/* Column 4 */}
							<div className="flex flex-col gap-5">
								{/* Löneform */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypeWageFormHeader} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.wageForm || "-"}
									</span>
								</div>

								{/* Arbetsgivare avgifter % */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypeEmployerContributionHeader} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.employerContribution || "-"}
									</span>
								</div>

								{/* AG underlag */}
								<div className="flex flex-col gap-0.5">
									<span className="text-xs font-semibold leading-5 text-slate-950">
										<Translate text={localizationConstants.wageTypeAgUnderlagLabel} />
									</span>
									<span className="text-sm font-normal leading-5 text-slate-500">
										{wageType.agUnderlag ? <Translate text={localizationConstants.yesLabel} /> : <Translate text={localizationConstants.noLabel} />}
									</span>
								</div>
							</div>
						</div>
					</DetailSectionCard>
				</div>
			</div>
		</div>
	);
}
