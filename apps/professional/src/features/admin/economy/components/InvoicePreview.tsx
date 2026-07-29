"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { EconomyInvoice, getInvoiceLinesTotal } from "../constants/mockData";
import "./invoice-print.css";

const InvoiceWaves = () => (
	<svg
		viewBox="0 0 656 220"
		className="block w-full"
		preserveAspectRatio="none"
		aria-hidden
	>
		<path
			d="M0 90 C 120 20, 240 20, 330 110 C 380 160, 420 190, 470 200 L 0 220 Z"
			className="fill-slate-300"
		/>
		<path
			d="M656 40 C 560 130, 470 190, 330 200 C 220 208, 120 216, 0 220 L 656 220 Z"
			className="fill-slate-700"
		/>
	</svg>
);

const InvoicePreview = ({ invoice }: { invoice: EconomyInvoice }) => {
	const router = useRouter();
	const t = useTranslate();
	const total = getInvoiceLinesTotal(invoice);

	return (
		<div className="flex min-h-full flex-col bg-slate-600">
			<div className="flex items-center justify-between bg-slate-800 px-4 py-2.5 text-white">
				<div className="flex items-center gap-3">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-white hover:bg-slate-700 hover:text-white"
						onClick={() => router.push("/admin/economy")}
						aria-label={t(localizationConstants.invoicePreviewBack)}
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<span className="text-sm font-medium">
						{`Faktura-${invoice.invoiceNo}.pdf`}
					</span>
				</div>
				<div className="flex items-center gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-white hover:bg-slate-700 hover:text-white"
						onClick={() => window.print()}
						aria-label={t(
							localizationConstants.invoicePreviewDownload,
						)}
					>
						<Download className="h-4 w-4" />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-white hover:bg-slate-700 hover:text-white"
						onClick={() => window.print()}
						aria-label={t(
							localizationConstants.invoicePreviewPrint,
						)}
					>
						<Printer className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="flex flex-1 justify-center overflow-y-auto px-4 py-10 print:p-0">
				<div className="invoice-print-area flex h-fit w-full max-w-[41rem] flex-col overflow-hidden bg-white shadow-xl">
					<div className="px-12 pt-12">
						<div className="flex items-start justify-between text-xs font-medium tracking-wide text-slate-800">
							<span className="whitespace-pre-line">
								<Translate
									text={
										localizationConstants.invoicePreviewYourLogo
									}
								/>
							</span>
							<span>
								<Translate
									text={
										localizationConstants.invoicePreviewNoPrefix
									}
								/>{" "}
								{invoice.invoiceNo}
							</span>
						</div>

						<h1 className="mt-10 text-5xl font-extrabold tracking-tight text-slate-900">
							<Translate
								text={localizationConstants.invoicePreviewTitle}
							/>
						</h1>

						<p className="mt-8 text-sm text-slate-800">
							<span className="font-bold">
								<Translate
									text={
										localizationConstants.invoicePreviewDateLabel
									}
								/>
							</span>{" "}
							{invoice.date}
						</p>

						<div className="mt-6 grid grid-cols-2 gap-8 text-sm text-slate-800">
							<div>
								<p className="font-bold">
									<Translate
										text={
											localizationConstants.invoicePreviewBilledTo
										}
									/>
								</p>
								<p>{invoice.billedTo.name}</p>
								<p>{invoice.billedTo.address}</p>
								<p>{invoice.billedTo.email}</p>
							</div>
							<div>
								<p className="font-bold">
									<Translate
										text={
											localizationConstants.invoicePreviewFrom
										}
									/>
								</p>
								<p>{invoice.from.name}</p>
								<p>{invoice.from.address}</p>
								<p>{invoice.from.email}</p>
							</div>
						</div>

						<table className="mt-8 w-full text-sm text-slate-800">
							<thead>
								<tr className="bg-slate-200 text-left">
									<th className="px-3 py-2 font-medium">
										<Translate
											text={
												localizationConstants.invoicePreviewItemCol
											}
										/>
									</th>
									<th className="px-3 py-2 text-right font-medium">
										<Translate
											text={
												localizationConstants.invoicePreviewQuantityCol
											}
										/>
									</th>
									<th className="px-3 py-2 text-right font-medium">
										<Translate
											text={
												localizationConstants.invoicePreviewPriceCol
											}
										/>
									</th>
									<th className="px-3 py-2 text-right font-medium">
										<Translate
											text={
												localizationConstants.invoicePreviewAmountCol
											}
										/>
									</th>
								</tr>
							</thead>
							<tbody>
								{invoice.lines.map((line) => (
									<tr
										key={line.id}
										className="border-b border-slate-100"
									>
										<td className="px-3 py-2">
											{line.item}
										</td>
										<td className="px-3 py-2 text-right">
											{line.quantity}
										</td>
										<td className="px-3 py-2 text-right">
											${line.price}
										</td>
										<td className="px-3 py-2 text-right">
											${line.quantity * line.price}
										</td>
									</tr>
								))}
								<tr className="border-b border-slate-300">
									<td className="px-3 py-2" />
									<td className="px-3 py-2" />
									<td className="px-3 py-2 text-right font-bold">
										<Translate
											text={
												localizationConstants.invoicePreviewTotal
											}
										/>
									</td>
									<td className="px-3 py-2 text-right font-bold">
										${total}
									</td>
								</tr>
							</tbody>
						</table>

						<div className="mt-8 space-y-1 pb-6 text-sm text-slate-800">
							<p>
								<span className="font-bold">
									<Translate
										text={
											localizationConstants.invoicePreviewPaymentMethod
										}
									/>
								</span>{" "}
								{invoice.paymentMethod}
							</p>
							<p>
								<span className="font-bold">
									<Translate
										text={
											localizationConstants.invoicePreviewNoteLabel
										}
									/>
								</span>{" "}
								<Translate
									text={
										localizationConstants.invoicePreviewNoteText
									}
								/>
							</p>
						</div>
					</div>

					<InvoiceWaves />
				</div>
			</div>
		</div>
	);
};

export default InvoicePreview;
