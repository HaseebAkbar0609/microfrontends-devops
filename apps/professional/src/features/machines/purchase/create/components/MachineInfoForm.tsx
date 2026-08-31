import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MachineSectionIcon } from "./MachineSectionIcon";

interface MachineInfoFormProps {
	formData: {
		number: string;
		type: string;
		brand: string;
		designation: string;
		price: string;
		quantity: string;
		supplier: string;
		address: string;
		postalCode: string;
		city: string;
		phone: string;
		email: string;
		additionalInfo: string;
	};
	errors: Record<string, string>;
	onChange: (field: string, value: string) => void;
}

export function MachineInfoForm({
	formData,
	errors,
	onChange,
}: MachineInfoFormProps) {
	const unitPrice = parseFloat(formData.price) || 0;
	const qty = parseInt(formData.quantity, 10) || 1;
	const totalCost = unitPrice * qty;

	return (
		<div className="flex flex-col gap-6">
			{/* Card 1: Maskindetaljer */}
			<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
				<div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-5">
					<div className="flex items-center gap-2.5">
						<MachineSectionIcon className="h-4 w-4 text-slate-700" />
						<h3 className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.machinePurchaseCardDetails} />
						</h3>
					</div>

					{/* Total cost badge if price entered */}
					{unitPrice > 0 && (
						<div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
							<span>Totalt: </span>
							<span className="text-slate-900">
								{new Intl.NumberFormat("sv-SE", {
									style: "currency",
									currency: "SEK",
									maximumFractionDigits: 0,
								}).format(totalCost)}
							</span>
						</div>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
					{/* Row 1: Nummer & Typ */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.machinePurchaseColNumber} />{" "}
							<span className="text-red-500">*</span>
						</label>
						<Input
							value={formData.number}
							onChange={(e) => onChange("number", e.target.value)}
							placeholder="001"
							className={`bg-[#F8FAFC] text-xs h-9 ${
								errors.number
									? "border-red-500 focus-visible:ring-red-400"
									: "border-slate-200"
							}`}
						/>
						{errors.number && (
							<span className="text-[11px] text-red-500">{errors.number}</span>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.machinePurchaseColType} />{" "}
							<span className="text-red-500">*</span>
						</label>
						<Select
							value={formData.type}
							onValueChange={(val) => onChange("type", val)}
						>
							<SelectTrigger
								className={`bg-white text-xs h-9 text-slate-700 ${
									errors.type ? "border-red-500" : "border-slate-200"
								}`}
							>
								<SelectValue placeholder="info" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Borrmaskin">Borrmaskin</SelectItem>
								<SelectItem value="Handmaskin">Handmaskin</SelectItem>
								<SelectItem value="Tunga maskiner">Tunga maskiner</SelectItem>
								<SelectItem value="Fordon">Fordon</SelectItem>
								<SelectItem value="Grävmaskin">Grävmaskin</SelectItem>
								<SelectItem value="Skruvdragare">Skruvdragare</SelectItem>
								<SelectItem value="Övrigt">Övrigt</SelectItem>
							</SelectContent>
						</Select>
						{errors.type && (
							<span className="text-[11px] text-red-500">{errors.type}</span>
						)}
					</div>

					{/* Row 2: Fabrikat & Beteckning */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.machinePurchaseColBrand} />{" "}
							<span className="text-red-500">*</span>
						</label>
						<Input
							value={formData.brand}
							onChange={(e) => onChange("brand", e.target.value)}
							placeholder="info"
							className={`bg-white text-xs h-9 placeholder:text-slate-400 ${
								errors.brand
									? "border-red-500 focus-visible:ring-red-400"
									: "border-slate-200"
							}`}
						/>
						{errors.brand && (
							<span className="text-[11px] text-red-500">{errors.brand}</span>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.machinePurchaseColDesignation} />{" "}
							<span className="text-red-500">*</span>
						</label>
						<Input
							value={formData.designation}
							onChange={(e) => onChange("designation", e.target.value)}
							placeholder="info"
							className={`bg-white text-xs h-9 placeholder:text-slate-400 ${
								errors.designation
									? "border-red-500 focus-visible:ring-red-400"
									: "border-slate-200"
							}`}
						/>
						{errors.designation && (
							<span className="text-[11px] text-red-500">{errors.designation}</span>
						)}
					</div>

					{/* Row 3: Pris & Leverantör */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.machinePurchaseColPrice} /> (SEK){" "}
							<span className="text-red-500">*</span>
						</label>
						<Input
							type="number"
							value={formData.price}
							onChange={(e) => onChange("price", e.target.value)}
							placeholder="info"
							className={`bg-white text-xs h-9 placeholder:text-slate-400 ${
								errors.price
									? "border-red-500 focus-visible:ring-red-400"
									: "border-slate-200"
							}`}
						/>
						{errors.price && (
							<span className="text-[11px] text-red-500">{errors.price}</span>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.machinePurchaseColSupplier} />{" "}
							<span className="text-red-500">*</span>
						</label>
						<Input
							value={formData.supplier}
							onChange={(e) => onChange("supplier", e.target.value)}
							placeholder="info"
							className={`bg-white text-xs h-9 placeholder:text-slate-400 ${
								errors.supplier
									? "border-red-500 focus-visible:ring-red-400"
									: "border-slate-200"
							}`}
						/>
						{errors.supplier && (
							<span className="text-[11px] text-red-500">{errors.supplier}</span>
						)}
					</div>

					{/* Row 4: Address & Post nr */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.machinePurchaseColAddress} />
						</label>
						<Input
							value={formData.address}
							onChange={(e) => onChange("address", e.target.value)}
							placeholder="info"
							className="bg-white border-slate-200 text-xs h-9 placeholder:text-slate-400"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.machinePurchaseColPostalCode} />
						</label>
						<Input
							value={formData.postalCode}
							onChange={(e) => onChange("postalCode", e.target.value)}
							placeholder="info"
							className="bg-white border-slate-200 text-xs h-9 placeholder:text-slate-400"
						/>
					</div>

					{/* Row 5: Ort & Telefon */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.machinePurchaseColCity} />
						</label>
						<Input
							value={formData.city}
							onChange={(e) => onChange("city", e.target.value)}
							placeholder="info"
							className="bg-white border-slate-200 text-xs h-9 placeholder:text-slate-400"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.machinePurchaseColPhone} />
						</label>
						<Input
							value={formData.phone}
							onChange={(e) => onChange("phone", e.target.value)}
							placeholder="info"
							className="bg-white border-slate-200 text-xs h-9 placeholder:text-slate-400"
						/>
					</div>

					{/* Row 6: Mail */}
					<div className="flex flex-col gap-1.5 md:col-span-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.machinePurchaseColEmail} />
						</label>
						<Input
							type="email"
							value={formData.email}
							onChange={(e) => onChange("email", e.target.value)}
							placeholder="info"
							className={`bg-white text-xs h-9 placeholder:text-slate-400 ${
								errors.email
									? "border-red-500 focus-visible:ring-red-400"
									: "border-slate-200"
							}`}
						/>
						{errors.email && (
							<span className="text-[11px] text-red-500">{errors.email}</span>
						)}
					</div>
				</div>
			</div>

			{/* Card 2: Ytterligare information */}
			<div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
				<div className="flex items-center gap-2.5 border-b border-[#E2E8F0] pb-3 mb-5">
					<MachineSectionIcon className="h-4 w-4 text-slate-700" />
					<h3 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.machinePurchaseCardAdditional} />
					</h3>
				</div>

				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.machinePurchaseFieldMaskinInfo} />
					</label>
					<Textarea
						value={formData.additionalInfo}
						onChange={(e) => onChange("additionalInfo", e.target.value)}
						placeholder="info"
						rows={4}
						className="bg-white border-slate-200 text-xs resize-none placeholder:text-slate-400"
					/>
				</div>
			</div>
		</div>
	);
}
