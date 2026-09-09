"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { UseFormReturn } from "react-hook-form";
import { User, ChevronUp, ChevronDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_CONSTANTS } from "../../constants/protocol.constants";
import type { EditProtocolFormData } from "../../validation/protocol.validation";

function UserAvatarBadge({ initials, avatarUrl, size = "md" }: { initials: string; avatarUrl?: string; size?: "sm" | "md" }) {
	const sizeClass = size === "sm" ? "h-5 w-5" : "h-6 w-6";
	const textClass = size === "sm" ? "text-[9px]" : "text-[10px]";
	return avatarUrl ? (
		<Image
			src={avatarUrl}
			alt={initials}
			width={size === "sm" ? 20 : 24}
			height={size === "sm" ? 20 : 24}
			className={cn("rounded-full object-cover border border-slate-200 shrink-0 select-none", sizeClass)}
		/>
	) : (
		<span
			className={cn(
				"rounded-full border border-slate-200 bg-slate-100 text-slate-700 font-medium flex items-center justify-center shrink-0 select-none",
				sizeClass,
				textClass
			)}
		>
			{initials}
		</span>
	);
}

export interface EditProtocolParticipantsSectionProps {
	form: UseFormReturn<EditProtocolFormData>;
	defaultOpen?: boolean;
}

