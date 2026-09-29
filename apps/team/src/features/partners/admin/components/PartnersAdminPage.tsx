"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicBreadcrumb } from "@/components/common";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PartnersRegisterTab } from "./PartnersRegisterTab";
import { ApprovalCenterTab } from "./ApprovalCenterTab";
import { KategoriTab } from "./KategoriTab";
import {
	DUMMY_PARTNER_CATEGORIES,
	DUMMY_PARTNER_REGISTER,
	type PartnerApprovalStatus,
} from "../constants/partners";
import { DUMMY_OFFERS_BY_PARTNER, type OfferChannel, type OfferDecision } from "../constants/partnerOffers";

const MAIN_TABS = [
	{ value: "register", label: localizationConstants.partnersRegisterTab },
	{ value: "approval-center", label: localizationConstants.approvalCenterTab },
	{ value: "category", label: localizationConstants.categoryLabel },
];

export default function PartnersAdminPage() {
	const [activeTab, setActiveTab] = useState("register");
	// Held here because inactive tab panels unmount, which would drop added categories and approval decisions.
	const [categories, setCategories] = useState(DUMMY_PARTNER_CATEGORIES);
	const [partners, setPartners] = useState(DUMMY_PARTNER_REGISTER);
	const [offersByPartner, setOffersByPartner] = useState(DUMMY_OFFERS_BY_PARTNER);

	function changeApprovalStatus(partnerId: string, approvalStatus: PartnerApprovalStatus) {
		setPartners((previous) =>
			previous.map((partner) => (partner.id === partnerId ? { ...partner, approvalStatus } : partner)),
		);
	}

	function decideOffer(partnerId: string, offerId: string, channel: OfferChannel, decision: OfferDecision) {
		setOffersByPartner((previous) => ({
			...previous,
			[partnerId]: (previous[partnerId] ?? []).map((offer) =>
				offer.id === offerId ? { ...offer, [channel]: decision } : offer,
			),
		}));
	}

	return (
		<div className="flex flex-col gap-0 px-6 pt-6 pb-10">
			<div>
				<h1 className="mb-2 text-2xl font-semibold text-slate-900">
					<Translate text={localizationConstants.partnersAdminTitle} />
				</h1>
				<DynamicBreadcrumb
					separator={<ChevronRight className="h-3 w-3" />}
					items={[
						{ label: <Translate text={localizationConstants.partners} />, href: "/partners/admin" },
						{ label: <Translate text={localizationConstants.partnerAdminItem} /> },
					]}
				/>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<div className="mt-6 border-b border-slate-200">
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

				<TabsContent value="register" className="mt-6">
					<PartnersRegisterTab />
				</TabsContent>
				<TabsContent value="approval-center" className="mt-6">
					<ApprovalCenterTab
						partners={partners}
						offersByPartner={offersByPartner}
						onApprovalStatusChange={changeApprovalStatus}
						onOfferDecision={decideOffer}
					/>
				</TabsContent>
				<TabsContent value="category" className="mt-6">
					<KategoriTab
						categories={categories}
						onCategoryCreated={(category) => setCategories((previous) => [...previous, category])}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
