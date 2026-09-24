"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useAccountDetail } from "@/features/financial-management/hooks/useAccountDetail";
import { AccountDetailGrundInfoCard } from "./cards/AccountDetailGrundInfoCard";
import { AccountDetailAdditionalInfoCard } from "./cards/AccountDetailAdditionalInfoCard";

interface AccountDetailPageProps {
	readonly id: string;
}

export function AccountDetailPage({ id }: AccountDetailPageProps) {
	const {
		account,
		isLoading,
		isEditingGrundInfo,
		setIsEditingGrundInfo,
		isEditingAdditionalInfo,
		setIsEditingAdditionalInfo,
		editFormData,
		isSaving,
		updateEditField,
		saveGrundInfo,
		saveAdditionalInfo,
		handleBack,
	} = useAccountDetail(id);

	if (isLoading) {
		return (
			<div className="w-full flex items-center justify-center py-20 text-slate-500">
				<Translate text={localizationConstants.loading} />...
			</div>
		);
	}

	if (!account) {
		return (
			<div className="w-full flex flex-col items-center justify-center py-20 gap-4">
				<p className="text-sm text-slate-600">
					<Translate text={localizationConstants.accountNotFound} />
				</p>
				<button
					type="button"
					onClick={handleBack}
					className="text-xs font-semibold text-slate-900 underline"
				>
					<Translate text={localizationConstants.back} />
				</button>
			</div>
		);
	}

	return (
		<div className="p-6 w-full space-y-6 pb-12">
			{/* Page Header */}
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={handleBack}
						className="p-1 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
						aria-label="Back"
					>
						<ArrowLeft className="h-5 w-5" />
					</button>
					<h1 className="text-xl font-bold text-slate-900 tracking-tight">
						<Translate text={localizationConstants.detaljerHeaderTitle} />
					</h1>
				</div>
				<span className="text-xs text-slate-400 font-medium pl-8">
					#{account.kontoNr}
				</span>
			</div>

			{/* Sub Navigation Tab */}
			<div className="border-b border-slate-200">
				<div className="inline-flex items-center gap-2 border-b-2 border-slate-900 pb-3 px-1 text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.grundlaggandeInfoTab} />
				</div>
			</div>

			{/* Cards */}
			<div className="flex flex-col gap-6">
				<AccountDetailGrundInfoCard
					account={account}
					isEditing={isEditingGrundInfo}
					editFormData={editFormData}
					isSaving={isSaving}
					onStartEdit={() => setIsEditingGrundInfo(true)}
					onCancelEdit={() => setIsEditingGrundInfo(false)}
					onSave={saveGrundInfo}
					onUpdateField={updateEditField}
				/>

				<AccountDetailAdditionalInfoCard
					account={account}
					isEditing={isEditingAdditionalInfo}
					editFormData={editFormData}
					isSaving={isSaving}
					onStartEdit={() => setIsEditingAdditionalInfo(true)}
					onCancelEdit={() => setIsEditingAdditionalInfo(false)}
					onSave={saveAdditionalInfo}
					onUpdateField={updateEditField}
				/>
			</div>
		</div>
	);
}
