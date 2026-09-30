"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SALES_MODULE_HREF } from "../../constants/salesNav";
import type { SalesCompany, SalesEmailTemplate } from "../../types";

type PresentationEmailSectionProps = {
	company: SalesCompany;
	templates: SalesEmailTemplate[];
	onSend: (company: SalesCompany, template: SalesEmailTemplate) => void;
};

/** Pick a presentation email from Settings and open it, filled in, in the mail program. */
export function PresentationEmailSection({ company, templates, onSend }: PresentationEmailSectionProps) {
	const t = useTranslate();
	const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
	const template = templates.find((item) => item.id === templateId) ?? templates[0];
	const hasEmail = Boolean(company.email.trim());

	return (
		<div className="flex flex-col gap-1.5 border-t border-slate-200 pt-4">
			<label className="text-sm font-medium text-slate-700" htmlFor="booker-presentation">
				<Translate text={localizationConstants.salesBookerPresentationLabel} />
			</label>
			{templates.length === 0 ? (
				<p className="text-sm text-slate-500">
					<Translate text={localizationConstants.salesBookerPresentationNoTemplates} />{" "}
					<Link className="font-medium text-slate-700 hover:underline" href={`${SALES_MODULE_HREF}/settings`}>
						<Translate text={localizationConstants.salesNavSettings} />
					</Link>
				</p>
			) : (
				<>
					<Select value={template?.id} onValueChange={setTemplateId}>
						<SelectTrigger id="booker-presentation" className="w-full">
							<SelectValue placeholder={t(localizationConstants.salesBookerPresentationLabel)} />
						</SelectTrigger>
						<SelectContent>
							{templates.map((item) => (
								<SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						type="button"
						variant="outline"
						className="h-10 gap-2 active:scale-[0.98]"
						disabled={!hasEmail || !template}
						onClick={() => template && onSend(company, template)}
					>
						<Mail className="h-4 w-4" />
						<Translate text={localizationConstants.salesBookerPresentationSend} />
					</Button>
					{!hasEmail && (
						<p className="text-sm text-slate-500">
							<Translate text={localizationConstants.salesBookerPresentationNoEmail} />
						</p>
					)}
				</>
			)}
		</div>
	);
}
