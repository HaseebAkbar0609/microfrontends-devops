"use client";

import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SlidersHorizontal } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { DynamicBreadcrumb } from "@/components/common";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { CompanyProfileDetailsTab } from "@/features/partners/dashboard/components/CompanyProfileDetailsTab";
import { LogotypeTab } from "@/features/partners/dashboard/components/LogotypeTab";
import {
	partnerCompanyProfileSchema,
	type PartnerCompanyProfileFormValues,
} from "@/features/partners/dashboard/schemas/companyProfile.schema";
import { DEFAULT_VALUES } from "@/features/partners/dashboard/constants";
import { DUMMY_PARTNER_REGISTER } from "../constants/partners";

const MAIN_TABS = [
	{ value: "business-info", label: localizationConstants.adminCompanyInformation },
	{ value: "logotype", label: localizationConstants.logotypeTab },
	{ value: "settings", label: localizationConstants.partnerSettingsTab },
	{ value: "image-bank", label: localizationConstants.imageBankTab },
	{ value: "active-ads", label: localizationConstants.partnerActiveAdsTab },
];

function ComingSoonPanel() {
	return (
		<div className="flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-16 text-sm text-slate-500 shadow-sm">
			<Translate text={localizationConstants.comingSoon} />
		</div>
	);
}

type PartnerSettingsSectionProps = {
	b2b: boolean;
	onB2BChange: (value: boolean) => void;
	b2c: boolean;
	onB2CChange: (value: boolean) => void;
};

function PartnerSettingsSection({ b2b, onB2BChange, b2c, onB2CChange }: PartnerSettingsSectionProps) {
	return (
		<CollapsibleSection
			className="rounded-md border border-slate-200 bg-white py-4 shadow-sm"
			contentClassName="px-5"
			icon={<SlidersHorizontal size={20} className="text-slate-700" />}
			title={<Translate text={localizationConstants.partnerBusinessSettingsSectionTitle} />}
			defaultOpen
		>
			<div className="flex items-center gap-10">
				<div className="flex items-center gap-3">
					<span className="text-sm font-medium text-slate-900">B2B</span>
					<Switch
						checked={b2b}
						onCheckedChange={onB2BChange}
						className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-slate-300"
					/>
					<span className="text-sm text-slate-600">
						<Translate text={b2b ? localizationConstants.yesLabel : localizationConstants.noLabel} />
					</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-sm font-medium text-slate-900">B2C</span>
					<Switch
						checked={b2c}
						onCheckedChange={onB2CChange}
						className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-slate-300"
					/>
					<span className="text-sm text-slate-600">
						<Translate text={b2c ? localizationConstants.yesLabel : localizationConstants.noLabel} />
					</span>
				</div>
			</div>
		</CollapsibleSection>
	);
}

interface PartnerDetailPageProps {
	readonly id: string;
}

export function PartnerDetailPage({ id }: PartnerDetailPageProps) {
	const t = useTranslate();
	const [activeTab, setActiveTab] = useState("business-info");

	const partner = useMemo(
		() => DUMMY_PARTNER_REGISTER.find((row) => row.id === id),
		[id]
	);

	const [b2b, setB2b] = useState(partner ? partner.type.includes("B2B") : true);
	const [b2c, setB2c] = useState(partner ? partner.type.includes("B2C") : true);

	const defaultValues = useMemo<PartnerCompanyProfileFormValues>(
		() => ({
			...DEFAULT_VALUES,
			companyName: partner?.company ?? DEFAULT_VALUES.companyName,
		}),
		[partner]
	);

	const lastSavedRef = useRef<PartnerCompanyProfileFormValues | null>(defaultValues);

	const form = useForm<PartnerCompanyProfileFormValues>({
		resolver: zodResolver(partnerCompanyProfileSchema),
		defaultValues,
	});

	const onSubmit = async (data: PartnerCompanyProfileFormValues) => {
		lastSavedRef.current = data;
		showToast("success", t(localizationConstants.save));
	};

	return (
		<div className="flex min-h-[calc(100vh-64px)] flex-col px-6 pt-6">
			<div className="shrink-0">
				<h1 className="mb-2 text-2xl font-semibold text-slate-900">
					{partner?.company ?? <Translate text={localizationConstants.partnerAdminItem} />}
				</h1>
				<DynamicBreadcrumb
					items={[
						{ label: <Translate text={localizationConstants.partners} />, href: "/partners/admin" },
						{ label: <Translate text={localizationConstants.partnerAdminItem} />, href: "/partners/admin" },
						{ label: partner?.company ?? <Translate text={localizationConstants.partnerAdminItem} /> },
					]}
				/>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col">
				<div className="shrink-0 mt-6 border-b border-slate-200">
					<TabsList variant="line" className="h-auto gap-6 rounded-none px-0 pb-1">
						{MAIN_TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="px-0 text-slate-600 data-[state=active]:px-5 data-[state=active]:text-slate-900"
							>
								<Translate text={tab.label} />
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<TabsContent value="business-info" className="mt-6 min-h-0 flex-1">
					<CompanyProfileDetailsTab
						form={form}
						onSubmit={onSubmit}
						lastSavedRef={lastSavedRef}
						beforeContent={
							<PartnerSettingsSection b2b={b2b} onB2BChange={setB2b} b2c={b2c} onB2CChange={setB2c} />
						}
					/>
				</TabsContent>
				<TabsContent value="logotype" className="mt-6 min-h-0 flex-1">
					<LogotypeTab form={form} onSubmit={onSubmit} lastSavedRef={lastSavedRef} />
				</TabsContent>
				<TabsContent value="settings" className="mt-6 min-h-0 flex-1">
					<PartnerSettingsSection b2b={b2b} onB2BChange={setB2b} b2c={b2c} onB2CChange={setB2c} />
				</TabsContent>
				<TabsContent value="image-bank" className="mt-6 min-h-0 flex-1">
					<ComingSoonPanel />
				</TabsContent>
				<TabsContent value="active-ads" className="mt-6 min-h-0 flex-1">
					<ComingSoonPanel />
				</TabsContent>
			</Tabs>
		</div>
	);
}
