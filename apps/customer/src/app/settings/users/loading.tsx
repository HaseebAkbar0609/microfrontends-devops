export default function UsersLoading() {
	return (
		<div className="flex flex-1 flex-col gap-5 p-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="h-8 w-40 animate-pulse rounded-md bg-slate-200" />
				<div className="h-10 w-28 animate-pulse rounded-md bg-slate-200" />
			</div>
			<div className="h-11 animate-pulse rounded-lg bg-slate-200" />
			<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
				{Array.from({ length: 8 }).map((_, index) => (
					<div
						key={index}
						className="grid grid-cols-4 gap-4 border-b border-slate-100 p-4 last:border-b-0"
					>
						<div className="h-4 animate-pulse rounded bg-slate-200" />
						<div className="h-4 animate-pulse rounded bg-slate-200" />
						<div className="h-4 animate-pulse rounded bg-slate-200" />
						<div className="h-4 animate-pulse rounded bg-slate-200" />
					</div>
				))}
			</div>
		</div>
	);
}
