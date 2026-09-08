"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { ChevronDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { CreateProtocolFormData } from "../CreateProtocolModal";

export interface MeetingParticipantsFieldProps {
    participants: string[];
    onAddParticipant: (name: string) => void;
    onRemoveParticipant: (name: string) => void;
    form: UseFormReturn<CreateProtocolFormData>;
}

export function MeetingParticipantsField({
    participants,
    onAddParticipant,
    onRemoveParticipant,
    form,
}: MeetingParticipantsFieldProps) {
    const t = useTranslate();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            {/* Lägg till deltagare */}
            <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-900">
                    <Translate text={localizationConstants.protocolAddParticipantsLabel} />
                </p>
                <DropdownMenu>
                    <div className="min-h-[40px] rounded-lg border border-slate-200 bg-white p-1.5 flex flex-wrap items-center gap-1.5 justify-between">
                        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                            {participants.map((p) => (
                                <span
                                    key={p}
                                    className="inline-flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs px-2 py-0.5 rounded transition-colors"
                                >
                                    <span>{p}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveParticipant(p);
                                        }}
                                        className="h-3.5 w-3.5 p-0 text-zinc-500 hover:text-zinc-900 hover:bg-transparent cursor-pointer"
                                    >
                                        <X className="h-3 w-3 text-zinc-500" />
                                    </Button>
                                </span>
                            ))}
                        </div>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0 text-zinc-500 hover:text-zinc-900 hover:bg-transparent cursor-pointer shrink-0"
                                aria-label={t(localizationConstants.ariaLabelAddParticipant)}
                            >
                                <ChevronDown className="h-4 w-4 text-zinc-500" />
                            </Button>
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent align="start" className="w-48 bg-white border border-slate-200 shadow-md rounded-lg p-1 z-50">
                        {PROTOCOL_CONSTANTS.AVAILABLE_PARTICIPANTS.map((cand) => (
                            <DropdownMenuItem
                                key={cand}
                                onClick={() => onAddParticipant(cand)}
                                disabled={participants.includes(cand)}
                                className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
                            >
                                <Plus className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
                                {cand}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Plats */}
            <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-900">
                            <Translate text={localizationConstants.protocolLocationLabel} />
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder={t(localizationConstants.protocolLocationPlaceholder)}
                                className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

export default MeetingParticipantsField;
