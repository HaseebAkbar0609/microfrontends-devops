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

export const WidgetBarRow = ({
	label,
	percent,
	value,
	color = "bg-slate-500",
}: {
	label: string;
	percent: number;
	value?: React.ReactNode;
	color?: string;
}) => (
	<div className="flex flex-col gap-0.5">
		<div className="flex items-baseline justify-between gap-3">
			<span className="truncate">
				<Translate text={label} />
			</span>
			<span className="shrink-0 font-medium text-slate-700">
				{value ?? `${percent} %`}
			</span>
		</div>
		<div className="h-1.5 w-full rounded-full bg-slate-200">
			<div
				className={`h-1.5 rounded-full ${color}`}
				style={{ width: `${percent}%` }}
			/>
		</div>
	</div>
);

/** Shown when a widget has no data to display. */
export const WidgetEmptyState = ({ message }: { message?: string }) => (
	<p className="py-4 text-center text-sm text-slate-400">
		<Translate text={message ?? localizationConstants.widgetNoData} />
	</p>
);

/** Skeleton lines shown while a widget is loading. */
export const WidgetLoadingState = ({ rows = 3 }: { rows?: number }) => (
	<div className="space-y-2 py-1" aria-busy>
		{Array.from({ length: rows }).map((_, index) => (
			<div
				key={index}
				className="h-3 animate-pulse rounded bg-slate-200"
				style={{ width: `${100 - index * 12}%` }}
			/>
		))}
	</div>
);

/** Shown when widget data failed to load. */
export const WidgetErrorState = ({ message }: { message: string }) => (
	<p className="py-4 text-center text-sm text-red-600" role="alert">
		<Translate text={message} />
	</p>
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
