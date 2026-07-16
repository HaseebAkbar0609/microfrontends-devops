"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { UseFormReturn } from "react-hook-form";
import { CreateOfferFormValues, QuoteSupplier } from "../../types/form";
import { getSuppliersAPIAction } from "@/api-actions";
import { showToast } from "@/lib/toast";
import type { Supplier as AvailableSupplier } from "@/features/suppliers/types/types";

const SUPPLIER_SELECTION_LIMIT = 3;
const EMPTY_SUPPLIERS: QuoteSupplier[] = [];

interface Step4Props {
	form: UseFormReturn<CreateOfferFormValues>;
}

function normalizeSupplier(source: AvailableSupplier): QuoteSupplier {
	const [firstName, ...rest] =
		source.contactPersonName?.split(" ").map((segment) => segment.trim()) ??
		[""];

	return {
		id: source.id,
		companyName: source.companyName,
		category: "",
		orgNumber: source.orgNo,
		contactFirstName: firstName || "",
		contactLastName: rest.join(" ") || "",
		emailAddress: source.email,
		mobileNumber: "",
	};
}

export function Step4InviteSupplier({ form }: Step4Props) {
	const t = useTranslate();
	const invitedSuppliers =
		form.watch("invitedSuppliers") ?? EMPTY_SUPPLIERS;
	const [availableSuppliers, setAvailableSuppliers] = useState<
		QuoteSupplier[]
	>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isSupplierSelected = useCallback(
		(supplier: QuoteSupplier) => {
			return invitedSuppliers.some(
				(item) =>
					(item.id && item.id === supplier.id) ||
					(item.emailAddress &&
						supplier.emailAddress &&
						item.emailAddress.toLowerCase() ===
							supplier.emailAddress.toLowerCase()) ||
					(item.orgNumber &&
						supplier.orgNumber &&
						item.orgNumber === supplier.orgNumber),
			);
		},
		[invitedSuppliers],
	);

	const displayAvailableSuppliers = useMemo(() => {
		const list = [...availableSuppliers];
		const existingIds = new Set(list.map((s) => s.id));
		const existingEmails = new Set(
			list.map((s) => s.emailAddress?.toLowerCase()).filter(Boolean),
		);

		for (const invited of invitedSuppliers) {
			const emailKey = invited.emailAddress?.toLowerCase();
			const hasId = invited.id && existingIds.has(invited.id);
			const hasEmail = emailKey && existingEmails.has(emailKey);

			if (!hasId && !hasEmail) {
				list.push(invited);
			}
		}
		return list;
	}, [availableSuppliers, invitedSuppliers]);

	const loadSuppliers = useCallback(async () => {
		setLoading(true);
		setError(null);

		const result = await getSuppliersAPIAction({
			page: 1,
			pageSize: 20,
			search: searchQuery.trim() || undefined,
		});

		if (!result.success || !result.data) {
			setAvailableSuppliers([]);
			setError(t(localizationConstants.noSuppliersFound));
		} else {
			setAvailableSuppliers(result.data.suppliers.map(normalizeSupplier));
		}

		setLoading(false);
	}, [searchQuery, t]);

	useEffect(() => {
		void loadSuppliers();
	}, [loadSuppliers, invitedSuppliers.length]);

	const handleToggleSupplier = (
		supplier: QuoteSupplier,
		checked: boolean,
	) => {
		if (checked) {
			if (invitedSuppliers.length >= SUPPLIER_SELECTION_LIMIT) {
				showToast(
					"error",
					t(localizationConstants.supplierSelectionMaxExceeded),
				);
				return;
			}

			if (!isSupplierSelected(supplier)) {
				form.setValue("invitedSuppliers", [...invitedSuppliers, supplier]);
			}
			setError(null);
			return;
		}

		form.setValue(
			"invitedSuppliers",
			invitedSuppliers.filter(
				(item) =>
					item.id !== supplier.id &&
					(!item.emailAddress ||
						!supplier.emailAddress ||
						item.emailAddress.toLowerCase() !==
							supplier.emailAddress.toLowerCase()) &&
					(!item.orgNumber ||
						!supplier.orgNumber ||
						item.orgNumber !== supplier.orgNumber),
			),
		);
		setError(null);
	};

	return (
		<div className="space-y-4">
			<Card className="gap-0 overflow-hidden border border-slate-200 bg-white py-0 shadow-sm">
				<CardHeader className="border-b border-slate-200 bg-white px-5 py-4 !pb-4">
					<div className="flex items-center gap-2">
						<Mail className="h-5 w-5 text-slate-400" />
						<CardTitle className="text-base font-semibold">
							<Translate
								text={
									localizationConstants.inviteSupplierSection
								}
							/>
						</CardTitle>
					</div>
				</CardHeader>

				<CardContent className="space-y-6 p-5">
					<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
						<div className="max-w-md space-y-2">
							<p className="text-sm font-semibold text-slate-900">
								<Translate
									text={
										localizationConstants.availableSuppliersLabel
									}
								/>
							</p>
							<p className="text-sm leading-6 text-slate-500">
								<Translate
									text={
										localizationConstants.supplierSelectionLimitInfo
									}
								/>
							</p>
						</div>

						<div className="flex w-full max-w-lg items-center gap-2">
							<Input
								value={searchQuery}
								onChange={(event) =>
									setSearchQuery(event.target.value)
								}
								placeholder={t(
									localizationConstants.searchSuppliersPlaceholder,
								)}
								className="h-11 flex-1 bg-white"
							/>
							<Button
								variant="outline"
								onClick={() => void loadSuppliers()}
								disabled={loading}
								className="h-11 min-w-[96px] bg-white"
							>
								<Search className="mr-2 h-4 w-4" />
								<Translate
									text={localizationConstants.searchLabel}
								/>
							</Button>
						</div>
					</div>

					<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px]">
						<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
							<div className="max-h-[360px] overflow-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[44px] bg-slate-50" />
											<TableHead className="bg-slate-50 font-medium text-slate-500">
												<Translate
													text={
														localizationConstants.companyNameLabel
													}
												/>
											</TableHead>
											<TableHead className="bg-slate-50 font-medium text-slate-500">
												<Translate
													text={
														localizationConstants.orgNoLabel
													}
												/>
											</TableHead>
											<TableHead className="bg-slate-50 font-medium text-slate-500">
												<Translate
													text={
														localizationConstants.contactPersonNameLabel
													}
												/>
											</TableHead>
											<TableHead className="bg-slate-50 font-medium text-slate-500">
												<Translate
													text={
														localizationConstants.emailLabel
													}
												/>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{loading ? (
											<TableRow>
												<TableCell
													colSpan={5}
													className="py-8 text-center text-slate-500"
												>
													<Translate
														text={
															localizationConstants.loadingLabel
														}
													/>
												</TableCell>
											</TableRow>
										) : displayAvailableSuppliers.length > 0 ? (
											displayAvailableSuppliers.map(
												(supplier) => (
													<TableRow
														key={supplier.id}
														className="hover:bg-slate-50"
													>
														<TableCell className="px-3 py-3">
															<Checkbox
																checked={isSupplierSelected(
																	supplier,
																)}
																className="data-[state=checked]:border-slate-950 data-[state=checked]:bg-slate-950 data-[state=checked]:text-white"
																onCheckedChange={(
																	value,
																) =>
																	handleToggleSupplier(
																		supplier,
																		value ===
																			true,
																	)
																}
															/>
														</TableCell>
														<TableCell className="whitespace-nowrap text-sm text-slate-700">
															{
																supplier.companyName
															}
														</TableCell>
														<TableCell className="whitespace-nowrap text-sm text-slate-700">
															{
																supplier.orgNumber
															}
														</TableCell>
														<TableCell className="whitespace-nowrap text-sm text-slate-700">
															{
																supplier.contactFirstName
															}{" "}
															{
																supplier.contactLastName
															}
														</TableCell>
														<TableCell className="whitespace-nowrap text-sm text-slate-700">
															{
																supplier.emailAddress
															}
														</TableCell>
													</TableRow>
												),
											)
										) : (
											<TableRow>
												<TableCell
													colSpan={5}
													className="py-8 text-center text-slate-400"
												>
													<Translate
														text={
															localizationConstants.noSuppliersFound
														}
													/>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</div>

						<div className="min-h-[360px] rounded-md border border-slate-200 bg-white p-4">
							<p className="text-sm font-semibold text-slate-900">
								<Translate
									text={
										localizationConstants.selectedSuppliersLabel
									}
								/>
								: {invitedSuppliers.length}/
								{SUPPLIER_SELECTION_LIMIT}
							</p>

							{invitedSuppliers.length === 0 ? (
								<div className="flex min-h-[240px] flex-col items-center justify-center text-center text-slate-400">
									<Users className="h-12 w-12 stroke-[1.5]" />
									<p className="mt-4 text-sm">
										<Translate
											text={
												localizationConstants.noSuppliersFound
											}
										/>
									</p>
								</div>
							) : (
								<div className="mt-4 space-y-3">
									{invitedSuppliers.map((supplier) => (
										<div
											key={supplier.id}
											className="rounded-md border border-slate-200 bg-slate-50 p-3"
										>
											<p className="text-sm font-semibold text-slate-900">
												{supplier.companyName}
											</p>
											<p className="text-sm text-slate-500">
												{supplier.contactFirstName}{" "}
												{supplier.contactLastName}
											</p>
											<p className="break-all text-sm text-slate-500">
												{supplier.emailAddress}
											</p>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{error ? (
						<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
							<p className="font-semibold text-red-800">
								Validation error
							</p>
							<p className="mt-1">{error}</p>
						</div>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
