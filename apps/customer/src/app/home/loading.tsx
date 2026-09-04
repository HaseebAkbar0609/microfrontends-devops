export default function HomeLoading() {
	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			<div className="h-8 w-48 animate-pulse rounded-md bg-slate-200" />
			<div className="grid gap-4 md:grid-cols-3">
				<div className="h-28 animate-pulse rounded-lg bg-slate-200" />
				<div className="h-28 animate-pulse rounded-lg bg-slate-200" />
				<div className="h-28 animate-pulse rounded-lg bg-slate-200" />
			</div>
			<div className="min-h-80 animate-pulse rounded-lg bg-slate-200" />
		</div>
	);
}
