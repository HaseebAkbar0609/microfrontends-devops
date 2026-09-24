import { initialsOf } from "@/components/common/qaThread";
import { cn } from "@/lib/utils";
import type { ProjectPerson } from "../../hooks/useProjectPeople";

/** Initials in a circle — the frames' avatar. Decoration: the name beside it is what a screen reader hears. */
export function PersonAvatar({ name, className }: { name: string; className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-700",
				className,
			)}
		>
			{initialsOf(name)}
		</span>
	);
}

/** A person in a picker: avatar, name and the muted "@handle", as Tidsplan and Dagbok draw them. */
export function PersonLabel({ person }: { person: ProjectPerson }) {
	return (
		<span className="flex min-w-0 items-center gap-2">
			<PersonAvatar name={person.name} />
			<span className="truncate text-slate-900">{person.name}</span>
			<span className="shrink-0 text-slate-500">{person.handle}</span>
		</span>
	);
}
