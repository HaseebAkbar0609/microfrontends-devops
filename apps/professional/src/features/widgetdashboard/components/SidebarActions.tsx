import React from "react";
import { LayoutGrid, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export const SidebarActions = () => (
	<>
		<Button className="w-full justify-center bg-gray-900 py-6  font-bold hover:bg-slate-800 h-10 text-sm">
			<LayoutGrid size={18} />
			<Translate text={localizationConstants.addMenuButton} />
		</Button>
		<Button
			variant="secondary"
			className="w-full justify-center bg-slate-100 py-6 text-sm font-bold text-slate-900 hover:bg-slate-200 h-10"
		>
			<SquarePlus size={20} />
			<Translate text={localizationConstants.addMenuButton} />
		</Button>
	</>
);
