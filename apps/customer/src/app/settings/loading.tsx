export default function SettingsLoading() {
	return (
		<div className="flex flex-1 flex-col gap-5 p-6">
			<div className="h-8 w-44 animate-pulse rounded-md bg-slate-200" />
			<div className="h-12 animate-pulse rounded-lg bg-slate-200" />
			<div className="grid gap-4 lg:grid-cols-2">
				<div className="h-40 animate-pulse rounded-lg bg-slate-200" />
				<div className="h-40 animate-pulse rounded-lg bg-slate-200" />
			</div>
		</div>
	);
}
