import { Mail } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { UseFormReturn } from "react-hook-form";
import { CreateOfferFormValues, QuoteSupplier } from "../../types/form";

interface Step4Props {
	form: UseFormReturn<CreateOfferFormValues>;
}

export function Step4InviteSupplier({ form }: Step4Props) {
	const invitedSuppliers = form.watch("invitedSuppliers") || [];

	return (
		<div className="space-y-4">
			<Card className="border shadow-sm overflow-hidden bg-white py-0 gap-0">
				<CardHeader className="bg-slate-50/50 px-5 py-4 border-b !pb-0 ">
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
				<CardContent className="p-4 space-y-4">
					<div className="flex justify-between items-center mb-2">
						<label className="text-sm font-medium text-slate-700">
							<Translate
								text={
									localizationConstants.selectedSuppliersLabel
								}
							/>
						</label>
					</div>

					<div className="flex flex-col md:flex-row w-full items-start gap-6">
						<div className="border rounded-md flex-1 w-full overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="font-normal text-slate-500 bg-slate-50/50">
											<Translate
												text={
													localizationConstants.companyNameLabel
												}
											/>{" "}
											<span className="text-[10px]">
												↓↑
											</span>
										</TableHead>
										<TableHead className="font-normal text-slate-500 bg-slate-50/50">
											<Translate
												text={
													localizationConstants.orgNoLabel
												}
											/>{" "}
											<span className="text-[10px]">
												↓↑
											</span>
										</TableHead>
										<TableHead className="font-normal text-slate-500 bg-slate-50/50">
											<Translate
												text={
													localizationConstants.contactPersonNameLabel
												}
											/>{" "}
											<span className="text-[10px]">
												↓↑
											</span>
										</TableHead>
										<TableHead className="font-normal text-slate-500 bg-slate-50/50">
											<Translate
												text={
													localizationConstants.emailLabel
												}
											/>
										</TableHead>
										<TableHead className="w-[50px] bg-slate-50/50"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{invitedSuppliers.length > 0 ? (
										invitedSuppliers.map(
											(supplier: QuoteSupplier) => (
												<TableRow key={supplier.id}>
													<TableCell className="text-sm text-slate-600">
														{supplier.companyName}
													</TableCell>
													<TableCell className="text-sm text-slate-600">
														{supplier.orgNumber}
													</TableCell>
													<TableCell className="text-sm text-slate-600">
														{
															supplier.contactFirstName
														}{" "}
														{
															supplier.contactLastName
														}
													</TableCell>
													<TableCell className="text-sm text-slate-600">
														{supplier.emailAddress}
													</TableCell>
													<TableCell>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-slate-400"
														>
															<Mail className="h-4 w-4" />
														</Button>
													</TableCell>
												</TableRow>
											),
										)
									) : (
										<TableRow>
											<TableCell
												colSpan={5}
												className="text-center py-8 text-slate-400"
											>
												<Translate
													text={
														localizationConstants.noQuotesFound
													}
												/>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
