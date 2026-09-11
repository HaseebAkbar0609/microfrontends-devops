"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
		<div className="pt-4 border-t border-slate-200 space-y-3">
			<h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
				<Translate text={localizationConstants.contactPersonHeader} />
			</h4>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<Label className="text-xs font-semibold text-slate-600 mb-1 block">
						<Translate text={localizationConstants.fieldContactName} />
					</Label>
					<Input
						value={contactPerson.name}
						onChange={(e) =>
							onChange({ ...contactPerson, name: e.target.value })
						}
						placeholder="Karl Andersson"
						className="h-10 text-xs"
					/>
				</div>
				<div>
					<Label className="text-xs font-semibold text-slate-600 mb-1 block">
						<Translate text={localizationConstants.fieldContactRole} />
					</Label>
					<Input
						value={contactPerson.role}
						onChange={(e) =>
							onChange({ ...contactPerson, role: e.target.value })
						}
						placeholder="info"
						className="h-10 text-xs"
					/>
				</div>
				<div>
					<Label className="text-xs font-semibold text-slate-600 mb-1 block">
						<Translate text={localizationConstants.fieldContactEmail} />
					</Label>
					<Input
						type="email"
						value={contactPerson.email}
						onChange={(e) =>
							onChange({ ...contactPerson, email: e.target.value })
						}
						placeholder="karl.andersson@seb.se"
						className="h-10 text-xs"
					/>
				</div>
				<div>
					<Label className="text-xs font-semibold text-slate-600 mb-1 block">
						<Translate text={localizationConstants.fieldContactPhone} />
					</Label>
					<Input
						value={contactPerson.phone}
						onChange={(e) =>
							onChange({ ...contactPerson, phone: e.target.value })
						}
						placeholder="+46 8 763 80 00"
						className="h-10 text-xs font-mono"
					/>
				</div>
			</div>
		</div>
	);
}
