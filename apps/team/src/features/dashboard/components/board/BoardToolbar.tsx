"use client";

import { Check, LayoutGrid, PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface BoardToolbarProps {
	editing: boolean;
	libraryOpen: boolean;
	onCustomize: () => void;
	onShowLibrary: () => void;
	onCancel: () => void;
	onSave: () => void;
}

const OUTLINE_BUTTON_CLASS =
	"h-9 gap-1.5 rounded-md border-slate-200 bg-white px-3 text-sm";

const BoardToolbar = ({
	editing,
	libraryOpen,
	onCustomize,
	onShowLibrary,
	onCancel,
	onSave,
}: BoardToolbarProps) => (
	<>
		<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
			<h1 className="text-2xl font-semibold text-slate-900">
				<Translate text={localizationConstants.dashboardTitle} />
			</h1>
			{!editing && (
				<Button
					type="button"
					variant="outline"
					onClick={onCustomize}
					className={OUTLINE_BUTTON_CLASS}
				>
					<LayoutGrid className="h-4 w-4" />
					<Translate text={localizationConstants.widgetBoardCustomize} />
				</Button>
			)}
		</div>

		{editing && (
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-slate-100 px-4 py-3">
				<div className="flex items-center gap-3">
					<LayoutGrid size={18} className="shrink-0 text-slate-600" aria-hidden />
					<div>
						<p className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.widgetBoardEditMode} />
						</p>
						<p className="text-xs text-slate-500">
							<Translate text={localizationConstants.widgetBoardEditModeHint} />
						</p>
					</div>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{!libraryOpen && (
						<Button
							type="button"
							variant="outline"
							onClick={onShowLibrary}
							className={OUTLINE_BUTTON_CLASS}
						>
							<PanelRightOpen className="h-4 w-4" />
							<Translate text={localizationConstants.widgetBoardShowLibrary} />
						</Button>
					)}
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						className={OUTLINE_BUTTON_CLASS}
					>
						<Translate text={localizationConstants.cancelLabel} />
					</Button>
					<Button
						type="button"
						onClick={onSave}
						className="h-9 gap-1.5 rounded-md bg-slate-900 px-4 text-sm text-white hover:bg-slate-900/90"
					>
						<Check className="h-4 w-4" />
						<Translate text={localizationConstants.widgetBoardSaveLayout} />
					</Button>
				</div>
			</div>
		)}
	</>
);

export default BoardToolbar;
