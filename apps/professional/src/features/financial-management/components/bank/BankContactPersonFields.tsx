"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BankContactPerson } from "../../types/bank.types";

interface BankContactPersonFieldsProps {
	contactPerson: BankContactPerson;
	onChange: (updated: BankContactPerson) => void;
}

export function BankContactPersonFields({
	contactPerson,
	onChange,
}: BankContactPersonFieldsProps) {
	return (
		<div className="space-y-4">
			{/* Select Contact Person Preset */}
			<div className="space-y-1">
				<label className="text-xs font-medium text-slate-700">
					<Translate text={localizationConstants.fieldContactPersonSelect} />
				</label>
				<Select
					value={contactPerson.name ? "preset-1" : undefined}
					onValueChange={(val) => {
						if (val === "preset-1") {
							onChange({
								name: "Karl Andersson",
								role: "info",
								email: "karl.andersson@seb.se",
								phone: "+46 8 763 80 00",
							});
						}
					}}
				>
					<SelectTrigger className="h-10 text-xs bg-white">
						<SelectValue placeholder="Info" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="preset-1" className="text-xs">
							Karl Andersson (SEB)
						</SelectItem>
						<SelectItem value="custom" className="text-xs">
							Anpassad kontaktperson
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Row 1: Namn & Roll */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-1">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.fieldContactName} />
					</label>
					<Input
						value={contactPerson.name}
						onChange={(e) =>
							onChange({ ...contactPerson, name: e.target.value })
						}
						placeholder="Info"
						className="h-10 text-xs bg-white"
					/>
				</div>

				<div className="space-y-1">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.fieldContactRole} />
					</label>
					<Input
						value={contactPerson.role}
						onChange={(e) =>
							onChange({ ...contactPerson, role: e.target.value })
						}
						placeholder="info"
						className="h-10 text-xs bg-white"
					/>
				</div>
			</div>

			{/* Row 2: Email & Telefon */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-1">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.fieldContactEmail} />
					</label>
					<Input
						type="email"
						value={contactPerson.email}
						onChange={(e) =>
							onChange({ ...contactPerson, email: e.target.value })
						}
						placeholder="Info"
						className="h-10 text-xs bg-white"
					/>
				</div>

				<div className="space-y-1">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.fieldContactPhone} />
					</label>
					<Input
						value={contactPerson.phone}
						onChange={(e) =>
							onChange({ ...contactPerson, phone: e.target.value })
						}
						placeholder="info"
						className="h-10 text-xs font-mono bg-white"
					/>
				</div>
			</div>
		</div>
	);
}

export default BankContactPersonFields;