export function EditProtocolParticipantsSection({
	form,
	defaultOpen = true,
}: EditProtocolParticipantsSectionProps) {
	const t = useTranslate();
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const selectedParticipants = form.watch("participants") || [];
	const currentHost = form.watch("host") || PROTOCOL_CONSTANTS.DEFAULT_RESPONSIBLE;

	const handleAddParticipant = (userName: string) => {
		if (!selectedParticipants.includes(userName)) {
			form.setValue("participants", [...selectedParticipants, userName], {
				shouldValidate: true,
				shouldDirty: true,
			});
		}
	};

	const handleRemoveParticipant = (userName: string) => {
		form.setValue(
			"participants",
			selectedParticipants.filter((p) => p !== userName),
			{
				shouldValidate: true,
				shouldDirty: true,
			}
		);
	};

	const handleSelectHost = (userName: string) => {
		form.setValue("host", userName, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	const getUserInfo = (userName?: string | null) => {
		const safeName = (userName || PROTOCOL_CONSTANTS.DEFAULT_RESPONSIBLE).trim();
		const found = PROTOCOL_CONSTANTS.AVAILABLE_USERS.find((u) => u.name === safeName);
		if (found) return found;
		const initials = safeName
			.split(" ")
			.filter(Boolean)
			.map((n) => n[0])
			.join("")
			.slice(0, 2)
			.toUpperCase() || "U";
		const handle = `@${safeName.toLowerCase().replace(/\s+/g, "")}`;
		return { name: safeName, handle, initials, avatarUrl: undefined };
	};

	const hostInfo = getUserInfo(currentHost);

	return (
		<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full flex flex-col">
			{/* Accordion Header */}
			<Button
				type="button"
				variant="ghost"
				onClick={() => setIsOpen((prev) => !prev)}
				className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between border-b border-zinc-200 bg-white px-6 sm:px-8 text-left hover:bg-slate-50/50 rounded-none shadow-none font-normal"
				aria-expanded={isOpen}
			>
				<div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
					<User className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} aria-hidden="true" />
					<h3 className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900 truncate">
						<Translate text={localizationConstants.protocolFieldParticipants} />
					</h3>
				</div>
				<ChevronUp
					size={18}
					className={cn(
						"text-zinc-500 transition-transform duration-200 shrink-0",
						!isOpen && "rotate-180"
					)}
					aria-hidden={true}
				/>
			</Button>

			{/* Accordion Body */}
			{isOpen && (
				<div className="p-4 sm:p-6">
					<div className="space-y-4 w-full">
					{/* Field 1: Värd */}
					<FormField
						control={form.control}
						name="host"
						render={() => (
							<FormItem className="space-y-1">
								<FormLabel className="text-xs font-semibold text-slate-900">
									<Translate text={localizationConstants.protocolFieldHost} />
								</FormLabel>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<FormControl>
											<Button
												type="button"
												variant="outline"
												className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex items-center justify-between shadow-none hover:bg-slate-50 cursor-pointer"
											>
												<div className="flex items-center gap-2 min-w-0">
													<UserAvatarBadge initials={hostInfo.initials} avatarUrl={hostInfo.avatarUrl} size="md" />
													<span className="font-medium text-slate-900 truncate text-xs sm:text-sm">
														{hostInfo.name}
													</span>
													<span className="text-slate-400 text-xs truncate">
														{hostInfo.handle}
													</span>
												</div>
												<ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
											</Button>
										</FormControl>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="w-64 bg-white border border-slate-200 shadow-lg rounded-lg p-1 z-50">
										{PROTOCOL_CONSTANTS.AVAILABLE_USERS.map((user) => (
											<DropdownMenuItem
												key={user.name}
												onClick={() => handleSelectHost(user.name)}
												className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-100 text-xs"
											>
												<UserAvatarBadge initials={user.initials} avatarUrl={user.avatarUrl} size="md" />
												<div className="flex items-center gap-1.5 min-w-0 flex-1">
													<span className="font-medium text-slate-900 truncate">{user.name}</span>
													<span className="text-slate-400 text-[11px] truncate">{user.handle}</span>
												</div>
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
								<FormMessage className="text-xs font-medium text-red-500 mt-1" />
							</FormItem>
						)}
					/>

					{/* Field 2: Deltagare */}
					<FormField
						control={form.control}
						name="participants"
						render={() => (
							<FormItem className="space-y-1.5">
								<FormLabel className="text-xs font-semibold text-slate-900">
									<Translate text={localizationConstants.protocolFieldParticipants} />
								</FormLabel>
								<div className="min-h-[52px] w-full rounded-lg border border-slate-200 bg-white p-2.5 sm:p-3 flex items-center justify-between gap-2 sm:gap-3">
									<div className="flex flex-wrap flex-1 min-w-0 pr-1">
										{selectedParticipants.length > 0 ? (
											selectedParticipants.map((participant, idx) => {
												const info = getUserInfo(participant);
												const isLast = idx === selectedParticipants.length - 1;
												return (
													<div
														key={participant}
														className={`flex items-center justify-between gap-2 w-[215px] min-w-0 py-1 ${!isLast ? "border-r border-slate-200 pr-2 mr-2" : ""}`}
													>
														<div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
															<UserAvatarBadge initials={info.initials} avatarUrl={info.avatarUrl} size="md" />
															<span className="font-medium text-slate-900 truncate text-xs sm:text-sm">{info.name}</span>
															<span className="text-zinc-500 font-normal truncate text-xs sm:text-sm">{info.handle}</span>
														</div>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															onClick={() => handleRemoveParticipant(participant)}
															className="h-6 w-6 p-0 text-slate-400 hover:text-slate-700 hover:bg-transparent cursor-pointer shrink-0 ml-0.5"
															aria-label={t(localizationConstants.btnRadera)}
														>
															<X className="h-3.5 w-3.5" />
														</Button>
													</div>
												);
											})
										) : (
											<div className="flex items-center px-1 py-1">
												<span className="text-xs text-slate-400">
													<Translate text={localizationConstants.protocolFieldAddParticipants} />
												</span>
											</div>
										)}
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="h-7 w-7 p-1 text-slate-400 hover:text-slate-700 hover:bg-transparent cursor-pointer shrink-0 self-center shadow-none"
												aria-label="Add participant"
											>
												<ChevronDown className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-md rounded-lg p-1 z-50">
											{PROTOCOL_CONSTANTS.AVAILABLE_USERS.map((user) => (
												<DropdownMenuItem
													key={user.name}
													onClick={() => handleAddParticipant(user.name)}
													disabled={selectedParticipants.includes(user.name)}
													className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-100 text-xs"
												>
													<UserAvatarBadge initials={user.initials} avatarUrl={user.avatarUrl} size="md" />
													<div className="flex items-center gap-1.5 min-w-0 flex-1">
														<span className="font-medium text-slate-900 truncate">{user.name}</span>
														<span className="text-slate-400 text-[11px] truncate">{user.handle}</span>
													</div>
													<Plus className="h-3.5 w-3.5 ml-auto text-zinc-500 shrink-0" />
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
								<FormMessage className="text-xs font-medium text-red-500 mt-1" />
							</FormItem>
						)}
					/>
					</div>
				</div>
			)}
		</div>
	);
}

export default EditProtocolParticipantsSection;
