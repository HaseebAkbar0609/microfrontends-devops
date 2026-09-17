"use client";

import { ChevronDown, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useParticipants } from "../../shared/api";
import { MyPagesQueryState } from "../../shared/feedback";

interface ParticipantSelectProps {
	value: string[];
	onChange: (value: string[]) => void;
	showHandles?: boolean;
}

const initials = (name: string) =>
	name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

const ParticipantSelect = ({
	value,
	onChange,
	showHandles = false,
}: ParticipantSelectProps) => {
	const query = useParticipants();
	const PROTOCOL_PARTICIPANTS = query.data ?? [];
	const selected = PROTOCOL_PARTICIPANTS.filter((participant) =>
		value.includes(participant.id),
	);

	const toggle = (id: string) =>
		onChange(
			value.includes(id)
				? value.filter((item) => item !== id)
				: [...value, id],
		);

	return (
		<><MyPagesQueryState query={query} /><Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="flex min-h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-left text-sm"
				>
					<span className="flex flex-wrap items-center gap-1.5">
						{selected.map((participant) => (
							<span
								key={participant.id}
								className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 py-0.5 pl-1 pr-1.5 text-xs text-slate-700"
							>
								<span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-medium text-slate-600">
									{initials(participant.name)}
								</span>
								{participant.name}
								{showHandles && (
									<span className="text-slate-400">
										{participant.handle}
									</span>
								)}
								<span
									role="button"
									tabIndex={0}
									aria-label={participant.name}
									onClick={(event) => {
										event.stopPropagation();
										toggle(participant.id);
									}}
									onKeyDown={(event) => {
										if (
											event.key === "Enter" ||
											event.key === " "
										) {
											event.preventDefault();
											event.stopPropagation();
											toggle(participant.id);
										}
									}}
									className="cursor-pointer"
								>
									<X className="h-3 w-3 text-slate-400" />
								</span>
							</span>
						))}
					</span>
					<ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-[var(--radix-popover-trigger-width)] rounded-md border border-slate-200 bg-white p-1 shadow-md"
			>
				{PROTOCOL_PARTICIPANTS.map((participant) => (
					<label
						key={participant.id}
						className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
					>
						<Checkbox
							checked={value.includes(participant.id)}
							onCheckedChange={() => toggle(participant.id)}
						/>
						{participant.name}
						<span className="text-slate-400">
							{participant.handle}
						</span>
					</label>
				))}
			</PopoverContent>
		</Popover></>
	);
};

export default ParticipantSelect;
