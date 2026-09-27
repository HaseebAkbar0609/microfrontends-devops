"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateArticleFormData } from "../../../../types/article.types";

export function ArticleBasicInfoFields() {
	const {
		register,
		control,
		watch,
		formState: { errors },
	} = useFormContext<CreateArticleFormData>();

	const husarbeteValue = watch("husarbete");

	return (
		<div className="flex flex-col gap-6">
			<h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
				<Translate text={localizationConstants.basicInfoSectionTitle} />
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* Article No */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleNoHeader} />
					</label>
					<Input
						{...register("articleNr")}
						placeholder="Genereras automatiskt"
						className="h-10 text-xs bg-white border-slate-200"
					/>
				</div>

				{/* Description / Benämning */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleBenamningLabel} /> *
					</label>
					<Input
						{...register("benamning")}
						placeholder="T.ex. Konsulttimme Senior Utvecklare"
						className={`h-10 text-xs bg-white border-slate-200 ${errors.benamning ? "border-red-500" : ""}`}
					/>
					{errors.benamning && (
						<span className="text-[11px] text-red-500 font-medium">
							<Translate text={localizationConstants.validationArticleNameRequired} />
						</span>
					)}
				</div>

				{/* EAN */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleEanLabel} />
					</label>
					<Input
						{...register("ean")}
						placeholder="7350012345678"
						className="h-10 text-xs bg-white border-slate-200"
					/>
				</div>

				{/* Supplier / Leverantör */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleLeverantorLabel} /> *
					</label>
					<Input
						{...register("leverantor")}
						placeholder="T.ex. Acme Nordic AB"
						className={`h-10 text-xs bg-white border-slate-200 ${errors.leverantor ? "border-red-500" : ""}`}
					/>
					{errors.leverantor && (
						<span className="text-[11px] text-red-500 font-medium">
							<Translate text={localizationConstants.validationArticleSupplierRequired} />
						</span>
					)}
				</div>

				{/* House work / Husarbete Radio Group */}
				<div className="flex flex-col gap-2">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleHusarbeteLabel} />
					</label>
					<Controller
						name="husarbete"
						control={control}
						render={({ field }) => (
							<RadioGroup
								value={field.value || "nej"}
								onValueChange={field.onChange}
								className="flex items-center gap-6 pt-1"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="ja" id="husarbete-ja" />
									<Label htmlFor="husarbete-ja" className="text-xs font-medium cursor-pointer text-slate-700">
										<Translate text={localizationConstants.yesLabel} />
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="nej" id="husarbete-nej" />
									<Label htmlFor="husarbete-nej" className="text-xs font-medium cursor-pointer text-slate-700">
										<Translate text={localizationConstants.noLabel} />
									</Label>
								</div>
							</RadioGroup>
						)}
					/>
				</div>

				{/* Supplier Article No */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleSupplierArticleNoLabel} />
					</label>
					<Input
						{...register("supplierArticleNo")}
						placeholder="T.ex. ACME-1001"
						className="h-10 text-xs bg-white border-slate-200"
					/>
				</div>

				{/* Type of house work (conditional) */}
				{husarbeteValue === "ja" && (
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.articleTypHusarbeteLabel} />
						</label>
						<Controller
							name="typHusarbete"
							control={control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="h-10 border-slate-200 bg-white text-xs">
										<SelectValue placeholder="Välj typ av husarbete" />
									</SelectTrigger>
									<SelectContent className="bg-white border-slate-200 shadow-md">
										<SelectItem value="ROT">ROT-arbete</SelectItem>
										<SelectItem value="RUT">RUT-arbete</SelectItem>
										<SelectItem value="Grön teknik">Grön teknik</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
				)}

				{/* Unit / Enhet */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleEnhetLabel} /> *
					</label>
					<Controller
						name="enhet"
						control={control}
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger className={`h-10 border-slate-200 bg-white text-xs ${errors.enhet ? "border-red-500" : ""}`}>
									<SelectValue placeholder="Välj enhet" />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200 shadow-md">
									<SelectItem value="Styck">Styck (st)</SelectItem>
									<SelectItem value="Tim">Timme (tim)</SelectItem>
									<SelectItem value="Meter">Meter (m)</SelectItem>
									<SelectItem value="Kg">Kilogram (kg)</SelectItem>
									<SelectItem value="Liter">Liter (l)</SelectItem>
									<SelectItem value="Månad">Månad (mån)</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.enhet && (
						<span className="text-[11px] text-red-500 font-medium">
							<Translate text={localizationConstants.validationArticleUnitRequired} />
						</span>
					)}
				</div>

				{/* Article Type / Typ av artikel */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleTypAvArtikelLabel} /> *
					</label>
					<Controller
						name="typAvArtikel"
						control={control}
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger className={`h-10 border-slate-200 bg-white text-xs ${errors.typAvArtikel ? "border-red-500" : ""}`}>
									<SelectValue placeholder="Välj typ" />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200 shadow-md">
									<SelectItem value="Vara">Vara</SelectItem>
									<SelectItem value="Tjänst">Tjänst</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.typAvArtikel && (
						<span className="text-[11px] text-red-500 font-medium">
							<Translate text={localizationConstants.validationArticleTypeRequired} />
						</span>
					)}
				</div>

				{/* Stock item / Lagervara */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleLagerVaraLabel} />
					</label>
					<Controller
						name="lagerVara"
						control={control}
						render={({ field }) => (
							<Select value={field.value || "Nej"} onValueChange={field.onChange}>
								<SelectTrigger className="h-10 border-slate-200 bg-white text-xs">
									<SelectValue placeholder="Välj lagervara" />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200 shadow-md">
									<SelectItem value="Ja">Ja</SelectItem>
									<SelectItem value="Nej">Nej</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
				</div>
			</div>
		</div>
	);
}
