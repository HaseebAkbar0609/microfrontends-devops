import React from "react";
import { Folders } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { NewsItem } from "./NewsItem";

export const ModulesSection = () => (
	<Card className="p-6 gap-2.5 ">
		<CardHeader className="flex flex-row items-center gap-3 border-slate-100 px-0  ">
			<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
				<Folders size={24} className="text-slate-600" />
			</div>
			<CardTitle className="text-2xl font-semibold text-foreground">
				<Translate text={localizationConstants.modulesTitle} />
			</CardTitle>
		</CardHeader>
		<CardContent className="px-0">
			<NewsItem
				title="Karles Bygg AB is growing – opening a new office in Västerås"
				date="35 items"
				content="The local construction company Karles Bygg AB announced today that they are opening a new office in Västerås. The company, which was previously based in Enköping, is expanding due to increased demand for smaller renovation and new construction projects in the region."
			/>
			<NewsItem
				title="Karles Bygg AB is growing – opening a new office in Västerås"
				date="35 items"
				content="The local construction company Karles Bygg AB announced today that they are opening a new office in Västerås. The company, which was previously based in Enköping, is expanding due to increased demand for smaller renovation and new construction projects in the region."
			/>
		</CardContent>
	</Card>
);
