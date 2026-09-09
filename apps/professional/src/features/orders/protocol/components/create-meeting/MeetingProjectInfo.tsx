"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export interface MeetingProjectInfoProps {
    projectNumber: string;
    projectName: string;
}

export function MeetingProjectInfo({
    projectNumber,
    projectName,
}: MeetingProjectInfoProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
                <p className="text-xs font-semibold text-slate-900 mb-0.5">
                    <Translate text={localizationConstants.projectNumberLabel} />
                </p>
                <p className="text-sm text-slate-500 font-normal">{projectNumber}</p>
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-900 mb-0.5">
                    <Translate text={localizationConstants.projectNameLabel} />
                </p>
                <p className="text-sm text-slate-500 font-normal">{projectName}</p>
            </div>
        </div>
    );
}

export default MeetingProjectInfo;
