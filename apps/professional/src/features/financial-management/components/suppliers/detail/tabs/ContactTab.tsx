"use client";

import React from "react";
import type { SupplierDetailData } from "../../../../types/supplierDetail.types";
import type { SupplierContactPerson } from "../../../../types/createSupplier.types";
import { SupplierContactCard } from "./contact/SupplierContactCard";
import { SupplierContactPersonsCard } from "./contact/SupplierContactPersonsCard";

interface ContactTabProps {
	supplier: SupplierDetailData;
	onUpdate: (updates: Partial<SupplierDetailData>) => void;
	onAddPerson: (person: SupplierContactPerson) => void;
	onDeletePerson: (id: string) => void;
}

export function ContactTab({
	supplier,
	onUpdate,
	onAddPerson,
	onDeletePerson,
}: ContactTabProps) {
	return (
		<div className="space-y-6">
			<SupplierContactCard supplier={supplier} onUpdate={onUpdate} />
			<SupplierContactPersonsCard
				contactPersons={supplier.contactPersons}
				onAddPerson={onAddPerson}
				onDeletePerson={onDeletePerson}
			/>
		</div>
	);
}
