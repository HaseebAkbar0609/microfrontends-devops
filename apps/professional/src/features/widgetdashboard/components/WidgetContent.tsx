import React from "react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export const WidgetRow = ({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) => (
	<div className="flex items-baseline justify-between gap-3">
		<span className="truncate">
			<Translate text={label} />
		</span>
		<span className="shrink-0 font-medium text-slate-700">{value}</span>
	</div>
);

export const WidgetListItem = ({
	title,
	meta,
}: {
	title: string;
	meta?: React.ReactNode;
}) => (
	<div>
		<p className="text-slate-700">
			<Translate text={title} />
		</p>
		{meta && <p className="text-xs text-slate-400">{meta}</p>}
	</div>
);

export const WidgetContent = ({ children }: { children: React.ReactNode }) => (
	<div className="space-y-1 text-sm text-slate-500">{children}</div>
);

export const WidgetMockTag = () => (
	<span className="mt-2 inline-flex rounded-[4px] bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
		<Translate text={localizationConstants.widgetMockDataNote} />
	</span>
);

export const WidgetAction = ({ label }: { label: string }) => (
	<button
		type="button"
		className="mt-1 cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
	>
		<Translate text={label} />
	</button>
);

export const WidgetImagePlaceholder = ({
	description,
}: {
	description: string;
}) => (
	<>
		<div className="flex h-20 items-center justify-center rounded-md bg-slate-200/70 text-slate-400">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden
			>
				<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
				<circle cx="9" cy="9" r="2" />
				<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
			</svg>
		</div>
		<p>
			<Translate text={description} />
		</p>
	</>
);
