"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MOCK_CUSTOMERS, MOCK_PROJECTS, MOCK_PRODUCTS } from "../data/directOrders.mock";
import type { DirectOrderRow } from "../types/directOrder.types";

export interface CreateDirectOrderModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (newOrder: DirectOrderRow) => void;
}

interface FormLineItem {
	id: string;
	productId: string;
	productNameKey: string;
	quantity: number;
	unitPrice: number;
	discountPercent: number;
	vatPercent: number;
}

export function CreateDirectOrderModal({ isOpen, onClose, onSave }: CreateDirectOrderModalProps) {
	const { t } = useTranslation();
	const router = useRouter();
	const [customerId, setCustomerId] = useState("");
	const [projectId, setProjectId] = useState("");
	const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
	const [deliveryDate, setDeliveryDate] = useState("");
	const [referenceNo, setReferenceNo] = useState("");
	const [notes, setNotes] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [items, setItems] = useState<FormLineItem[]>([
		{
			id: "item-1",
			productId: MOCK_PRODUCTS[0].id,
			productNameKey: MOCK_PRODUCTS[0].nameKey,
			quantity: 1,
			unitPrice: MOCK_PRODUCTS[0].unitPrice,
			discountPercent: 0,
			vatPercent: MOCK_PRODUCTS[0].vatPercent,
		},
	]);

	if (!isOpen) return null;

	const filteredProjects = MOCK_PROJECTS.filter(
		(p) => !customerId || p.customerId === customerId
	);

	const handleCustomerChange = (val: string) => {
		setCustomerId(val);
		setError("");
		const validProject = MOCK_PROJECTS.find((p) => p.id === projectId && p.customerId === val);
		if (!validProject) {
			setProjectId("");
		}
	};

	const handleAddItem = () => {
		const defaultProd = MOCK_PRODUCTS[0];
		setItems((prev) => [
			...prev,
			{
				id: `item-${Date.now()}`,
				productId: defaultProd.id,
				productNameKey: defaultProd.nameKey,
				quantity: 1,
				unitPrice: defaultProd.unitPrice,
				discountPercent: 0,
				vatPercent: defaultProd.vatPercent,
			},
		]);
	};

	const handleRemoveItem = (id: string) => {
		if (items.length <= 1) return;
		setItems((prev) => prev.filter((i) => i.id !== id));
	};

	const handleProductChange = (index: number, prodId: string) => {
		const prod = MOCK_PRODUCTS.find((p) => p.id === prodId);
		if (!prod) return;

		setItems((prev) => {
			const updated = [...prev];
			updated[index] = {
				...updated[index],
				productId: prod.id,
				productNameKey: prod.nameKey,
				unitPrice: prod.unitPrice,
				vatPercent: prod.vatPercent,
			};
			return updated;
		});
	};

	const calculateLineTotal = (item: FormLineItem) => {
		const sub = item.quantity * item.unitPrice;
		const discount = sub * (item.discountPercent / 100);
		return sub - discount;
	};

	const subtotal = items.reduce((acc, item) => acc + calculateLineTotal(item), 0);
	const vatTotal = items.reduce(
		(acc, item) => acc + calculateLineTotal(item) * (item.vatPercent / 100),
		0
	);
	const grandTotal = subtotal + vatTotal;

	const handleSubmit = async (asDraft = false) => {
		if (!customerId) {
			setError("Vänligen välj en kund.");
			return;
		}
		if (!projectId) {
			setError("Vänligen välj ett projekt.");
			return;
		}
		if (items.length === 0 || items.some((item) => !item.productId || item.quantity <= 0)) {
			setError("Minst en giltig artikel med antal större än 0 krävs.");
			return;
		}

		setError("");
		setIsSubmitting(true);

		try {
			// Simulate async network request
			await new Promise((resolve) => setTimeout(resolve, 300));

			const selectedCust = MOCK_CUSTOMERS.find((c) => c.id === customerId);
			const selectedProj = MOCK_PROJECTS.find((p) => p.id === projectId);

			const newOrder: DirectOrderRow = {
				id: `do-${Date.now()}`,
				serialNo: `00${Math.floor(Math.random() * 90) + 10}`,
				orderName: selectedProj ? selectedProj.name : "Renovation",
				customer: selectedCust ? selectedCust.name : "Okänd kund",
				projectId,
				projectName: selectedProj?.name,
				start: orderDate || "2024/01/01",
				deliveryDate: deliveryDate || "2024/02/01",
				status: asDraft ? "pending" : "opened",
				referenceNo: referenceNo || `PO-${Math.floor(Math.random() * 9000) + 1000}`,
				subtotal,
				vatTotal,
				grandTotal,
			};

			onSave(newOrder);
			onClose();
			router.push("/module/production/order/overview");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto">
			<div className="relative w-full max-w-4xl rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
				{/* Modal Header */}
				<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
					<h2 className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.createDirectOrder} />
					</h2>
					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer disabled:opacity-50"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Modal Body */}
				<div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
					{error && (
						<div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
							<AlertCircle className="h-4 w-4 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					{/* Header Info Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{/* Customer Selection */}
						<div className="flex flex-col gap-1.5">
							<Label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.orderCustomer} />
							</Label>
							<Select value={customerId} onValueChange={handleCustomerChange} disabled={isSubmitting}>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-xs">
									<SelectValue placeholder="Välj kund..." />
								</SelectTrigger>
								<SelectContent className="bg-white">
									{MOCK_CUSTOMERS.map((cust) => (
										<SelectItem key={cust.id} value={cust.id}>
											{cust.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Project Selection (Filtered by Customer) */}
						<div className="flex flex-col gap-1.5">
							<Label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.projectLabel} />
							</Label>
							<Select
								value={projectId}
								disabled={isSubmitting}
								onValueChange={(val) => {
									setProjectId(val);
									setError("");
								}}
							>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-xs">
									<SelectValue placeholder="Välj projekt..." />
								</SelectTrigger>
								<SelectContent className="bg-white">
									{filteredProjects.map((proj) => (
										<SelectItem key={proj.id} value={proj.id}>
											{proj.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* PO Reference */}
						<div className="flex flex-col gap-1.5">
							<Label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.poNumberLabel} />
							</Label>
							<Input
								type="text"
								value={referenceNo}
								disabled={isSubmitting}
								onChange={(e) => setReferenceNo(e.target.value)}
								placeholder="e.g. PO-9921"
								className="h-10 border-slate-200 text-xs"
							/>
						</div>

						{/* Order Date */}
						<div className="flex flex-col gap-1.5">
							<Label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.orderStart} />
							</Label>
							<Input
								type="date"
								value={orderDate}
								disabled={isSubmitting}
								onChange={(e) => setOrderDate(e.target.value)}
								className="h-10 border-slate-200 text-xs"
							/>
						</div>

						{/* Expected Delivery Date */}
						<div className="flex flex-col gap-1.5">
							<Label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.orderEnd} />
							</Label>
							<Input
								type="date"
								value={deliveryDate}
								disabled={isSubmitting}
								onChange={(e) => setDeliveryDate(e.target.value)}
								className="h-10 border-slate-200 text-xs"
							/>
						</div>
					</div>

					{/* Order Items Table */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-semibold text-slate-900">
								<Translate text={localizationConstants.orderItemsHeader} />
							</h3>
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={isSubmitting}
								onClick={handleAddItem}
								className="h-8 gap-1 text-xs border-slate-200 cursor-pointer"
							>
								<Plus className="h-3.5 w-3.5" />
								<span><Translate text={localizationConstants.addItemButton} /></span>
							</Button>
						</div>

						<div className="overflow-x-auto border border-slate-200 rounded-lg">
							<table className="w-full border-collapse text-left text-xs">
								<thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
									<tr>
										<th className="p-2.5 w-48"><Translate text={localizationConstants.productArticle} /></th>
										<th className="p-2.5 w-20 text-center"><Translate text={localizationConstants.quantity} /></th>
										<th className="p-2.5 w-24 text-right"><Translate text={localizationConstants.unitPrice} /></th>
										<th className="p-2.5 w-20 text-center"><Translate text={localizationConstants.discountPercent} /></th>
										<th className="p-2.5 w-20 text-center"><Translate text={localizationConstants.vatPercent} /></th>
										<th className="p-2.5 w-28 text-right"><Translate text={localizationConstants.lineTotal} /></th>
										<th className="p-2.5 w-10 text-center"></th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{items.map((item, idx) => {
										const total = calculateLineTotal(item);
										return (
											<tr key={item.id} className="hover:bg-slate-50/50">
												<td className="p-2">
													<Select
														value={item.productId}
														disabled={isSubmitting}
														onValueChange={(val) => handleProductChange(idx, val)}
													>
														<SelectTrigger className="h-8 w-full border-slate-200 bg-white text-xs">
															<SelectValue />
														</SelectTrigger>
														<SelectContent className="bg-white">
															{MOCK_PRODUCTS.map((prod) => (
																<SelectItem key={prod.id} value={prod.id}>
																	<Translate text={prod.nameKey} />
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</td>
												<td className="p-2">
													<Input
														type="number"
														min={1}
														value={item.quantity}
														disabled={isSubmitting}
														onChange={(e) => {
															const val = Number(e.target.value);
															setItems((prev) => {
																const u = [...prev];
																u[idx] = { ...u[idx], quantity: val };
																return u;
															});
														}}
														className="h-8 text-center border-slate-200 text-xs"
													/>
												</td>
												<td className="p-2">
													<Input
														type="number"
														min={0}
														value={item.unitPrice}
														disabled={isSubmitting}
														onChange={(e) => {
															const val = Number(e.target.value);
															setItems((prev) => {
																const u = [...prev];
																u[idx] = { ...u[idx], unitPrice: val };
																return u;
															});
														}}
														className="h-8 text-right border-slate-200 text-xs"
													/>
												</td>
												<td className="p-2">
													<Input
														type="number"
														min={0}
														max={100}
														value={item.discountPercent}
														disabled={isSubmitting}
														onChange={(e) => {
															const val = Number(e.target.value);
															setItems((prev) => {
																const u = [...prev];
																u[idx] = { ...u[idx], discountPercent: val };
																return u;
															});
														}}
														className="h-8 text-center border-slate-200 text-xs"
													/>
												</td>
												<td className="p-2">
													<Select
														value={String(item.vatPercent)}
														disabled={isSubmitting}
														onValueChange={(val) => {
															setItems((prev) => {
																const u = [...prev];
																u[idx] = { ...u[idx], vatPercent: Number(val) };
																return u;
															});
														}}
													>
														<SelectTrigger className="h-8 w-full border-slate-200 bg-white text-xs">
															<SelectValue />
														</SelectTrigger>
														<SelectContent className="bg-white">
															<SelectItem value="0">0%</SelectItem>
															<SelectItem value="12">12%</SelectItem>
															<SelectItem value="25">25%</SelectItem>
														</SelectContent>
													</Select>
												</td>
												<td className="p-2.5 text-right font-medium text-slate-900 whitespace-nowrap">
													{total.toLocaleString("sv-SE")} SEK
												</td>
												<td className="p-2 text-center">
													<button
														type="button"
														onClick={() => handleRemoveItem(item.id)}
														disabled={items.length <= 1 || isSubmitting}
														className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
													>
														<Trash2 className="h-4 w-4" />
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>

					{/* Notes & Financial Summary Section */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
						<div className="flex flex-col gap-1.5">
							<Label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.notesLabel} />
							</Label>
							<textarea
								value={notes}
								disabled={isSubmitting}
								onChange={(e) => setNotes(e.target.value)}
								rows={4}
								placeholder={t(localizationConstants.notesPlaceholder)}
								className="w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:opacity-50"
							/>
						</div>

						<div className="flex flex-col gap-2 rounded-lg bg-slate-50 p-4 border border-slate-200">
							<div className="flex items-center justify-between text-xs text-slate-600">
								<span><Translate text={localizationConstants.subtotal} /></span>
								<span>{subtotal.toLocaleString("sv-SE")} SEK</span>
							</div>
							<div className="flex items-center justify-between text-xs text-slate-600">
								<span><Translate text={localizationConstants.vatTotal} /></span>
								<span>{vatTotal.toLocaleString("sv-SE")} SEK</span>
							</div>
							<div className="my-1 border-t border-slate-200" />
							<div className="flex items-center justify-between text-sm font-semibold text-slate-900">
								<span><Translate text={localizationConstants.grandTotal} /></span>
								<span>{grandTotal.toLocaleString("sv-SE")} SEK</span>
							</div>
						</div>
					</div>
				</div>

				{/* Modal Footer Actions */}
				<div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isSubmitting}
						className="h-9 text-xs border-slate-200 cursor-pointer"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="button"
						variant="outline"
						disabled={isSubmitting}
						onClick={() => handleSubmit(true)}
						className="h-9 text-xs border-slate-200 cursor-pointer gap-1.5"
					>
						{isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
						<Translate text={localizationConstants.saveDraft} />
					</Button>
					<Button
						type="button"
						disabled={isSubmitting}
						onClick={() => handleSubmit(false)}
						className="h-9 text-xs bg-[#111721] text-white hover:bg-slate-800 cursor-pointer gap-1.5"
					>
						{isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
						<Translate text={localizationConstants.createDirectOrderButton} />
					</Button>
				</div>
			</div>
		</div>
	);
}
