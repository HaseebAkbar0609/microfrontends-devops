"use client";

import React from "react";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import { ContactInfoCard } from "./contact/ContactInfoCard";
import { ContactPersonsCard } from "./contact/ContactPersonsCard";

interface ContactTabProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
	onDeleteContactPerson?: (personId: string) => void;
}

export const ContactTab: React.FC<ContactTabProps> = ({
	customer,
	onUpdate,
	onDeleteContactPerson,
}) => {
	return (
		<div className="space-y-6">
			<ContactInfoCard customer={customer} onUpdate={onUpdate} />
			<ContactPersonsCard
				customer={customer}
				onUpdate={onUpdate}
				onDeleteContactPerson={onDeleteContactPerson}
			/>
		</div>
	);
};
