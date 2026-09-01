/** The grey pill the purchase lists use for the Objekt column. */
export function ObjectPill({ value }: { value: string }) {
	return (
		<span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-700">
			{value}
		</span>
	);
}

export default ObjectPill;
