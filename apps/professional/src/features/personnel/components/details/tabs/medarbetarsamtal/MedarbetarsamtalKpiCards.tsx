"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MedarbetarsamtalKpiData } from "../../../../types/medarbetarsamtal.types";

interface MedarbetarsamtalKpiCardsProps {
	kpis: MedarbetarsamtalKpiData;
}

export function MedarbetarsamtalKpiCards({ kpis }: MedarbetarsamtalKpiCardsProps) {
	return (
		<div className="space-y-2">
			<h3 className="text-xs font-semibold text-slate-700">
				<Translate
					text={localizationConstants.medarbetarsamtalUpcomingTitle}
				/>
			</h3>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				{/* 1. Senaste incheckning */}
				<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-1">
					<span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block">
						<Translate text={localizationConstants.medarbetarsamtalKpiLatest} />
					</span>
					<div className="text-base font-bold text-slate-900">
						{kpis.latestCheckIn}
					</div>
					<p className="text-[11px] text-slate-400">{kpis.latestCheckInSub}</p>
				</div>

				{/* 2. Nästa schemalagda */}
				<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-1">
					<span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block">
						<Translate text={localizationConstants.medarbetarsamtalKpiNext} />
					</span>
					<div className="text-base font-bold text-slate-900">
						{kpis.nextScheduled}
					</div>
					<p className="text-[11px] text-slate-400">{kpis.nextScheduledSub}</p>
				</div>

				{/* 3. Övergripande känsla */}
				<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
					<span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block">
						<Translate text={localizationConstants.medarbetarsamtalKpiFeeling} />
					</span>
					<div>
						{kpis.overallFeeling === "positiv" && (
							<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
								<Translate text={localizationConstants.medarbetarsamtalFeelingPos} />
							</span>
						)}
						{kpis.overallFeeling === "neutral" && (
							<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
								<Translate text={localizationConstants.medarbetarsamtalFeelingNeut} />
							</span>
						)}
						{kpis.overallFeeling === "behover_uppmarksamhet" && (
							<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
								<Translate text={localizationConstants.medarbetarsamtalFeelingWarn} />
							</span>
						)}
					</div>
				</div>

				{/* 4. Öppna uppföljningar */}
				<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-1">
					<span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block">
						<Translate text={localizationConstants.medarbetarsamtalKpiOpen} />
					</span>
					<div className="text-base font-bold text-amber-600">
						{kpis.openFollowupsCount}
					</div>
					<p className="text-[11px] text-slate-400">{kpis.openFollowupsSub}</p>
				</div>
			</div>
		</div>
	);
}
