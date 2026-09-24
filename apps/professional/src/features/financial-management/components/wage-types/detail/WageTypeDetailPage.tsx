"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useWageTypeDetail } from "../../../hooks/useWageTypeDetail";
import { WageTypeDetailInfoCard } from "./cards/WageTypeDetailInfoCard";
import { WageTypeDeleteDialog } from "../WageTypeDeleteDialog";
import { WAGE_TYPES_BASE_ROUTE } from "../../../constants/wageTypes.constants";

interface WageTypeDetailPageProps {
	readonly id: string;
}

export function WageTypeDetailPage({ id }: WageTypeDetailPageProps) {
	const router = useRouter();
	const {
		wageType,
		isLoading,
		isEditing,
		isSubmitting,
		editData,
		errors,
		updateEditField,
		startEdit,
		cancelEdit,
		saveEdit,
		handleDelete,
	} = useWageTypeDetail(id);

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	if (isLoading) {
		return (
			<div className="p-8 text-center text-sm text-slate-500">
				<Translate text={localizationConstants.loadingLabel} />
			</div>
		);
	}

	if (!wageType) {
		return (
			<div className="p-8 space-y-4">
				<Button
					variant="ghost"
					onClick={() => router.push(WAGE_TYPES_BASE_ROUTE)}
					className="text-slate-600 gap-2 cursor-pointer"
				>
					<ArrowLeft className="h-4 w-4" />
					<Translate text={localizationConstants.goBackToWageTypeListLabel} />
				</Button>
				<p className="text-slate-500 text-sm">
					<Translate text={localizationConstants.noRecordsFound} />
				</p>
			</div>
		);
	}

	return (
		<div className="p-6 w-full space-y-6 max-w-5xl">
			{/* Top Bar with Back Arrow + 'detaljer' + code subtitle */}
			<div className="flex items-start gap-3">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => router.push(WAGE_TYPES_BASE_ROUTE)}
					className="h-8 w-8 text-slate-900 hover:bg-slate-100 cursor-pointer mt-0.5"
					aria-label={localizationConstants.goBackToWageTypeListLabel}
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div>
					<h1 className="text-xl font-bold text-slate-900 leading-tight">
						<Translate text={localizationConstants.detaljerHeaderTitle} />
					</h1>
					<p className="text-xs text-slate-400 font-normal mt-0.5">
						#{wageType.loneartId || id}
					</p>
				</div>
			</div>

			{/* Sub Tabs Bar */}
			<div className="border-b border-slate-200">
				<Tabs defaultValue="grundinfo">
					<TabsList variant="line" className="gap-8 bg-transparent p-0 -mb-px">
						<TabsTrigger
							value="grundinfo"
							className="pb-3 pt-1 text-sm font-semibold cursor-pointer"
						>
							<Translate text={localizationConstants.grundInformationSection} />
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Info Card */}
			<WageTypeDetailInfoCard
				wageType={wageType}
				isEditing={isEditing}
				isSubmitting={isSubmitting}
				editData={editData}
				errors={errors}
				onUpdateField={updateEditField}
				onStartEdit={startEdit}
				onCancelEdit={cancelEdit}
				onSave={saveEdit}
				onDelete={() => setIsDeleteDialogOpen(true)}
			/>

			{/* Delete Confirmation Modal */}
			<WageTypeDeleteDialog
				target={wageType}
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={() => {
					setIsDeleteDialogOpen(false);
					handleDelete();
				}}
			/>
		</div>
	);
}

export default WageTypeDetailPage;
