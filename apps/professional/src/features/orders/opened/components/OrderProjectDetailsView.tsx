"use client";

import React, { useState } from "react";
import { UserPlus, CircleUserRound, ShoppingBag, Info, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderOpenedData } from "../types/orderOpened.types";
import {
	EditCustomerModal,
	EditContactPersonModal,
	EditOrderDetailsModal,
	EditOrderInfoModal,
} from "./modals";

interface CardSectionProps {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	onEdit?: () => void;
}

function CardSection({ title, icon, children, onEdit }: CardSectionProps) {
	const t = useTranslate();
	return (
		<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full flex flex-col">
			{/* Card Header matching B2B header height and styles with responsive padding */}
			<div className="flex h-14 min-h-14 w-full items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
				<div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
					{icon}
					<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
						{title}
					</span>
				</div>
				<Button
					type="button"
					variant="secondary"
					size="sm"
					onClick={onEdit}
					className="h-9 w-auto min-w-[82px] shrink-0 gap-2 rounded-md bg-zinc-100 px-3.5 py-2 font-sans text-sm font-medium text-slate-900 shadow-none hover:bg-zinc-100 cursor-pointer whitespace-nowrap"
				>
					<PencilLine className="h-4 w-4 shrink-0 text-slate-900" />
					<span>{t(localizationConstants.actionEdit)}</span>
				</Button>
			</div>
			{/* Card Body with responsive 1-col mobile / 2-col tablet & desktop grid */}
			<div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 sm:gap-x-8 text-sm">
				{children}
			</div>
		</div>
	);
}

function InfoItem({ label, value }: { label: string; value?: string }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
				{label}
			</span>
			<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words">
				{value || "—"}
			</span>
		</div>
	);
}

export interface OrderProjectDetailsViewProps {
	data: OrderOpenedData;
	onUpdateData?: (updated: Partial<OrderOpenedData>) => void;
}

export function OrderProjectDetailsView({ data, onUpdateData }: OrderProjectDetailsViewProps) {
	const t = useTranslate();
	const [activeModal, setActiveModal] = useState<"customer" | "contact" | "order" | "orderInfo" | null>(null);

	return (
		<>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Card 1: Kunduppgifter */}
				<CardSection
					title={t(localizationConstants.customerDetailsSection)}
					icon={<UserPlus className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
					onEdit={() => setActiveModal("customer")}
				>
					<InfoItem label={t(localizationConstants.orderCustomer)} value={data.customerInfo.customerName} />
					<InfoItem label={t(localizationConstants.addressLabel)} value={data.customerInfo.address} />
					<InfoItem label={t(localizationConstants.postNrLabel)} value={data.customerInfo.postCode} />
					<InfoItem label={t(localizationConstants.cityLabel)} value={data.customerInfo.city} />
					<InfoItem label={t(localizationConstants.mailLabel)} value={data.customerInfo.email} />
					<InfoItem label={t(localizationConstants.phoneLabel)} value={data.customerInfo.phone} />
					<InfoItem label={t(localizationConstants.orgPersonNrLabel)} value={data.customerInfo.orgNumber} />
					<div />
				</CardSection>

				{/* Card 2: Kontaktperson */}
				<CardSection
					title={t(localizationConstants.contactPersonSection)}
					icon={<CircleUserRound className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
					onEdit={() => setActiveModal("contact")}
				>
					<InfoItem label={t(localizationConstants.firstNameLabel)} value={data.contactPerson.firstName} />
					<InfoItem label={t(localizationConstants.lastNameLabel)} value={data.contactPerson.lastName} />
					<InfoItem label={t(localizationConstants.mailLabel)} value={data.contactPerson.email} />
					<InfoItem label={t(localizationConstants.mobileLabel)} value={data.contactPerson.mobile} />
					<InfoItem label={t(localizationConstants.roleLabel)} value={data.contactPerson.role} />
					<div />
				</CardSection>

				{/* Card 3: Order */}
				<CardSection
					title={t(localizationConstants.orderSection)}
					icon={<ShoppingBag className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
					onEdit={() => setActiveModal("order")}
				>
					<InfoItem label={t(localizationConstants.colOrderNo)} value={data.orderDetails.serialNo} />
					<InfoItem label={t(localizationConstants.orderName)} value={data.orderDetails.orderName} />
					<InfoItem label={t(localizationConstants.quarterName)} value={data.orderDetails.quarterName} />
					<InfoItem label={t(localizationConstants.orderAddress)} value={data.orderDetails.orderAddress} />
					<InfoItem label={t(localizationConstants.postNrLabel)} value={data.orderDetails.postCode} />
					<InfoItem label={t(localizationConstants.cityLabel)} value={data.orderDetails.city} />
				</CardSection>

				{/* Card 4: Order information */}
				<CardSection
					title={t(localizationConstants.orderInfoSection)}
					icon={<Info className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
					onEdit={() => setActiveModal("orderInfo")}
				>
					<InfoItem label={t(localizationConstants.typeLabel)} value={data.orderInfo.type} />
					<InfoItem label={t(localizationConstants.categoryLabel)} value={data.orderInfo.category} />
					<InfoItem label={t(localizationConstants.departmentLabel)} value={data.orderInfo.department} />
					<InfoItem label={t(localizationConstants.contractAmount)} value={data.orderInfo.contractAmount} />
					<InfoItem label={t(localizationConstants.offerNoLabel)} value={data.orderInfo.offerNo} />
					<InfoItem label={t(localizationConstants.orderStart)} value={data.orderInfo.startDate} />
					<InfoItem label={t(localizationConstants.orderEnd)} value={data.orderInfo.endDate} />
					<div />
				</CardSection>
			</div>

			{/* Edit Modals - conditionally mounted */}
			{activeModal === "customer" && (
				<EditCustomerModal
					isOpen
					onClose={() => setActiveModal(null)}
					customerInfo={data.customerInfo}
					onSave={(updated) => onUpdateData?.({ customerInfo: { ...data.customerInfo, ...updated } })}
				/>
			)}

			{activeModal === "contact" && (
				<EditContactPersonModal
					isOpen
					onClose={() => setActiveModal(null)}
					contactPerson={data.contactPerson}
					onSave={(updated) => onUpdateData?.({ contactPerson: { ...data.contactPerson, ...updated } })}
				/>
			)}

			{activeModal === "order" && (
				<EditOrderDetailsModal
					isOpen
					onClose={() => setActiveModal(null)}
					orderDetails={data.orderDetails}
					onSave={(updated) => onUpdateData?.({ orderDetails: { ...data.orderDetails, ...updated } })}
				/>
			)}

			{activeModal === "orderInfo" && (
				<EditOrderInfoModal
					isOpen
					onClose={() => setActiveModal(null)}
					orderInfo={data.orderInfo}
					onSave={(updated) => onUpdateData?.({ orderInfo: { ...data.orderInfo, ...updated } })}
				/>
			)}
		</>
	);
}

export default OrderProjectDetailsView;
