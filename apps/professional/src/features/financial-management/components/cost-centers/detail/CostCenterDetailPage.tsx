"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCostCenterDetail } from "../../../hooks/useCostCenterDetail";
import { CostCenterDetailInfoCard } from "./cards/CostCenterDetailInfoCard";
import { COST_CENTERS_BASE_ROUTE } from "../../../constants/costCenters.constants";

interface CostCenterDetailPageProps {
	readonly id: string;
}

export function CostCenterDetailPage({ id }: CostCenterDetailPageProps) {
	const router = useRouter();
	const {
		costCenter,
		isLoading,
		isEditing,
		editData,
		setEditData,
		startEdit,
		cancelEdit,
		saveEdit,
	} = useCostCenterDetail(id);

	if (isLoading) {
		return (
			<div className="p-8 text-center text-sm text-slate-500">
				<Translate text={localizationConstants.genericLoading} />
			</div>
		);
	}

	if (!costCenter) {
		return (
			<div className="p-8 space-y-4">
				<Button
					variant="ghost"
					onClick={() => router.push(COST_CENTERS_BASE_ROUTE)}
					className="text-slate-600 gap-2 cursor-pointer"
				>
					<ArrowLeft className="h-4 w-4" />
					<Translate text={localizationConstants.goBackToCostCenterListLabel} />
				</Button>
				<p className="text-slate-500 text-sm">
					<Translate text={localizationConstants.noCostCentersMessage} />
				</p>
			</div>
		);
	}

	return (
		<div className="p-6 w-full space-y-6 max-w-5xl">
			{/* Top Bar with Back Arrow + lowercase 'detaljer' + code subtitle */}
			<div className="flex items-start gap-3">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => router.push(COST_CENTERS_BASE_ROUTE)}
					className="h-8 w-8 text-slate-900 hover:bg-slate-100 cursor-pointer mt-0.5"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div>
					<h1 className="text-xl font-bold text-slate-900 leading-tight">
						<Translate text={localizationConstants.detaljerHeaderTitle} />
					</h1>
					<p className="text-xs text-slate-400 font-normal mt-0.5">
						#{costCenter.kod || id}
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
							<Translate text={localizationConstants.grundlaggandeInfoTab} />
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Info Card */}
			<CostCenterDetailInfoCard
				costCenter={costCenter}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				onStartEdit={startEdit}
				onCancelEdit={cancelEdit}
				onSave={saveEdit}
			/>
		</div>
	);
}

export default CostCenterDetailPage;
